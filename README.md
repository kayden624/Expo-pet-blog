# Server Project README

## Project Documentation

### Project Overview

This project is a comprehensive application stack consisting of a backend service, a frontend project, and an `ashui-blog` application. The backend is built on Node.js and the Express framework, integrated with a MongoDB database to manage user, blog, and other data. It utilizes several middleware, such as `multer` for file uploads and `jsonwebtoken` for authentication. The frontend is based on React and Vite, providing a simple development environment that supports Hot Module Replacement (HMR) and is configured with some ESLint rules to ensure code quality. The `ashui-blog` application is a React Native-based mobile application that serves as the mobile client for the blog system, offering users a convenient way to access and interact with the blog content on mobile devices.

### Environment Variables

The following environment variables are defined in the server/.env file:



```
DATABASE_REMOTE=mongodb://localhost:27017
SECRET_ACCESS_KEY = 67ij4o6jo4i5j6io45j6i4j74p5k6i54ojoi5t9g8ergoj34ofgkrtbmreog894jbioemgropihj48rj4io5juopjgior
BASE_URL=http://127.0.0.1:3001

```

*   `DATABASE_REMOTE`: The connection address for the MongoDB database, defaulting to the local database.
*   `SECRET_ACCESS_KEY`: The key used to generate JWT tokens. Keep it secure.
*   `BASE_URL`: The base URL of the project, used for file access, etc.

#### Dependency Installation

The project uses `pnpm` as the package manager. Install the dependencies using the following command:



```bash
pnpm install

```

### Main Dependencies

#### Core Frameworks

*   **Express**: Version 4.19.2, a lightweight Node.js web application framework for building servers and handling routes.
*   **Mongoose**: An Object Data Modeling (ODM) library for interacting with the MongoDB database, simplifying database operations.

#### Middleware and Tools

*   **Multer**: Version 1.4.5 - lts.1, used to handle `multipart/form-data` type form data, mainly for file uploads.
*   **JSON Web Token**: Version 9.0.2, used to generate and verify JWT tokens for user authentication.
*   **Nodemon**: A development tool that automatically restarts the server when files change in the development environment.

#### Other Dependencies

*   **bcryptjs**: Used for password hashing.
*   **nanoid**: Used to generate unique IDs.

### Code Structure

#### Controllers (`server/controllers`)

*   **fileCon.js**: Handles file uploads and downloads.
*   **userCon.js**: Handles user registration, login, information updates, etc.
*   **searchCon.js**: Handles blog and user search functionality.
*   **blogCon.js**: Handles blog creation, retrieval, likes, favorites, etc.

#### Models (`server/schemas`)

*   **User.js**: The user model, defining the user data structure.
*   **Blog.js**: The blog model, defining the blog data structure.
*   **Comment.js**: The comment model, defining the comment data structure.
*   **Notification.js**: The notification model, defining the notification data structure.

### Running Commands

#### Development Environmen

```bash
pnpm run dev

```

#### Production Environment

```bash
pnpm start

```

### API Endpoints

#### User Endpoints

*   **Sign Up**: `POST /signup`
*   **Log In**: `POST /login`
*   **Update User Information**: `PUT /updateProfile`
*   **Get User Information**: `GET /getProfile/:userId`

#### Blog Endpoints

*   **Create Blog**: `POST /createBlog`
*   **Get Blog List**: `GET /getBlogList`
*   **Get Single Blog**: `GET /getBlog/:blog_id/:mode`
*   **Like Blog**: `POST /handleBlogLikes/:blog_id`
*   **Favorite Blog**: `POST /handleBlogFollow/:blog_id`

#### File Endpoints

*   **Upload File**: `POST /uploadFile`
*   **Download File**: `GET /downloadFile/:filename`

#### Search Endpoints

*   **Search Blogs**: `GET /searchBlog`
*   **Search Users**: `GET /searchUser`

### Notes

*   Ensure that Node.js and the MongoDB database are installed.
*   In a production environment, keep the `SECRET_ACCESS_KEY` environment variable secure to prevent leakage.

# Client Project README

## Project Overview

This project is a frontend project based on React and Vite, providing a simple development environment that supports Hot Module Replacement (HMR) and is configured with some ESLint rules to ensure code quality. It serves as the web client for the blog system, offering users a convenient way to access and interact with the blog content on web browsers.

## Project Dependencies

### Production Dependencies

#### Editor-related

*   `@editorjs/checklist`: Version `^1.6.0`, used to create checkbox lists in the editor.
*   `@editorjs/editorjs`: Version `^2.29.1`, a flexible online rich text editor.
*   `@editorjs/header`: Version `^2.8.1`, used to add headers in the editor.
*   `@editorjs/image`: Version `^2.9.0`, supports inserting images in the editor.
*   `@editorjs/list`: Version `^1.9.0`, used to create lists.
*   `@editorjs/quote`: Version `^2.6.0`, can insert quotes in the editor.

#### Icon Library

*   `@flaticon/flaticon-uicons`: Version `^3.3.1`, providing a rich collection of icon resources.

