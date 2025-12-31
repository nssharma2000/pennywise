# Contributing to PennyWise

First off, thank you for considering contributing! It’s people like you who make this project better for everyone.

Please take a moment to review this document to make the contribution process easy and effective for everyone involved.

## Local Development Setup

This project is built with **SolidJS**, **Vite**, and uses **TypeScript**.

### 1. Prerequisites

* **Node.js**: v18.0 or higher
* **Package Manager**: `pnpm` (preferred), `npm`, or `yarn`

### 2. Getting Started

1. **Fork** the repository.
2. **Clone** your fork:

```bash
git clone https://github.com/kushagra-aa/pennywise.git

```

1. **Install dependencies**:

```bash
pnpm install

```

1. **Run the development server**:

```bash
pnpm dev

```

## PWA Development & Testing

Since this is a Progressive Web App, changes to the **Service Worker** or **Web Manifest** require special attention.

### Testing Service Workers

By default, the Service Worker is disabled in development mode to prevent caching issues. To test PWA features (Offline mode, Install prompt):

1. **Build the project**:

```bash
pnpm build

```

1. **Preview the build locally**:

```bash
pnpm preview

```

1. Open the browser DevTools -> **Application** tab to inspect the Service Worker and Manifest.

### PWA Guidelines

* Ensure all new assets (icons, splash screens) are registered in the `vite.config.ts` PWA plugin configuration.
* Test navigation while "Offline" in the Network tab to ensure the shell loads correctly.

## Branching Strategy

* **`master`**: The stable production branch.
* **Feature Branches**: Please create a branch for your work:
* `feat/your-feature-name`
* `fix/bug-description`
* `docs/update-info`

## Standards & Best Practices

* **SolidJS Reactivity**: Avoid destructuring props, as it breaks reactivity. Use `splitProps` or access them directly (e.g., `props.name`).
* **TypeScript**: Use strict types where possible. Avoid `any`.
* **Styling**: use Tailwind classes when possible.

## Submitting a Pull Request

1. **Sync your fork**: Ensure your branch is up to date with the latest `master` changes.
2. **Commit messages**: Use descriptive titles (e.g., `feat: add push notification support`).
3. **Fill out the template**: When opening the PR, describe **what** you changed and **why**.
4. **Wait for review**: A maintainer will review your code. Please be open to feedback!

## Reporting Issues

If you find a bug, please open an issue and include:

* A clear description of the problem.
* Steps to reproduce the bug.
* Your environment (Browser, OS, Device).

Thank you for helping us build a better PennyWise!
