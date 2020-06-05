### Development

Create a .env.local file inside the client folder, copy the content of .env.local.example into it and update the values as needed. Create a .env file inside the server folder, copy the content of .env.example into it and update the values as needed. The values for mongo db connection should be same as the values in the mongo service.

To start the app with simply run `docker-compose up`. If this is the first time this command is run, it will build the all three services needed to run the app: client, server, database.

React frontend is running on port 5000, and nest backend on port 3000
