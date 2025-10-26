const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    // Get inputs
    const token = core.getInput('github_token', { required: true });
    const protectedBranches = core.getInput('protected_branches') || 'main,master,develop,development,staging,production';
    const dryRun = core.getInput('dry_run') === 'true';
    const deleteOnMerge = core.getInput('delete_on_merge') !== 'false'; // default true
    const deleteStale = core.getInput('delete_stale') === 'true';
    const staleDays = parseInt(core.getInput('stale_days') || '90', 10);

    // Get context
    const context = github.context;
    const octokit = github.getOctokit(token);

    core.info(`🧹 Branch Cleanup Bot started`);
    core.info(`Repository: ${context.repo.owner}/${context.repo.repo}`);
    core.info(`Event: ${context.eventName}`);

    // Parse protected branches
    const protectedBranchList = protectedBranches
      .split(',')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    core.info(`Protected branches: ${protectedBranchList.join(', ')}`);

    // Handle pull_request events (merged PRs)
    if (context.eventName === 'pull_request' && deleteOnMerge) {
      const pr = context.payload.pull_request;
      
      if (pr.merged === true) {
        const branchName = pr.head.ref;
        const branchOwner = pr.head.repo.owner.login;
        const repoOwner = context.repo.owner;

        core.info(`✅ PR #${pr.number} was merged`);
        core.info(`Branch to delete: ${branchName}`);

        // Check if branch is from the same repo (not a fork)
        if (branchOwner !== repoOwner) {
          core.info(`⏭️ Skipping: Branch is from a fork (${branchOwner})`);
          return;
        }

        // Check if branch is protected
        if (protectedBranchList.includes(branchName)) {
          core.info(`🔒 Skipping: Branch '${branchName}' is protected`);
          return;
        }

        // Check if branch matches protected patterns
        const isProtectedPattern = protectedBranchList.some(pattern => {
          if (pattern.includes('*')) {
            const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
            return regex.test(branchName);
          }
          return false;
        });

        if (isProtectedPattern) {
          core.info(`🔒 Skipping: Branch '${branchName}' matches a protected pattern`);
          return;
        }

        // Delete the branch
        if (dryRun) {
          core.info(`🔍 DRY RUN: Would delete branch '${branchName}'`);
        } else {
          try {
            await octokit.rest.git.deleteRef({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: `heads/${branchName}`
            });
            core.info(`🗑️ Successfully deleted branch '${branchName}'`);
          } catch (error) {
            if (error.status === 422) {
              core.warning(`Branch '${branchName}' was already deleted`);
            } else {
              throw error;
            }
          }
        }
      } else {
        core.info(`ℹ️ PR #${pr.number} was closed but not merged - no action taken`);
      }
    }

    // Handle workflow_dispatch or schedule events (stale branch cleanup)
    if ((context.eventName === 'workflow_dispatch' || context.eventName === 'schedule') && deleteStale) {
      core.info(`🔍 Scanning for stale branches (older than ${staleDays} days)...`);

      // Get all branches
      const { data: branches } = await octokit.rest.repos.listBranches({
        owner: context.repo.owner,
        repo: context.repo.repo,
        per_page: 100
      });

      core.info(`Found ${branches.length} branches`);

      const now = new Date();
      const staleThreshold = new Date(now.getTime() - staleDays * 24 * 60 * 60 * 1000);
      let deletedCount = 0;

      for (const branch of branches) {
        const branchName = branch.name;

        // Skip protected branches
        if (protectedBranchList.includes(branchName)) {
          continue;
        }

        // Skip protected patterns
        const isProtectedPattern = protectedBranchList.some(pattern => {
          if (pattern.includes('*')) {
            const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
            return regex.test(branchName);
          }
          return false;
        });

        if (isProtectedPattern) {
          continue;
        }

        // Get the last commit date
        try {
          const { data: commit } = await octokit.rest.repos.getCommit({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: branch.commit.sha
          });

          const commitDate = new Date(commit.commit.committer.date);

          if (commitDate < staleThreshold) {
            const daysSinceCommit = Math.floor((now - commitDate) / (1000 * 60 * 60 * 24));
            
            if (dryRun) {
              core.info(`🔍 DRY RUN: Would delete stale branch '${branchName}' (last commit: ${daysSinceCommit} days ago)`);
            } else {
              await octokit.rest.git.deleteRef({
                owner: context.repo.owner,
                repo: context.repo.repo,
                ref: `heads/${branchName}`
              });
              core.info(`🗑️ Deleted stale branch '${branchName}' (last commit: ${daysSinceCommit} days ago)`);
              deletedCount++;
            }
          }
        } catch (error) {
          core.warning(`Failed to process branch '${branchName}': ${error.message}`);
        }
      }

      core.info(`✅ Stale branch cleanup complete. Deleted ${deletedCount} branches.`);
    }

    core.info('✨ Branch Cleanup Bot finished successfully');

  } catch (error) {
    core.setFailed(`❌ Action failed: ${error.message}`);
  }
}

run();

