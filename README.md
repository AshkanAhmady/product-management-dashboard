# Product Management Dashboard

A scalable Product Management Dashboard built with React and TypeScript as a technical assessment project.

The application demonstrates server-side pagination, URL-synchronized filtering, form validation, asynchronous SKU validation, optimistic updates with rollback, and efficient server-state management using TanStack Query.

The project includes a mock Express API containing **100,000 products** to simulate working with a large dataset.

---

## Features

### Product Management

- Display products in a paginated table
- Create new products
- Edit existing products
- Delete products
- Responsive product management UI

### Search & Filtering

- Debounced product search
- Filter by product status
- Filter by product category
- Server-side filtering
- Pagination and filters persisted in URL query parameters
- Browser Back/Forward navigation support

Example:

```text
/products?page=2&pageSize=20&search=iphone&status=active&category=Electronics
```

This makes the current product view shareable and restorable after a page refresh.

### Form Validation

Product forms are implemented using **React Hook Form** and **Zod**.

Validation includes:

- Required fields
- Name and SKU length constraints
- Non-negative price
- Non-negative weight
- Integer and non-negative stock
- Category and status validation
- Cross-field validation

For example, Electronics products must have a weight greater than zero:

```text
category = Electronics
→ weight > 0
```

### Asynchronous SKU Validation

SKU availability is validated asynchronously against the mock API.

The validation is debounced to avoid unnecessary API requests while the user is typing.

The backend also validates SKU uniqueness during create/update operations to ensure data integrity.

### Optimistic Updates

Edit and Delete operations use optimistic cache updates.

The UI updates immediately before the API request finishes.

If the request fails:

```text
Optimistic update
       ↓
API request fails
       ↓
Previous cache restored
       ↓
Error feedback displayed
```

This provides a responsive user experience while maintaining consistency on failed mutations.

### Loading & Error States

The application includes:

- Initial loading state
- Background fetching indicator
- Mutation loading states
- API error states
- Empty product states
- Form submission feedback
- Success and error notifications

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- Axios
- Tailwind CSS
- shadcn/ui

### Mock Backend

- Express
- Faker
- Zod
- TypeScript
- tsx

### Testing

- Vitest

### Package Manager

- pnpm

---

## Getting Started

### Prerequisites

Make sure the following tools are installed:

```text
Node.js
pnpm
```

Install pnpm if necessary:

```bash
npm install -g pnpm
```

### Installation

Clone the repository:

```bash
git clone https://github.com/AshkanAhmady/product-management-dashboard.git
cd product-management-dashboard
```

Install dependencies:

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### Run the Mock API

Start the mock backend:

```bash
pnpm mock:server
```

The API runs on:

```text
http://localhost:3001
```

### Run the Frontend

In another terminal:

```bash
pnpm dev
```

Open the URL displayed by Vite in your browser.

---

## Available Scripts

Start the frontend development server:

```bash
pnpm dev
```

Start the mock API:

```bash
pnpm mock:server
```

Run tests in watch mode:

```bash
pnpm test
```

Run all tests once:

```bash
pnpm test:run
```

Run ESLint:

```bash
pnpm lint
```

Create a production build:

```bash
pnpm build
```

Run TypeScript validation:

```bash
pnpm exec tsc --noEmit
```

---

## Project Structure

The application follows a layer-based architecture.

```text
product-management-dashboard/
│
├── mock-server/
│   ├── controllers/
│   │   └── products/
│   ├── data/
│   ├── middlewares/
│   ├── routes/
│   ├── schemas/
│   ├── utils/
│   └── server.ts
│
├── shared/
│   └── contracts/
│       ├── api.contract.ts
│       └── product.contract.ts
│
├── src/
│   ├── api/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── pages/
│   ├── schemas/
│   ├── services/
│   └── utils/
│
├── .env
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Architecture Rationale

A layer-based structure was chosen because the application currently focuses on a single primary domain: products.

Introducing a more complex feature-based architecture at this size would add unnecessary abstraction.

As the application grows and additional business domains are introduced, the project could be migrated toward a feature-oriented structure.

---

# Technical Decisions

## Server-Side Pagination

The mock backend generates **100,000 products**.

The complete dataset is never transferred to the browser.

Instead, the frontend requests only the required page:

```text
GET /api/products?page=1&pageSize=20
```

Search and filtering are also performed by the server before pagination.

This keeps:

- Network payloads small
- Browser memory usage low
- Table rendering efficient
- UI performance predictable

### Why Table Virtualization Was Not Used

Virtualization is primarily useful when a large number of DOM rows must exist on the client.

In this application, server-side pagination means the browser only receives and renders a small number of products at a time.

For example:

```text
100,000 products on server
          ↓
