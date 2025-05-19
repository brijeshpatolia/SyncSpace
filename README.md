# SyncSpace: Real-Time Collaboration Platform

## Project Explanation

SyncSpace is a full-stack web application designed to provide a real-time collaborative environment, similar in concept to platforms like Slack or Microsoft Teams. It allows users to create and join **workspaces**, communicate within **channels** inside these workspaces, and exchange **messages** instantaneously.

**Core Functionality:**

* **User Management & Authentication:**
    * Users can sign up with a unique username, email, and password. Passwords are securely hashed using bcrypt.
    * Upon successful registration, a default avatar (using `robohash.org`) is generated for the user.
    * Registered users can sign in to access the platform.
    * Authentication is handled using JSON Web Tokens (JWT), which are generated upon sign-in and used to protect various API routes.

* **Workspace Organization:**
    * Users can create new workspaces, providing a name and an optional description. Each created workspace automatically generates a unique `joinCode`.
    * The creator of a workspace is automatically assigned as an 'Admin'.
    * Users can join existing workspaces using the unique `joinCode`.
    * Workspaces serve as containers for channels and members. Users can be partof multiple workspaces.

* **Channel-Based Communication:**
    * Within each workspace, communication is organized into channels.
    * A default "general" channel is automatically created when a new workspace is set up.
    * Admins of a workspace can create new channels.
    * Users who are members of a workspace can access its channels to send and receive messages.

* **Real-Time Messaging:**
    * Messages are sent and received in real-time within channels using Socket.IO.
    * When a user sends a message, it is broadcasted to all other users currently active in that specific channel.
    * Messages can contain text content and potentially image attachments (though image upload handling might be a future enhancement based on the current schema).

* **Membership and Roles:**
    * Users become members of a workspace either by creating it or by joining it.
    * Currently, two roles are defined for workspace members: 'Admin' and 'Member'. Admins have more privileges, such as deleting workspaces and adding channels.

* **Notifications:**
    * The system includes an email notification feature. For instance, when a user is added to a workspace, an email is sent to them. This is handled asynchronously using a Bull message queue backed by Redis, and Nodemailer for sending the actual emails.

**Technical Architecture:**

* **Monorepo-like Structure:** The project is divided into a `frontend` and a `backend` directory.
* **Backend (Node.js & Express.js):**
    * Follows a modular structure with controllers, services, repositories, and schemas.
    * Uses Mongoose as an ODM for interacting with a MongoDB database.
    * Implements a RESTful API for client-server communication.
    * Employs Socket.IO for establishing persistent, bidirectional communication for real-time features.
    * Uses Zod for input validation to ensure data integrity.
    * Manages configuration through environment variables (`.env` file).
    * Integrates Bull and Redis for background task processing (e.g., sending emails via Nodemailer).
    * Provides a Bull Board interface for monitoring message queues.
* **Frontend (React & Vite):**
    * Built as a single-page application (SPA) using React and Vite.
    * Utilizes React Router for client-side navigation.
    * Manages server state and API interactions with TanStack Query (React Query) and Axios.
    * Features a modern UI built with Tailwind CSS and reusable components from Shadcn UI.
    * Uses React Context API for global state management (e.g., authentication state, modal visibility).
    * Includes custom hooks for encapsulating API logic and context consumption.

The overall goal of SyncSpace is to offer a streamlined and efficient platform for team communication and collaboration, focusing on real-time interactions within organized workspaces and channels.

## Features

* **User Authentication:** Secure user sign-up and sign-in with JWT.
* **Workspace Management:**
    * Create new workspaces with a unique join code.
    * Join existing workspaces using the join code.
    * View a list of workspaces the user is a member of.
    * Fetch details of a specific workspace.
    * Update workspace details (restricted to Admins).
    * Delete workspaces (restricted to Admins), including associated channels.
    * Add members to a workspace (with email notification).
* **Channel Management:**
    * Automatically creates a "general" channel upon workspace creation.
    * Admins can add new channels to a workspace.
    * Fetch details of a specific channel (if the user is a member of the parent workspace).
* **Real-Time Messaging:**
    * Send and receive messages within channels.
    * Paginated fetching of messages for a channel.
    * Socket.IO integration for instant message delivery and channel join updates.
* **User Profiles:** Automatic avatar generation on sign-up.
* **Role-Based Access Control:** Basic Admin/Member roles within workspaces.
* **Background Job Processing:** Email notifications sent via a Bull queue and Redis.
* **API & UI:**
    * RESTful API for all backend operations.
    * Reactive frontend built with React, Vite, and Tailwind CSS.
    * User-friendly interface using Shadcn UI components.

## Tech Stack

**Frontend:**

* React (v19)
* Vite
* React Router (v7)
* Axios (for HTTP requests)
* Tailwind CSS (for styling)
* Shadcn UI (for pre-built UI components)
* Lucide React & React Icons (for icons)
* TanStack Query (React Query v5, for server state management)
* ESLint & Prettier (for code linting and formatting)

**Backend:**

