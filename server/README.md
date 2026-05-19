# Server Project README
# Project Documentation

## Project Overview

This project is a backend service built on Node.js and the Express framework, integrated with a MongoDB database to manage user, blog, and other data. It uses several middleware, such as `multer` for file uploads and `jsonwebtoken` for authentication.

## Environment Variables

The following environment variables are defined in the `server/.env` file:

    DATABASE_REMOTE=mongodb://localhost:27017
    SECRET_ACCESS_KEY = 67ij4o6jo4i5j6io45j6i4j74p5k6i54ojoi5t9g8ergoj34ofgkrtbmreog894jbioemgropihj48rj4io5juopjgior
    BASE_URL=http://127.0.0.1:3001

*   `DATABASE_REMOTE`: The connection address for the MongoDB database, which defaults to the local database.
*   `SECRET_ACCESS_KEY`: The key used to generate JWT tokens. Keep it secure.
*   `BASE_URL`: The base URL of the project, used for file access, etc.
*   Dependency Installation

    The project uses `pnpm` as the package manager. Install the dependencies with the following command:

    \
    bash
    ```shell
    pnpm install

    ```
    ## Main Dependencies
    ### Core Frameworks
    *   **Express**: Version 4.19.2, a lightweight Node.js web application framework for building servers and handling routes.
    *   **Mongoose**: An Object Data Modeling (ODM) library for interacting with the MongoDB database, simplifying database operations.
    ### Middleware and Tools
    *   **Multer**: Version 1.4.5 - lts.1, used to handle `multipart/form-data` type form data, mainly for file uploads.
    *   **JSON Web Token**: Version 9.0.2, used to generate and verify JWT tokens for user authentication.
    *   **Nodemon**: A development tool that automatically restarts the server when files change in the development environment.
    ### Other Dependencies
    *   **bcryptjs**: Used for password hashing.
    *   **nanoid**: Used to generate unique IDs.
    ## Code Structure
    ### Controllers (`server/controllers`)
    *   **fileCon.js**: Handles file uploads and downloads.
    *   **userCon.js**: Handles user registration, login, information updates, etc.
    *   **searchCon.js**: Handles blog and user search functionality.
    *   **blogCon.js**: Handles blog creation, retrieval, likes, favorites, etc.
    ### Models (`server/schemas`)
    *   **User.js**: The user model, defining the user data structure.
    *   **Blog.js**: The blog model, defining the blog data structure.
    *   **Comment.js**: The comment model, defining the comment data structure.
    *   **Notification.js**: The notification model, defining the notification data structure.
    ## Running Commands
    ### Development Environment
    bash
    ```shell
    pnpm run dev

    ```
    ### Production Environment
    bash
    ```shell
    pnpm start

    ```
    ## API Endpoints
    ### User Endpoints
    *   **Sign Up**: `POST /signup`
    *   **Log In**: `POST /login`
    *   **Update User Information**: `PUT /updateProfile`
    *   **Get User Information**: `GET /getProfile/:userId`
    ### Blog Endpoints
    *   **Create Blog**: `POST /createBlog`
    *   **Get Blog List**: `GET /getBlogList`
    *   **Get Single Blog**: `GET /getBlog/:blog_id/:mode`
    *   **Like Blog**: `POST /handleBlogLikes/:blog_id`
    *   **Favorite Blog**: `POST /handleBlogFollow/:blog_id`
    ### File Endpoints
    *   **Upload File**: `POST /uploadFile`
    *   **Download File**: `GET /downloadFile/:filename`
    ### Search Endpoints
    *   **Search Blogs**: `GET /searchBlog`
    *   **Search Users**: `GET /searchUser`
    ## Notes
    *   Ensure that Node.js and the MongoDB database are installed.
    *   In a production environment, keep the `SECRET_ACCESS_KEY` environment variable secure to prevent leakage.