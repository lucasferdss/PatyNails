# AI Rules for PatyNails Application

This document outlines the core technologies and libraries used in the PatyNails application, along with guidelines for their usage.

## Tech Stack Overview

*   **Frontend Framework:** React (with TypeScript) for building interactive user interfaces.
*   **Styling:** Tailwind CSS for utility-first styling, ensuring a consistent and responsive design.
*   **UI Components:** Shadcn/ui, a collection of re-usable components built on Radix UI and styled with Tailwind CSS.
*   **Routing:** React Router DOM for declarative client-side routing.
*   **Backend & Database:** Supabase for authentication, real-time database, and storage.
*   **State Management & Data Fetching:** A custom `AppContext` and `AuthContext` for global state, complemented by `@tanstack/react-query` for server state management.
*   **Form Handling:** React Hook Form for managing form state and validation, paired with Zod for schema definition.
*   **Date Management:** `date-fns` for efficient date parsing, formatting, and manipulation.
*   **Notifications:** Shadcn/ui's `toast` (via `useToast` hook) and `sonner` for user feedback and notifications.
*   **Icons:** Lucide React for a comprehensive set of customizable SVG icons.
*   **Progressive Web App (PWA):** Configured using `vite-plugin-pwa` to enable installability and offline capabilities.

## Library Usage Guidelines

*   **UI Components:**
    *   **Always** prioritize using existing Shadcn/ui components (`src/components/ui/`).
    *   If a required component is not available in Shadcn/ui or needs significant custom logic, create a **new component file** in `src/components/`. **Never** modify the original Shadcn/ui component files.
*   **Styling:**
    *   **Exclusively** use Tailwind CSS classes for all styling. Avoid inline styles or separate CSS modules for components.
    *   Ensure designs are responsive by utilizing Tailwind's responsive utility classes.
*   **Routing:**
    *   Use `react-router-dom` for all client-side navigation. Keep main routes defined in `src/App.tsx`.
*   **Backend Interaction:**
    *   All interactions with the backend (database, authentication) must be done through the `supabase` client instance provided by `src/integrations/supabase/client.ts`.
*   **State Management:**
    *   For application-wide data (services, appointments) and authentication status, use the `AppContext` and `AuthContext` respectively.
    *   `@tanstack/react-query` is available for advanced server state management if needed, but keep it simple for basic CRUD operations handled by `AppContext`.
*   **Form Validation:**
    *   Define form schemas using `zod`.
    *   Implement forms using `react-hook-form` with `@hookform/resolvers/zod` for validation.
*   **Date Handling:**
    *   Use `date-fns` for all date-related operations (formatting, parsing, comparisons).
*   **Notifications:**
    *   For transient, non-blocking messages, use the `useToast` hook (Shadcn/ui toast).
    *   For more persistent or interactive notifications, use `sonner`.
*   **Icons:**
    *   Use icons from the `lucide-react` library.
*   **PWA:**
    *   Leverage the existing PWA setup and the `InstallPWA` component for prompting users to install the application.