* Node.js
* Express.js (v4)
* MongoDB (with Mongoose ODM v8)
* Socket.IO (v4, for real-time communication)
* JSON Web Tokens (JWT, for authentication)
* Bcrypt.js (for password hashing)
* Zod (for data validation)
* Dotenv (for environment variables)
* Nodemailer (for sending emails)
* Bull (v4, for message queues) with Redis
* Bull Board (for queue monitoring UI)
* ESLint & Prettier (for code linting and formatting)

## File Structure

The project is organized into two main directories: `frontend/` and `backend/`.

## Getting Started

### Prerequisites

* Node.js (v18.x or higher recommended for backend, v18.x or v20.x for frontend based on `package.json` engines)
* npm (Node Package Manager) or yarn
* MongoDB instance (local or cloud-hosted like MongoDB Atlas)
* Redis instance (local or cloud-hosted)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory by copying `.env.example` (if provided, otherwise create it manually) and populate it with your actual configuration:
    ```env
    PORT=3000
    NODE_ENV=development
    DEV_DB_URL=mongodb://localhost:27017/syncspace_dev  # Your development MongoDB URI
    PROD_DB_URL=your_production_mongodb_uri             # Your production MongoDB URI
    JWT_SECRET=your_very_strong_jwt_secret_key
    JWT_EXPIRATION_TIME=1d
    MAIL_ID=your_gmail_email_address@gmail.com
    MAIL_PASSWORD=your_gmail_app_password_for_nodemailer
    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379
    ```
    * **`MAIL_PASSWORD`**: This is an "App Password" for Gmail, not your regular Gmail password. You need to generate it from your Google Account settings if using Gmail for Nodemailer.

4.  **Start the backend server:**
    ```bash
    npm start
    ```
    The server will start, typically on `http://localhost:3000`.
    The Bull Board UI for monitoring queues will be available at `http://localhost:3000/admin/queues`. Ensure Redis is running.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `frontend` directory by copying `.env.example` (if provided, otherwise create it manually) and set the backend API URL:
    ```env
    VITE_BACKEND_API_URL=http://localhost:3000/api/v1
    ```
    * Adjust the port if your backend is running on a different one.