Server-side pagination
          ↓
20 products transferred
          ↓
~20 table rows rendered
```

Therefore, virtualization would introduce additional complexity without solving a meaningful bottleneck in the current architecture.

---

## URL as the Source of Truth

Product list state is persisted in URL query parameters.

This includes:

- Page
- Page size
- Search
- Status
- Category

For example:

```text
/products?page=3&pageSize=50&status=active&category=Electronics&search=phone
```

This provides several advantages:

- State survives browser refresh
- Views can be bookmarked
- Views can be shared
- Browser Back/Forward navigation works correctly
- Product queries can be derived directly from URL state

Invalid pagination values are normalized before being used by the application.

---

## Data Fetching & Cache Strategy

TanStack Query is responsible for server-state management.

Product queries use their request parameters as part of the query key:

```ts
["products", params];
```

As a result, different combinations of:

```text
page
pageSize
search
status
category
```

receive independent cache entries.

This allows previously visited product views to be reused efficiently.

---

## Create Cache Strategy

Creating a product can affect:

- Total product count
- Page count
- Product ordering
- Search results
- Filter results

Because the correct position of a newly created product is determined by the server-side dataset, the product list is invalidated after a successful creation.

This prioritizes correctness over manually inserting a product into potentially many paginated cache entries.

---

## Edit Cache Strategy

Product editing uses an optimistic update.

Before sending the request:

1. Active product queries are cancelled.
2. Existing product query caches are snapshotted.
3. The edited product is updated immediately in relevant caches.
4. The API request is sent.

The optimistic update is filter-aware.

For example, when viewing:

```text
status=active
```

and a product changes:

```text
active → inactive
```

the product is immediately removed from the Active result set.

The same behavior applies to category and search filters.

If the request fails, all modified caches are restored from the snapshot.

When the request succeeds, the optimistic value is reconciled with the authoritative product returned by the API.

---

## Delete Cache Strategy

Deletion is also optimistic.

The product is immediately removed from relevant cached data and pagination metadata is adjusted.

If the API request fails, previous query data is restored.

This avoids waiting for a complete list refetch before updating the UI.

---

## Paginated Cache Considerations

The application intentionally does not insert an edited product into cached pages where that product did not previously exist.

With server-side pagination, the frontend cannot reliably determine the correct page and position for that product without reproducing server-side ordering and pagination logic.

For example:

```text
Active → Inactive
```

The product can safely be removed from the cached Active page.

However, automatically inserting it into an already cached Inactive page could place it in an incorrect position.

The server remains the authority for page membership and ordering.

---

## API Layer

HTTP infrastructure is separated from domain-specific services.

The request flow is:

```text
Component
   ↓
TanStack Query Hook
   ↓
Product Service
   ↓
API Caller
   ↓
Axios
   ↓
Mock API
```

This keeps components independent from low-level HTTP configuration and allows API behavior to be maintained centrally.

API errors are normalized before reaching UI components.

---

## Shared Contracts

Frontend and mock backend share TypeScript contracts through:

```text
shared/contracts
```

These contracts define:

- Product models
- API responses
- Pagination metadata
- Request payloads
- Response payloads

This reduces accidental type inconsistencies between the frontend and mock API.

---

## Form Architecture

Forms use:

```text
React Hook Form
        +
       Zod
