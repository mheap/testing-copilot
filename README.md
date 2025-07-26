# Robots are here 🤖

A TypeScript-based Electron application with a data model library, built with pnpm workspaces.

## Structure

This is a monorepo containing:

- **`packages/app`** - "Robots are here" Electron application
- **`packages/data-model`** - TypeScript library with Sequelize models

## Requirements

- Node.js (LTS)
- pnpm (package manager)

## Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run the Electron app
pnpm dev
```

## Development

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter robots-are-here build
pnpm --filter data-model build
```

### Development mode

```bash
# Run Electron app in development
pnpm dev

# Watch mode for data-model
pnpm --filter data-model dev
```

## Data Model

The `data-model` package includes:

- **User model** with fields: `id`, `name`, `email`
- Sequelize-based ORM setup
- TypeScript types and interfaces

## Changelog Management

This project uses [Changesets](https://github.com/changesets/changesets) for version management:

```bash
# Add a changeset
pnpm changeset

# Version packages
pnpm version-packages

# Publish (when ready)
pnpm release
```