# Product Management Dashboard

A product management dashboard built with React and TypeScript.

The application provides product listing, searching, filtering,
pagination, creation, editing, and deletion while focusing on scalable
frontend architecture, efficient server-state management, form
validation, and a responsive user experience.

The project also includes a local mock API server capable of handling a
large product dataset and simulating real-world network behavior such as
latency and request failures.

------------------------------------------------------------------------

## Features

-   Product listing
-   Server-side pagination
-   Search by product name or SKU
-   Debounced search
-   Filter by product status and category
-   URL-persisted search, filter, and pagination state
-   Create, edit, and delete products
-   Form and cross-field validation
-   Asynchronous SKU uniqueness validation
-   Loading, error, and empty states
-   Optimistic updates for edit and delete operations
-   Rollback on mutation failure
-   Efficient server-state caching with TanStack Query
-   Large mock dataset with 100,000 products
-   Simulated API latency and controlled failures

## Tech Stack

### Frontend

-   React
-   TypeScript
-   Vite
-   TanStack Query
-   React Router
-   React Hook Form
-   Zod
-   Axios
-   Tailwind CSS
-   shadcn/ui

### Mock API

-   Node.js
-   Express
-   TypeScript
-   Faker
-   Zod

### Package Manager

-   pnpm

## Getting Started

### Requirements

-   Node.js
-   pnpm

### Install Dependencies

``` bash
pnpm install
```

## Running the Application

The project contains two development processes: the frontend application
and the mock API server.

### Start the Mock API Server

``` bash
pnpm mock:server
```

The API server runs at:

``` text
http://localhost:3001
```

API base URL:

``` text
http://localhost:3001/api
```

### Start the Frontend

Open another terminal and run:

``` bash
pnpm dev
```

Vite will display the local development URL in the terminal.

## Environment Variables

Create a `.env` file in the project root:

``` env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Project Structure

The frontend uses a lightweight layer-based architecture.

``` text
src/
├── api/
│   ├── http.ts
│   └── apiCaller.ts
├── app/
│   └── providers/
│       └── QueryProvider.tsx
├── components/
│   ├── products/
│   └── ui/
├── hooks/
│   ├── reactQuery/
│   │   ├── useQueryRequest.ts
│   │   └── useMutationRequest.ts
│   └── ...
├── pages/
│   └── Products/
├── schemas/
│   └── product.schema.ts
├── services/
│   └── productServices.ts
├── App.tsx
└── main.tsx
```

The mock backend is kept separately:

``` text
mock-server/
├── controllers/
│   └── products/
├── data/
├── middlewares/
├── routes/
├── schemas/
├── utils/
└── server.ts
```

Shared API contracts are located outside both applications:

``` text
shared/
└── contracts/
    ├── api.contract.ts
    └── product.contract.ts
```

This allows the frontend and mock backend to share TypeScript contracts
without duplicating API models.

## Architecture Decisions

### Layer-Based Frontend Architecture

The frontend intentionally uses a lightweight layer-based structure
instead of introducing a feature-based architecture.

The dashboard currently focuses on one primary business domain:
products. Introducing a `features/products` hierarchy would add
unnecessary nesting at the current project scale.

Responsibilities are instead separated into explicit layers:

``` text
api/
services/
hooks/
components/
pages/
schemas/
```

If additional domains such as users, orders, customers, or reports are
introduced, the application can be migrated toward feature-based
organization.

## API Architecture

API communication follows this flow:

``` text
Component
    ↓
useQueryRequest / useMutationRequest
    ↓
Service
    ↓
apiCaller
    ↓
Axios Instance
    ↓
API
```

### Axios Instance

The Axios instance contains shared HTTP configuration such as the base
URL, common headers, and common request behavior.

### apiCaller

`apiCaller` provides a reusable abstraction over the HTTP client and
prevents individual services from duplicating Axios-specific request
logic.

### Services

Services represent backend operations such as:

``` text
getProducts
createProduct
updateProduct
deleteProduct
checkSku
```

Components therefore do not communicate with Axios or the backend
directly.

### React Query Hooks

Reusable wrappers around TanStack Query are provided through
`useQueryRequest` and `useMutationRequest`.

These wrappers remain intentionally lightweight so important TanStack
Query behavior such as query keys, caching, optimistic updates, and
rollback remains explicit.

## Server State Management

TanStack Query is used for asynchronous server state, including:

-   Request lifecycle management
-   Loading and error states
-   Server-state caching
-   Query invalidation
-   Mutation handling
-   Optimistic updates
-   Rollback

Local UI state is kept separate from server state.

## URL State

Search, filtering, and pagination state is persisted in URL query
parameters.

Example:

``` text
/products?page=2&pageSize=20&search=iphone&status=active&category=Electronics
```

This makes dashboard state bookmarkable, shareable, persistent across
refreshes, and compatible with browser back/forward navigation.

The URL acts as the source of truth for product-list query state.

## Product List Strategy

The mock API contains 100,000 products. The frontend does not download
the complete dataset.

Instead, pagination, search, and filtering are processed by the server.

Example:

``` http
GET /api/products?page=1&pageSize=20
```

Only the requested page is transferred to and rendered by the browser.
This avoids unnecessary network transfer, browser memory consumption,
client-side filtering cost, and DOM rendering cost.

Because only a small page of records is rendered at a time, table
virtualization is not necessary for the current implementation.

## Search and Filtering

Products can be searched by product name or SKU and filtered by status
and category.

Search input is debounced to prevent an API request from being triggered
for every individual keystroke. Changing search or filter criteria
resets pagination when appropriate.

## Form Validation

Product forms use React Hook Form and Zod.

Validation includes:

-   Required fields
-   Minimum and maximum lengths
-   Numeric constraints
-   Integer stock validation
-   Category validation
-   Status validation
-   Cross-field business rules

For example, when the category is `Electronics`, weight must be greater
than zero.

The same business rule is validated by the mock API so backend integrity
does not depend solely on frontend validation.

## Async SKU Validation

SKU uniqueness is checked asynchronously before product submission:

``` http
GET /api/products/check-sku?sku=SKU-001
```

The create/update API also performs its own SKU uniqueness validation.

Frontend asynchronous validation improves user experience, while
server-side validation remains the final source of truth and protects
against race conditions.

## Optimistic Updates

Edit and delete operations use optimistic UI updates.

``` text
User Action
    ↓