```

React Hook Form manages form state efficiently while Zod provides declarative schema validation.

Business validation rules remain outside UI components, making them easier to understand and test.

---

## SKU Uniqueness

SKU validation happens at two levels.

### Client-Side

The frontend performs a debounced asynchronous availability check:

```text
User enters SKU
      ↓
Debounce
      ↓
GET /api/products/check-sku
      ↓
Availability feedback
```

For Edit operations, the availability request is skipped when the SKU has not changed.

### Server-Side

The backend validates SKU uniqueness again during mutations.

This is required because client-side validation alone cannot guarantee uniqueness between the availability check and the final mutation.

The backend therefore remains the final authority for data integrity.

---

# Mock API

The Express mock API simulates a more realistic backend environment.

It includes:

- 100,000 generated products
- Server-side pagination
- Search
- Category filtering
- Status filtering
- Product creation
- Product editing
- Product deletion
- SKU uniqueness validation
- Request latency simulation
- Failure simulation support
- Unified API error responses

---

## API Endpoints

### Get Products

```http
GET /api/products
```

Supported query parameters:

```text
page
pageSize
search
status
category
```

Example:

```http
GET /api/products?page=1&pageSize=20&search=iphone&status=active
```

### Check SKU Availability

```http
GET /api/products/check-sku
```

Example:

```text
/api/products/check-sku?sku=SKU-123
```

### Create Product

```http
POST /api/products
```

### Update Product

```http
PATCH /api/products/:id
```

### Delete Product

```http
DELETE /api/products/:id
```

---

# Error Handling

API errors follow a consistent response structure.

Expected failures such as:

- Invalid query parameters
- Invalid product data
- Duplicate SKU
- Product not found
- Invalid JSON

are handled by the mock backend and returned using appropriate HTTP status codes.

Unexpected server errors are handled by a global Express error handler.

The frontend converts API failures into normalized errors before displaying feedback to the user.

---

# Testing

Unit tests are implemented with Vitest.

The tests focus on business rules and deterministic logic rather than implementation details.

Current test coverage includes product validation rules such as:

- Valid product input
- Electronics weight requirement
- Non-Electronics zero weight
- Negative price rejection
- Invalid stock values
- SKU length validation

Filter matching logic is also tested, including:

- Status matching
- Category matching
- Case-insensitive name search
- Case-insensitive SKU search
- Multiple filter conditions

Run the tests with:

```bash
pnpm test:run
```

---

# Performance Considerations

Several decisions were made specifically with scalability in mind.

### Large Dataset

The backend contains 100,000 products, but only one page is sent to the frontend at a time.

### Search

Search input is debounced to reduce unnecessary requests.

### Query Caching

Product requests are cached by their query parameters.

### Background Fetching

Previously available data can remain visible while a new page is being fetched, reducing UI flicker.

### Rendering

Because pagination limits the number of rows rendered simultaneously, the browser does not need to create thousands of table elements.

---

# Trade-offs & Known Limitations

This project was implemented as a focused technical assessment, so several decisions intentionally favor clarity and correctness over additional infrastructure.

### Mock Persistence

Products are stored in memory by the mock server.

Restarting the server regenerates the dataset.

A production implementation would use persistent storage such as a database.

### Optimistic Pagination

Optimistic updates modify products already present in cached pages but intentionally avoid guessing the correct insertion position in other server-paginated caches.

### Testing Scope

The current automated tests focus on unit-level business logic.

A production application would additionally benefit from integration and end-to-end tests covering complete user flows.

### Mock API

The Express server exists to simulate realistic API behavior for the assessment and is not intended to represent a production backend architecture.

---

# Future Improvements

Given additional development time, the following improvements would be considered:

- Integration tests for API and React Query interactions
- End-to-end tests for product CRUD flows
- Expanded accessibility testing
- Persistent database storage
- More advanced table sorting
- Server-driven sorting
- More comprehensive error recovery
- Cache mutation logic extracted into dedicated reusable hooks/utilities
- Improved observability and logging
- Additional responsive UI refinements

---

# Production Verification

Before delivery, the project can be verified with:

```bash
pnpm test:run
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

All checks should complete successfully before submission.
