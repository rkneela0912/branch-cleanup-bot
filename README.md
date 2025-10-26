# Branch Cleanup Bot 🧹

[![GitHub release](https://img.shields.io/github/v/release/rkneela0912/branch-cleanup-bot)](https://github.com/rkneela0912/branch-cleanup-bot/releases) [![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Automatically delete merged branches and clean up stale branches in your GitHub repositories.

## Features

- **Auto-delete merged branches**: Automatically removes branches when pull requests are merged
- **Stale branch cleanup**: Identifies and removes branches with no recent activity
- **Protected branches**: Configure which branches should never be deleted
- **Wildcard support**: Use patterns like `release/*` to protect multiple branches
- **Dry-run mode**: Test the action without actually deleting branches
- **Detailed logging**: Clear visibility into what branches are being deleted and why

## Quick Start

### Auto-delete merged branches

Add this workflow to `.github/workflows/branch-cleanup.yml`:

```yaml
name: Branch Cleanup
on:
  pull_request:
    types: [closed]

jobs:
  cleanup:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: rkneela0912/branch-cleanup-bot@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

### Clean up stale branches

For periodic cleanup of stale branches, use a scheduled workflow:

```yaml
name: Stale Branch Cleanup
on:
  schedule:
    - cron: '0 0 * * 0'  # Run every Sunday at midnight
  workflow_dispatch:  # Allow manual triggers

jobs:
  cleanup:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: rkneela0912/branch-cleanup-bot@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          delete_stale: true
          stale_days: 90
```

## Configuration

### Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `github_token` | GitHub token for API access | ✅ Yes | - |
| `protected_branches` | Comma-separated list of branches to protect (supports wildcards) | No | `main,master,develop,development,staging,production` |
| `delete_on_merge` | Delete branches when PRs are merged | No | `true` |
| `delete_stale` | Enable stale branch cleanup | No | `false` |
| `stale_days` | Days before a branch is considered stale | No | `90` |
| `dry_run` | Test mode - log actions without deleting | No | `false` |

### Advanced Example

```yaml
name: Branch Cleanup
on:
  pull_request:
    types: [closed]
  schedule:
    - cron: '0 0 * * 0'
  workflow_dispatch:

jobs:
  cleanup:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: rkneela0912/branch-cleanup-bot@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          protected_branches: 'main,master,develop,release/*,hotfix/*'
          delete_on_merge: true
          delete_stale: true
          stale_days: 60
          dry_run: false
```

**More examples**: Check the [`examples/`](examples/) directory for ready-to-use workflow templates.

## How It Works

### Merged Branch Deletion

When a pull request is closed:
1. Checks if the PR was merged (not just closed)
2. Verifies the branch is not from a fork
3. Ensures the branch is not in the protected list
4. Deletes the source branch automatically

### Stale Branch Cleanup

When triggered by schedule or manual dispatch:
1. Scans all branches in the repository
2. Checks the last commit date for each branch
3. Identifies branches older than the configured threshold
4. Deletes stale branches (excluding protected ones)

## Protected Branches

By default, these branches are protected from deletion:
- `main`
- `master`
- `develop`
- `development`
- `staging`
- `production`

You can customize this list and use wildcards:

```yaml
protected_branches: 'main,master,develop,release/*,hotfix/*,feature/important-*'
```

## Permissions

The action requires the `contents: write` permission to delete branches:

```yaml
permissions:
  contents: write
```

## Dry Run Mode

Test the action without actually deleting branches:

```yaml
- uses: rkneela0912/branch-cleanup-bot@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    dry_run: true
```

This will log all actions that would be taken without making any changes.

## Examples

### Delete merged branches only

```yaml
- uses: rkneela0912/branch-cleanup-bot@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    delete_on_merge: true
    delete_stale: false
```

### Clean up stale branches only

```yaml
- uses: rkneela0912/branch-cleanup-bot@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    delete_on_merge: false
    delete_stale: true
    stale_days: 30
```

### Both merged and stale cleanup

```yaml
- uses: rkneela0912/branch-cleanup-bot@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    delete_on_merge: true
    delete_stale: true
    stale_days: 90
```

## Troubleshooting

### Branch not being deleted

1. **Check if the branch is protected**: Review your `protected_branches` configuration
2. **Verify permissions**: Ensure the workflow has `contents: write` permission
3. **Check if PR was merged**: The action only deletes branches from merged PRs, not closed ones
4. **Fork branches**: Branches from forked repositories are not deleted

### Enable debug logging

Add this to your workflow for detailed logs:

```yaml
env:
  ACTIONS_STEP_DEBUG: true
```

## License

[MIT License](LICENSE)

## Support

⭐ **Star this repo** if you find it helpful!

For issues or questions, please [open an issue](https://github.com/rkneela0912/branch-cleanup-bot/issues).

## Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Related Actions

Check out other automation tools:
- [Auto Assign Reviewers](https://github.com/rkneela0912/auto-assign-reviewers)
- [PR Size Labeler](https://github.com/rkneela0912/pr-size-labeler)
- [Auto Close Stale PRs](https://github.com/rkneela0912/auto-close-stale-prs)

---

**Made with ❤️ by [rkneela0912](https://github.com/rkneela0912)**

Keep your repositories clean and organized! 🧹✨