4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The React application will start, typically on `http://localhost:5173` (Vite's default).

## API Endpoints

The backend exposes a RESTful API under the `/api/v1/` prefix. Key resources and their common operations include:

* **Users (`/users`):**
    * `POST /signup`: Register a new user.
    * `POST /signin`: Log in an existing user and receive a JWT.
* **Workspaces (`/workspaces`):**
    * `POST /create`: Create a new workspace (requires authentication).
    * `GET /list`: Get all workspaces the authenticated user is a member of.
    * `GET /:workspaceId`: Get details of a specific workspace (requires membership).
    * `PUT /:workspaceId/update`: Update workspace details (Admin only).
    * `DELETE /:workspaceId`: Delete a workspace (Admin only).
    * `POST /joincode`: Find a workspace using its join code.
    * `POST /:workspaceId/add-member`: Add the authenticated user to a workspace (typically after finding it by join code or via an invite link not yet implemented).
    * `POST /:workspaceId/add-channel`: Add a new channel to a workspace (Admin only).
* **Channels (`/channels`):**
    * `GET /:channelId`: Get details of a specific channel (requires workspace membership).
* **Members (`/members`):**
    * `GET /:workspaceId/ismember`: Check if the authenticated user is a member of the specified workspace.
* **Messages (`/messages`):**
    * `GET /:channelId`: Get paginated messages for a specific channel (requires workspace membership).
    * `POST /:channelId`: Create a new message in a specific channel (requires workspace membership).

All routes requiring authentication are protected by the `isAuthenticated` middleware, which validates the JWT sent in the `x-access-token` header.

## Socket Events

Real-time functionality is powered by Socket.IO.

* **Connection:** When a client connects to the Socket.IO server (`io.on('connection', ...)` in `backend/src/index.js`).
* **`JOIN_CHANNEL_EVENT` (`join_channel`):**
    * **Emitted by:** Client
    * **Payload:** `{ channelId: string }`
    * **Action:** Server joins the client's socket to a room identified by `channelId`.
    * **Callback:** Server sends a confirmation back to the client.
    * **Handled in:** `backend/src/controllers/channelSocketController.js` (and also duplicated in `messageSocketController.js` - this might need review for clarity/deduplication).
* **`NEW_MESSAGE_EVENT` (`newMessage` - *as per `messageController.js`*):**
    * **Emitted by:** Server (after a message is successfully created via the POST API endpoint)
    * **Payload:** The newly created message object.
    * **Action:** Broadcasts the new message to all clients connected to the specific `channelId` room.
    * **Handled in:** Implicitly by clients listening for this event. The emission is done in `backend/src/controllers/messageController.js`.

**Note:** The `backend/src/controllers/messageSocketController.js` currently duplicates the `join_channel` handler from `channelSocketController.js`. Its purpose might be intended for more message-specific socket events in the future, or it might be redundant.

## Available Scripts

### Backend (`backend/package.json`)

* `npm start` or `yarn start`:
    * Runs `npx nodemon src/index.js`.
    * Starts the backend server in development mode with `nodemon`, which automatically restarts the server upon file changes.
* `npm run lint` or `yarn lint`:
    * Runs `eslint .`.
    * Checks the codebase for linting errors based on the ESLint configuration.
* `npm run format` or `yarn format`:
    * Runs `prettier --write .`.
    * Formats all code in the project using Prettier.
* `npm run lint:fix` or `yarn lint:fix`:
    * Runs `eslint --fix .`.
    * Attempts to automatically fix linting errors.
* `npm test` or `yarn test`:
    * Currently, `echo "Error: no test specified" && exit 1`.
    * This script is a placeholder and needs to be configured if tests are added.

### Frontend (`frontend/package.json`)

* `npm run dev` or `yarn dev`:
    * Runs `vite`.
    * Starts the Vite development server for the frontend application, enabling Hot Module Replacement (HMR).
* `npm run build` or `yarn build`:
    * Runs `vite build`.
    * Creates a production-ready build of the frontend application in the `dist/` directory.
* `npm run preview` or `yarn preview`:
    * Runs `vite preview`.
    * Serves the production build locally for testing before deployment.
* `npm run lint` or `yarn lint`:
    * Runs `eslint . --ext .js,.jsx,.ts,.tsx`.
    * Checks the frontend codebase for linting errors.
* `npm run format` or `yarn format`:
    * Runs `prettier --write .`.
    * Formats all code in the frontend project using Prettier.

## Linting and Formatting

This project enforces code quality and consistency using ESLint for linting and Prettier for code formatting.

* **Backend:**
    * Configuration: `backend/eslint.config.js`
    * Uses `@eslint/js` recommended rules and `globals` for Node.js environment.
* **Frontend:**
    * Configuration: `frontend/eslint.config.js`
    * Includes plugins for React (`eslint-plugin-react`), React Hooks (`eslint-plugin-react-hooks`), React Refresh (`eslint-plugin-react-refresh`), and simple import sorting (`eslint-plugin-simple-import-sort`).
    * Integrates with Prettier via `eslint-config-prettier` and `eslint-plugin-prettier`.

It's recommended to run the linting and formatting scripts regularly and integrate them into your development workflow (e.g., pre-commit hooks).

## Environment Variables

Secure and environment-specific configurations are managed using `.env` files. **Do not commit actual `.env` files to version control.** Instead, use `.env.example` files as templates.

### Backend (`backend/.env`)

| Variable              | Description                                                                 | Example                              |
| :-------------------- | :-------------------------------------------------------------------------- | :----------------------------------- |
| `PORT`                | The port on which the backend server will run.                              | `3000`                               |
| `NODE_ENV`            | The runtime environment (`development` or `production`).                    | `development`                        |
| `DEV_DB_URL`          | MongoDB connection URI for the development database.                        | `mongodb://localhost:27017/syncspace_dev` |
| `PROD_DB_URL`         | MongoDB connection URI for the production database.                         | `mongodb+srv://user:pass@cluster/prod_db` |
| `JWT_SECRET`          | Secret key used to sign and verify JSON Web Tokens.                         | `aVerySecureSecretKey123!`           |
| `JWT_EXPIRATION_TIME` | Duration for which JWTs remain valid (e.g., `1d`, `2h`, `30m`).               | `1d`                                 |
| `MAIL_ID`             | Email address used by Nodemailer to send emails.                            | `your.email@gmail.com`               |
| `MAIL_PASSWORD`       | App-specific password for the `MAIL_ID` (especially for services like Gmail). | `yourgmailapppassword`               |
| `REDIS_HOST`          | Hostname of the Redis server for Bull queues.                               | `127.0.0.1`                          |
| `REDIS_PORT`          | Port number for the Redis server.                                           | `6379`                               |

### Frontend (`frontend/.env`)

| Variable                 | Description                                    | Example                          |
| :----------------------- | :--------------------------------------------- | :------------------------------- |
| `VITE_BACKEND_API_URL` | Base URL for the backend API endpoints.        | `http://localhost:3000/api/v1`   |

## Contributing

We welcome contributions to SyncSpace! To contribute:

1.  **Fork the Repository:** Create your own copy of the project.
2.  **Create a Feature Branch:**
    ```bash
    git checkout -b feature/your-amazing-feature
    ```
3.  **Make Your Changes:** Implement your feature or bug fix.
    * Ensure your code adheres to the existing coding style and ESLint/Prettier configurations.
    * Write clear and concise commit messages.
4.  **Test Your Changes:** (If applicable, add/update tests).
5.  **Lint and Format:**
    ```bash
    # In backend/
    npm run lint
    npm run format
    # In frontend/
    npm run lint
    npm run format
    ```
6.  **Push to Your Branch:**
    ```bash
    git push origin feature/your-amazing-feature
    ```
7.  **Open a Pull Request:** Submit a PR to the main repository with a clear description of your changes.