#### Network Requests

*   `axios`: Version `^1.7.2`, used to send HTTP requests.

#### React-related

*   `react`: Version `^18.2.0`, used to build user interfaces.
*   `react-dom`: Version `^18.2.0`, used to render React components in the browser.
*   `react-hot-toast`: Version `^2.4.1`, used to display concise notification messages.
*   `react-router-dom`: Version `^6.23.1`, used to implement routing functionality in single - page applications.

### Development Dependencies

#### Type Definitions

*   `@types/react`: Version `^18.2.66`, provides TypeScript type definitions for React.
*   `@types/react-dom`: Version `^18.2.22`, provides TypeScript type definitions for React DOM.

#### Vite Plugins

*   `@vitejs/plugin-react`: Version `^4.2.1`, uses Babel for Fast Refresh.

#### Style Processing

*   `autoprefixer`: Version `^10.4.19`, automatically adds browser prefixes.
*   `postcss`: Version `^8.4.38`, used to process CSS.
*   `tailwindcss`: Version `^3.4.4`, a utility - first CSS framework.

#### Code Inspection

*   `eslint`: Version `^8.57.0`, used for static code checking.
*   `eslint-plugin-react`: Version `^7.34.1`, provides additional ESLint rules for React code.
*   `eslint-plugin-react-hooks`: Version `^4.6.0`, used to check the usage of React Hooks.
*   `eslint-plugin-react-refresh`: Version `^0.4.6`, supports React Fast Refresh.

#### Build Tools

*   `vite`: Version `^5.2.0`, a fast build tool.

## Script Commands

*   `npm run dev`: Start the development server with HMR support.
*   `npm run build`: Build the production code.
*   `npm run lint`: Run ESLint to check the code, disallowing unused disable directives and warnings.
*   `npm run preview`: Preview the production build.

## Quick Start

1.  Navigate to the project directory:



```bash
cd frontend

```

1.  Install dependencies:



```bash
npm install

```

1.  Start the development server:



```bash
npm run dev

```

1.  Open `http://localhost:5173` in your browser to view the project.

# ashui-blog Project README

## Project Overview

The `ashui-blog` project is a React Native-based mobile application that serves as the mobile client for the blog system. It provides users with a seamless experience to browse, create, and interact with blog content on mobile devices. The application is designed to be user-friendly and intuitive, allowing users to easily access their favorite blogs, leave comments, and manage their personal profiles.

## Environment Variables

In the ashui-blog/constants/index.ts file, the following constants are defined:



```typescript
export const ServerUrl = "http://192.168.0.120:3001";
//export const ServerUrl = "http://q9e53o5o.dongtaiyuming.net";

export const USER_KEY = "user";

export const TEMP_FILE_KEY = "temp_file";
export const NEED_REFRESH = "NEED_REFRESH";

```

*   `ServerUrl`: The URL of the backend server, used to communicate with the server for data retrieval and submission.
*   `USER_KEY`: The key used to store user information in local storage.
*   `TEMP_FILE_KEY`: The key used to store temporary file information.
*   `NEED_REFRESH`: A flag used to indicate whether data needs to be refreshed.

## Dependency Installation

Navigate to the `ashui-blog` directory and use `npm` to install the dependencies:



```bash
cd ashui-blog
npm install

```

## Main Dependencies

The project uses a variety of libraries and frameworks to build the application, including but not limited to:

*   **React Native**: A framework for building native mobile applications using React.
*   **Expo**: A set of tools and services for React Native development, providing a fast and easy way to build and deploy mobile applications.
*   **Axios**: A promise-based HTTP client for the browser and Node.js, used to send network requests to the backend server.

## Code Structure

### Components (`ashui-blog/components`)

This directory contains reusable components used throughout the application, such as blog cards, search bars, and user avatars.

### Screens (`ashui-blog/app`)

This directory contains the screens of the application, such as the blog list screen, blog detail screen, and user profile screen.

### API (`ashui-blog/api`)

This directory contains the API service files, which are responsible for communicating with the backend server to retrieve and submit data.

### Types (`ashui-blog/types`)

This directory contains the type definition files, which define the data types used in the application, such as blog types, user types, and comment types.

## Running Commands

### Development Environment

To start the development server and run the application on a simulator or a physical device, use the following command:



```bash
npx expo start

```

\
This will open the Expo DevTools in your browser. You can then choose to run the application on an iOS simulator, an Android emulator, or a physical device by scanning the QR code with the Expo Go app.

### Production Environment

To build the application for production, use the following commands:

#### iOS

```bash
npx expo build:ios

```

#### Android

```bash
npx expo build:android

```

\
These commands will generate the APK or IPA file, which can be uploaded to the app store for distribution.

## Notes

*   Make sure you have the Expo CLI installed globally on your machine. If not, you can install it using the following command:



```bash
npm install -g expo-cli

```

*   Ensure that the backend server is running and accessible before starting the application. You may need to update the `ServerUrl` constant in the ashui-blog/constants/index.ts file to match the actual server URL.

