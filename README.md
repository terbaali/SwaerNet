# Project Name

## Getting Started

These instructions will help you get the project up and running on your local machine.

### Prerequisites

- Make sure you have [Node.js](https://nodejs.org/) installed.
- Set up a MySQL database with the provided `swearnetdb.sql` file.

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/project-name.git
    ```

2. Navigate to the project directory:

    ```bash
    cd project-name
    ```

3. Set up the database:

    - Import the `swearnetdb.sql` file into your MySQL database.

4. Configure API environment variables:

    - Go to the `API` directory.
    - Create a new file named `.env` if it doesn't exist.
    - Add the necessary environment variables to `.env`.

5. Install API dependencies:

    ```bash
    cd API
    npm install
    ```

### Running the API

1. Start the API:

    ```bash
    node index.js
    ```

2. The API should now be running at [http://localhost:your-port](http://localhost:your-port).
