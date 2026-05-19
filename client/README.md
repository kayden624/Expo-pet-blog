# Client Project README

## Project Overview

This project is a frontend project based on React and Vite, providing a simple development environment that supports Hot Module Replacement (HMR) and is configured with some ESLint rules to ensure code quality.

## Project Dependencies

### Production Dependencies

*   **Editor-related**:

    *   `@editorjs/checklist`: Version `^1.6.0`, used to create checkbox lists in the editor.
    *   `@editorjs/editorjs`: Version `^2.29.1`, a flexible online rich text editor.
    *   `@editorjs/header`: Version `^2.8.1`, used to add headers in the editor.
    *   `@editorjs/image`: Version `^2.9.0`, supports inserting images in the editor.
    *   `@editorjs/list`: Version `^1.9.0`, used to create lists.
    *   `@editorjs/quote`: Version `^2.6.0`, can insert quotes in the editor.
*   **Icon Library**:

    *   `@flaticon/flaticon-uicons`: Version `^3.3.1`, providing a rich collection of icon resources.
*   **Network Requests**:

    *   `axios`: Version `^1.7.2`, used to send HTTP requests.
*   **React-related**:

    *   `react`: Version `^18.2.0`, used to build user interfaces.
    *   `react-dom`: Version `^18.2.0`, used to render React components in the browser.
    *   `react-hot-toast`: Version `^2.4.1`, used to display concise notification messages.
    *   `react-router-dom`: Version `^6.23.1`, used to implement routing functionality in single-page applications.

### Development Dependencies

*   **Type Definitions**:

    *   `@types/react`: Version `^18.2.66`, provides TypeScript type definitions for React.
    *   `@types/react-dom`: Version `^18.2.22`, provides TypeScript type definitions for React DOM.
*   **Vite Plugins**:

    *   `@vitejs/plugin-react`: Version `^4.2.1`, uses Babel for Fast Refresh.
*   **Style Processing**:

    *   `autoprefixer`: Version `^10.4.19`, automatically adds browser prefixes.
    *   `postcss`: Version `^8.4.38`, used to process CSS.
    *   `tailwindcss`: Version `^3.4.4`, a utility-first CSS framework.
*   **Code Inspection**:

    *   `eslint`: Version `^8.57.0`, used for static code checking.
    *   `eslint-plugin-react`: Version `^7.34.1`, provides additional ESLint rules for React code.
    *   `eslint-plugin-react-hooks`: Version `^4.6.0`, used to check the usage of React Hooks.
    *   `eslint-plugin-react-refresh`: Version `^0.4.6`, supports React Fast Refresh.
*   **Build Tools**:

    *   `vite`: Version `^5.2.0`, a fast build tool.

## Script Commands

*   `npm run dev`: Start the development server with HMR support.
*   `npm run build`: Build the production code.
*   `npm run lint`: Run ESLint to check the code, disallowing unused disable directives and warnings.
*   `npm run preview`: Preview the production build.

## Quick Start

1.  Navigate to the project directory:

\
bash

```bash
cd frontend

```

1.  Install dependencies:

\
bash

```bash
npm install

```

1.  Start the development server:

\
bash

```bash
npm run dev

```

1.  Open `http://localhost:5173` in your browser to view the project.