Update Cached UI Immediately
    ↓
Send API Request
    ↓
Success ──────→ Keep Updated Cache
    │
    └ Failure → Roll Back Previous Cache
```

TanStack Query cache APIs are used to update the affected cached data
instead of unnecessarily refetching the entire product list.

## API Endpoints

### Get Products

``` http
GET /api/products
```

Supported query parameters:

``` text
page
pageSize
search
status
category
```

Example:

``` http
GET /api/products?page=1&pageSize=20&search=phone&status=active&category=Electronics
```

### Check SKU Availability

``` http
GET /api/products/check-sku?sku=SKU-001
```

### Create Product

``` http
POST /api/products
```

Example body:

``` json
{
  "name": "MacBook Pro M4",
  "sku": "MBP-M4-001",
  "category": "Electronics",
  "status": "active",
  "price": 2499,
  "weight": 1.6,
  "stock": 25
}
```

### Update Product

``` http
PATCH /api/products/:id
```

Partial updates are supported.

### Delete Product

``` http
DELETE /api/products/:id
```

## Mock API Behavior

The mock server intentionally simulates some characteristics of a real
backend.

### Network Latency

Requests include artificial latency so frontend loading behavior can be
observed during development.

### Controlled Mutation Failures

Mutation requests can intentionally be failed using:

``` http
x-mock-failure: true
```

This can be used with POST, PATCH, and DELETE requests. The server
responds with `500 Internal Server Error`, allowing optimistic-update
rollback and frontend error handling to be tested reproducibly.

## API Response Format

Successful and failed API responses use a consistent structure.

Successful response:

``` json
{
  "data": {},
  "message": "Request completed successfully"
}
```

Error response:

``` json
{
  "data": null,
  "message": "Something went wrong"
}
```

Shared TypeScript contracts are used by both the frontend and mock API.

## Design System

The frontend uses Tailwind CSS and shadcn/ui.

The goal is to maintain a small and consistent UI system without
introducing a large component framework.

Reusable UI primitives are kept separate from product-specific
components:

``` text
components/
├── ui/
│   └── reusable UI primitives
└── products/
    └── product-specific components
```

The design system maintains consistency across typography, spacing, form
controls, buttons, tables, dialogs, feedback states, loading states, and
error states.

Product-specific business logic is not placed inside generic UI
components.

## Error Handling

Errors flow through clearly separated boundaries:

``` text
Mock API
   ↓
Consistent API Error Response
   ↓
apiCaller
   ↓
React Query
   ↓
UI Feedback
```

The mock API also includes a global Express error handler for unexpected
errors and malformed JSON requests.

## Loading and Empty States

The UI explicitly handles:

-   Initial loading
-   Background fetching
-   Mutation pending states
-   Errors
-   Empty search results
-   Empty filtered results

## Development Principles

The project intentionally favors:

-   Clear separation of concerns
-   Type safety
-   Explicit data flow
-   Small reusable abstractions
-   Predictable server-state management
-   Reproducible error handling
-   Minimal unnecessary complexity

Abstractions are introduced only where they reduce meaningful
duplication or improve maintainability.

## Possible Improvements

Given additional production requirements and development time, possible
improvements include:

-   Unit tests
-   Integration tests
-   End-to-end tests
-   Accessibility audit
-   CI pipeline
-   Automated lint/type checks
-   Authentication and authorization
-   More advanced observability and logging
-   Production backend/database integration
-   More granular cache normalization
-   Internationalization
-   Expanded responsive/mobile UX

## Scripts

Install dependencies:

``` bash
pnpm install
```

Run frontend:

``` bash
pnpm dev
```

Run mock API:

``` bash
pnpm mock:server
```

Run lint:

``` bash
pnpm lint
```

Build frontend:

``` bash
pnpm build
```
