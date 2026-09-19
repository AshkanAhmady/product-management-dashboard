# Product Management Dashboard

A product management dashboard built with React and TypeScript that allows users to efficiently browse, search, filter, create, edit, and delete products.

The project focuses on scalable data handling, efficient server-state synchronization, form validation, optimistic updates, and a maintainable frontend architecture.

## Tech Stack

- React
- TypeScript
- Vite
- TanStack Query
- React Hook Form
- Zod
- React Router
- Tailwind CSS
- shadcn/ui
- pnpm

> Additional tooling and libraries will be documented as the project evolves.

## Prerequisites

Make sure the following tools are installed:

- Node.js 20 or later
- pnpm 10 or later

The project is currently developed using:

- Node.js `v23.6.0`
- pnpm `v10.33.0`

## Getting Started

Clone the repository:

```bash
git clone <repository-url>
cd product-management-dashboard
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Then open the local URL displayed by Vite in your browser.

## Available Scripts

Start the development server:

```bash
pnpm dev
```

Create a production build:

```bash
pnpm build
```

Run ESLint:

```bash
pnpm lint
```

Preview the production build:

```bash
pnpm preview
```

## Core Features

The dashboard is designed to support:

- Product listing with efficient pagination
- Large dataset handling
- Debounced product search
- Filtering by status and category
- URL-synchronized filters and pagination
- Product creation and editing
- Strict form validation
- Cross-field validation
- Asynchronous SKU uniqueness validation
- Optimistic edit and delete operations
- Automatic rollback when mutations fail
- Efficient server-state caching
- Loading, error, empty, and mutation states
- Responsive user interface

## Architecture

The application follows a feature-based architecture with a clear separation between:

- Server state
- URL state
- Local UI state
- API communication
- Validation
- Reusable UI components

Detailed architectural decisions and trade-offs will be documented once the implementation is complete.

## Testing

Testing strategy and instructions will be documented after the test setup is finalized.

## Architectural Decisions

Detailed information about major architectural decisions, including data fetching, cache synchronization, URL state management, validation, and large dataset handling, will be added as the implementation progresses.

## What I Would Improve With More Time

Additional improvements and production considerations will be documented after the core requirements are complete.
