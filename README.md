# E-commerce Admin

A React and TypeScript admin dashboard for managing products, product variants, and categories. This is a training project designed to demonstrate a maintainable frontend workflow: typed API boundaries, Redux Toolkit async state, validated forms, reusable UI, route protection, and repeatable quality checks.

## Features

- Admin sign-in and email/OTP password reset
- Product and category listing, search, sorting, and pagination
- Product and variant create, view, edit, and delete workflows
- Product and variant image uploads with previews
- Product listing filters preserved in URL search parameters
- Protected admin routes and centralized API error normalization

## Technology

- React 19, TypeScript, and Vite
- React Router for routing
- Redux Toolkit and React Redux for application state
- Axios for API requests
- Formik and Yup for form state and validation
- Tailwind CSS and Flowbite for styling

## Requirements

- Node.js compatible with the Vite version in `package-lock.json`
- npm
- Access to a compatible backend API

## Getting started

1. Install the locked dependencies:

   ```sh
   npm ci
   ```

2. Create a local environment file from the example:

   ```sh
   cp .env.example .env
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Set the API URLs in `.env`:

   | Variable                   | Purpose                                                                                                     |
   | -------------------------- | ----------------------------------------------------------------------------------------------------------- |
   | `VITE_API_ADMIN_BASE_URL`  | Base URL used by Axios. Use `/api` for the Vite development proxy, or an absolute API URL for a deployment. |
   | `VITE_API_SERVER_BASE_URL` | Backend origin used to display uploaded images.                                                             |
   | `VITE_API_PROXY_TARGET`    | Backend origin targeted by the Vite development proxy when the admin API base is `/api`.                    |

   Keep secrets out of all `VITE_*` variables: Vite embeds these values in client-side output. New local environment files are ignored by Git; commit only `.env.example`. Note: `.env` is already tracked in this repository, so the ignore rule does not untrack it. Do not put credentials in it; remove it from the repository after preserving any needed local settings.

4. Start the development server:

   ```sh
   npm run dev
   ```

The Vite proxy forwards `/api` requests to `VITE_API_PROXY_TARGET` and removes the `/api` prefix before forwarding. Make sure the backend supports the endpoints configured in `src/utils/constants/constants.ts`.

## Available scripts

| Command                | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Start the Vite development server.                   |
| `npm run typecheck`    | Type-check the app and Vite configuration.           |
| `npm run lint`         | Run ESLint across the repository.                    |
| `npm run format:check` | Check formatting with Prettier.                      |
| `npm run build`        | Type-check and create a production build in `dist/`. |
| `npm run preview`      | Serve the production build locally.                  |

Before submitting changes, run:

```sh
npm run lint
npm run typecheck
npm run build
```

There is currently no automated test runner or test script configured. Add targeted tests when introducing test infrastructure or extending behavior that needs regression coverage.

The `.husky/pre-commit` hook lints staged JavaScript/TypeScript files, blocks `console.log`, and runs the production build.

## Project structure

```text
src/
  api/                    Axios client, API functions, and error normalization
  components/             Reusable forms, tables, and shared UI
  layouts/                Authenticated application layout and navigation
  pages/                  Route-level screens
  router/                 Route definitions and access control
  store/                  Redux store, slices, and async thunks
  utils/
    constants/            Shared configuration, API paths, routes, and UI text
    hooks/                Typed Redux hooks and shared React hooks
    validations/          Yup schemas for forms
```

## Request and form conventions

- Keep HTTP request details in `src/api/api.ts`; components should dispatch typed async thunks rather than call Axios directly.
- Async thunks catch `unknown` errors and convert them to the shared `ApiErrorPayload` shape. Reducers own loading and error state; pages show user-facing feedback.
- Define request/response types beside their thunks and keep UI-only properties out of API request bodies.
- Keep reusable form controls in `src/components/` and their Yup schemas in `src/utils/validations/`.
- Put application-wide routes, endpoint paths, repeated configuration values, and shared messages in `src/utils/constants/constants.ts`.
- For product variants, `clientId` is a frontend-only stable row identity. Existing variants derive it from their server ID; new variants receive a client-generated ID. The API payload mapper intentionally excludes that UI-only field.
- Explain non-obvious decisions with a short comment; avoid comments that only restate what the code already says.

## Authentication and deployment notes

- The current client stores the authentication token in `localStorage` and attaches it to API requests. For a security-sensitive production deployment, consider an HttpOnly, Secure, SameSite cookie-based session with backend support.
- Configure the production API and image origins in the deployment environment. `VITE_*` values are public at runtime and must never contain credentials.
- The production build is split by route to avoid loading every screen in the initial JavaScript bundle.
- The backend must be deployed separately; this repository contains only the admin frontend.
