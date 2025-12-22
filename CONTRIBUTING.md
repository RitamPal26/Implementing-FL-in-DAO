# Contributing to DAO

We love your input! We want to make contributing to this DAO project as easy and transparent as possible.

## Development Process

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Write or update tests
5. Ensure tests pass
6. Submit a pull request

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update documentation in the docs/ folder
3. Add tests for new functionality
4. Ensure all tests pass: `npm test`
5. Update the CHANGELOG.md
6. Follow the code style guide

## Code Style

### Solidity
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use 4 spaces for indentation
- Add NatSpec comments for all public functions
- Keep functions small and focused

```solidity
/**
 * @dev Description of function
 * @param paramName Description of parameter
 * @return Description of return value
 */
function exampleFunction(uint256 paramName) external returns (uint256) {
    // Implementation
}
```

### JavaScript
- Use 2 spaces for indentation
- Use async/await over promises when possible
- Add JSDoc comments for complex functions
- Use meaningful variable names

## Testing

### Running Tests
```bash
npm test
```

### Test Coverage
```bash
npm run coverage
```

Aim for >90% coverage on all contracts.

### Writing Tests
- Test happy paths
- Test edge cases
- Test access control
- Test failure scenarios

Example:
```javascript
describe("Feature", function() {
  it("Should do something", async function() {
    // Arrange
    const expected = 100;
    
    // Act
    const result = await contract.someFunction();
    
    // Assert
    expect(result).to.equal(expected);
  });
});
```

## Commit Messages

Use conventional commits:
```
feat: add new feature
fix: bug fix
docs: documentation changes
test: add or update tests
refactor: code refactoring
chore: maintenance tasks
```

Example:
```
feat: add proposal cancellation function

- Add cancel() function to Governor
- Update tests
- Add documentation
```

## Issue Reporting

### Bug Reports
Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
- Error messages/logs

### Feature Requests
Include:
- Description of the feature
- Use case
- Proposed implementation
- Potential impact

## Security

If you discover a security vulnerability:
1. **DO NOT** open a public issue
2. Email security@example.com (replace with actual email)
3. Include detailed description
4. Wait for response before disclosure

## Community Guidelines

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Help others learn

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to ask questions in:
- GitHub Discussions
- Discord (if applicable)
- Community forums

Thank you for contributing! 🎉
