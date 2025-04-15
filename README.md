# SadaqaWorks

A web application inspired by the prophetic approach to charity, focusing on empowerment and self-sufficiency through work.

## Project Structure

*   `/index.html`: Frontend HTML structure and layout.
*   `/script.js`: Frontend JavaScript for DOM manipulation, API calls, and UI logic.
*   `/sadaqaworks-backend`: Contains the Node.js/Express backend server.
    *   `server.js`: Main backend application file.
    *   `package.json`: Backend dependencies.
*   `.gitignore`: Specifies intentionally untracked files that Git should ignore.
*   `context.md`: High-level overview and context for the application (AI-generated).

## Running the Application

1.  **Start the Backend:**
    ```bash
    cd sadaqaworks-backend
    npm install  # If you haven't already
    node server.js
    ```
    The backend will run on `http://localhost:3000`.

2.  **Open the Frontend:**
    *   Open the `index.html` file directly in your web browser.
    *   Alternatively, use a local development server (like VS Code's Live Server) to serve `index.html`.

## Features

*   Role-based dashboards (Admin, Worker, Volunteer, Donor).
*   Admin: Project creation, statistics overview.
*   Volunteer: Registration form and list view.
*   PayPal donation integration.
*   Basic frontend routing and navigation.

## Contributing

(Add contribution guidelines here if applicable)

## License

(Add license information here if applicable) 