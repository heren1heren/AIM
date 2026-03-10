## The branch specification supports the following prefixes and should be structured as:

"<type>/<description>"

main: The main development branch (e.g., main, master, or develop)

feature/: For new features (e.g., feature/add-login-page, feat/add-login-page)

bugfix/ (or fix/): For bug fixes (e.g., bugfix/fix-header-bug, fix/header-bug)

hotfix/: For urgent fixes (e.g., hotfix/security-patch)

release/: For branches preparing a release (e.g., release/v1.2.0)

chore/: For non-code tasks like dependency, docs updates (e.g., chore/update-dependencies)

## Basic Rules

# Use Lowercase Alphanumerics, Hyphens, and Dots: Always use lowercase letters (a-z), numbers (0-9), and hyphens (-) to separate words. Avoid special characters, underscores, or spaces. For release branches, dots (.) may be used in the description to represent version numbers (e.g., release/v1.2.0).

# No Consecutive, Leading, or Trailing Hyphens or Dots: Ensure that hyphens and dots do not appear consecutively (e.g., feature/new--login, release/v1.-2.0), nor at the start or end of the description (e.g., feature/-new-login, release/v1.2.0.).

# Keep It Clear and Concise: The branch name should be descriptive yet concise, clearly indicating the purpose of the work.

# Include Ticket Numbers: If applicable, include the ticket number from your project management tool to make tracking easier. For example, for a ticket issue-123, the branch name could be feature/issue-123-new-login.
