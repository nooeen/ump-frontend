# UET Management Platform: a React App with Express Server

UET Management Platform is created for class managers to manage their students' info, results and provides a communication channel for both of them.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). Then an Express server was added in the `server` directory. The server is proxied via the `proxy` key in `package.json`.

## Using this project

1. Clone the project, change into the directory and install the dependencies.

2. Create a `.env` file for environment variables in your server based on `.env.example`.

3. Start the server

   You can start the Express API server on its own with the command:

   ```bash
   yarn server
   ```

   Run the React application on its own with the command:

   ```bash
   yarn client
   ```

   Run both applications together with the command:

   ```bash
   yarn dev
   ```

   The React application will run on port 3000 and the server port 3001.
