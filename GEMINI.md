# My-Link Project Context

This workspace contains the **My-Link** project, which currently consists of a Next.js application located in the `my-profile/` directory.

## Project Overview

*   **Project Name:** my-profile
*   **Main Technology Stack:**
    *   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
    *   **Library:** [React 19](https://react.dev/)
    *   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
    *   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Purpose:** A modern web application, likely intended for a personal profile or portfolio, bootstrapped with `create-next-app`.

## Directory Structure (Key Areas)

*   `my-profile/`: The main Next.js application directory.
    *   `app/`: Contains the App Router pages, layouts, and global styles.
        *   `page.tsx`: The main landing page.
        *   `layout.tsx`: The root layout for the application.
        *   `globals.css`: Global Tailwind CSS styles.
    *   `public/`: Static assets like images and SVGs.
    *   `package.json`: Project dependencies and scripts.
    *   `next.config.ts`: Next.js configuration.
    *   `tsconfig.json`: TypeScript configuration.

## Building and Running

All commands should be executed from within the `my-profile/` directory.

### Prerequisites

Ensure you have Node.js installed. Then, install dependencies:

```bash
cd my-profile
npm install
```

### Development

Start the development server with hot-reloading:

```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Production Build

Create an optimized production build:

```bash
npm run build
```

To start the production server after building:

```bash
npm run start
```

### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

## Development Conventions

*   **App Router:** Adhere to Next.js App Router conventions (e.g., using `page.tsx` for routes, `layout.tsx` for shared UI).
*   **Styling:** Use Tailwind CSS utility classes for styling. Tailwind CSS 4 is configured via `@tailwindcss/postcss`.
*   **TypeScript:** Maintain strict type safety throughout the project.
*   **Components:** Prefer functional components with React Hooks. Use Server Components by default unless client-side interactivity is required (`'use client'`).
*   **Fonts:** The project uses `next/font` with Geist and Geist Mono.
