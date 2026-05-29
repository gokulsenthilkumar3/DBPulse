# Contributing to DBPulse

Thank you for your interest in contributing to DBPulse! This document outlines the process for contributing code, documentation, bug reports, and feature requests.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Branch Strategy](#branch-strategy)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Adding a New DB Connector](#adding-a-new-db-connector)

---

## Code of Conduct

Be respectful. Be constructive. We welcome contributors of all experience levels.

---

## Getting Started

1. Fork the repository
2. Clone your fork
3. Set up the development environment (see below)
4. Create a branch for your change
5. Make your changes
6. Submit a Pull Request

---

## Development Setup

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- A Supabase project (free tier works)

### Install dependencies

```bash
git clone https://github.com/your-fork/DBPulse.git
cd DBPulse
pnpm install
```

### Environment setup

```bash
cp .env.example .env
# Fill in your Supabase URL, anon key, and Redis URL
```

### Run in development mode

```bash
# Start Redis (Docker)
docker compose up redis -d

# Start API
pnpm --filter api dev

# Start Frontend
pnpm --filter web dev
```

### Run tests

```bash
pnpm test
```

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code |
| `dev` | Active development, integration branch |
| `feature/[name]` | New features |
| `fix/[name]` | Bug fixes |
| `docs/[name]` | Documentation updates |
| `chore/[name]` | Tooling, config, dependency updates |

Always branch from `dev`, not `main`.

---

## Commit Convention

DBPulse uses **Conventional Commits**:

```
<type>(<scope>): <short description>
```

### Types

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `chore` | Build process, dependencies |
| `refactor` | Code change, no new feature or bug fix |
| `test` | Adding or updating tests |
| `perf` | Performance improvement |

### Examples

```
feat(connector): add MySQL binlog parsing support
fix(diff): handle NULL before_state in UPDATE events
docs(readme): update quick start instructions
chore(deps): upgrade NestJS to v10.3
```

---

## Pull Request Process

1. **Target branch:** Always open PRs against `dev`
2. **Title:** Follow the commit convention format
3. **Description:** Fill in the PR template (what, why, how)
4. **Tests:** Include tests for new features or bug fixes
5. **Docs:** Update relevant docs if your change affects behavior
6. **Review:** At least one approval required before merge

### PR Checklist

- [ ] Code follows the existing style (ESLint + Prettier)
- [ ] All tests pass (`pnpm test`)
- [ ] New features have tests
- [ ] Documentation updated if needed
- [ ] No console.log statements left in code
- [ ] Environment variables added to `.env.example`

---

## Reporting Bugs

Open a GitHub Issue with:

1. **Title:** Clear, concise description of the bug
2. **DB Engine:** Which database were you using?
3. **Steps to Reproduce:** Numbered steps to reproduce the issue
4. **Expected Behavior:** What you expected to happen
5. **Actual Behavior:** What actually happened
6. **Environment:** OS, Node version, DBPulse version
7. **Logs:** Relevant error logs or screenshots

Use the `bug` label when creating the issue.

---

## Suggesting Features

Open a GitHub Issue with:

1. **Title:** `[Feature Request] Short description`
2. **Problem:** What problem does this solve?
3. **Proposed Solution:** How should it work?
4. **Alternatives:** Any alternatives you considered?
5. **DB Engine Impact:** Does this affect specific connectors?

Use the `enhancement` label.

---

## Adding a New DB Connector

Connectors live in `packages/connectors/`. Each connector must:

1. Implement the `IConnector` interface from `packages/shared`
2. Export a `createConnector(config)` factory function
3. Include a `README.md` documenting required DB permissions and config
4. Include unit tests in `__tests__/`
5. Add the connector to the connector registry in `apps/api/src/connectors/registry.ts`

```typescript
// Minimal connector structure
export class MyDbConnector implements IConnector {
  async connect(config: ConnectionConfig): Promise<void> { ... }
  async disconnect(): Promise<void> { ... }
  async startCapture(handler: EventHandler): Promise<void> { ... }
  async stopCapture(): Promise<void> { ... }
  async healthCheck(): Promise<HealthStatus> { ... }
}
```

See `packages/connectors/postgres/` for a reference implementation.

---

## Questions?

Open a Discussion on GitHub or reach out via the Issues tab.

---

*Thank you for helping make DBPulse better!*
