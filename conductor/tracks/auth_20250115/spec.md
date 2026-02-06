# Track Specification: User Authentication

## Goal
Implement a simulated authentication system to secure the application and provide user context.

## Requirements
1.  **Auth Service**:
    -   Simulate login with mocked credentials.
    -   Support "Logout".
2.  **User Context**:
    -   Provide `user` object to the app via React Context.
    -   User object should contain: `name`, `role`, `initials`.
3.  **UI Components**:
    -   Login Page: Simple form with Username/Password.
    -   Layout Update: Show logged-in user's name and a Logout button in the sidebar.
4.  **Route Protection**:
    -   Redirect unauthenticated users to `/login`.
    -   Redirect authenticated users away from `/login`.

## Technical Approach
-   Use `React.createContext` for state management.
-   Store auth session in `localStorage`.
-   Use `react-router-dom` `Navigate` for redirects.
