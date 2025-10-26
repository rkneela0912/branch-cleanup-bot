# Contributing to Branch Cleanup Bot

Thank you for your interest in contributing to Branch Cleanup Bot! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Your workflow configuration (if relevant)
- Any error messages or logs

### Suggesting Features

We love new ideas! To suggest a feature:
- Open an issue with the `enhancement` label
- Describe the feature and its use case
- Explain how it would benefit users

### Submitting Pull Requests

1. **Fork the repository** and create a new branch
2. **Make your changes** in the new branch
3. **Test your changes** thoroughly
4. **Build the distribution** with `npm run build`
5. **Commit your changes** with clear commit messages
6. **Push to your fork** and submit a pull request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/branch-cleanup-bot.git
cd branch-cleanup-bot

# Install dependencies
npm install

# Make your changes in src/index.js

# Build the distribution
npm run build

# Test locally (create a test workflow in a test repo)
```

### Code Guidelines

- Write clear, readable code with comments where necessary
- Follow the existing code style
- Test your changes before submitting
- Update documentation if you change functionality

### Building

After making changes to `src/index.js`, always run:

```bash
npm run build
```

This compiles your code into `dist/index.js` which is what GitHub Actions actually runs.

### Testing

Before submitting a PR:
1. Create a test repository
2. Add your modified action to a workflow
3. Test all relevant scenarios:
   - Merged PR cleanup
   - Stale branch cleanup
   - Protected branch handling
   - Dry-run mode

### Commit Messages

Use clear, descriptive commit messages:
- `feat: add support for wildcard patterns in protected branches`
- `fix: handle edge case when branch is already deleted`
- `docs: update README with new examples`
- `refactor: improve error handling logic`

### Pull Request Process

1. Ensure your PR description clearly explains the changes
2. Link any related issues
3. Make sure all checks pass
4. Be responsive to feedback and questions
5. Update documentation as needed

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Assume good intentions

## Questions?

If you have questions about contributing, feel free to:
- Open an issue with the `question` label
- Reach out to the maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Branch Cleanup Bot better! 🎉

