
const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// Load environment variables
dotenv.config({ path: "BACKEND/config/config.env" });

// Connect to MongoDB
connectDatabase();

// Start server
const server = app.listen(process.env.PORT, () => {
    console.log("Server is working on port " + process.env.PORT);
});

// Handle unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log("Error: " + err.message);
    console.log("Shutting down the server due to unhandled Promise rejection");

    server.close(() => {
        process.exit(1);
    });
}); 
//