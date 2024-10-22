const express = require("express");
const axios = require("axios");
const cors = require("cors"); // CORS connection
const app = express();
const port = process.env.PORT || 3000;

// Allow all requests (for simplicity, but can be limited to specific domains)
app.use(cors());

// Middleware for handling JSON requests
app.use(express.json());

// Proxy route for all requests
app.all("/api/*", async (req, res) => {
    const backendUrl = "http://48.209.37.8:8000"; // URL of your HTTP backend
    const apiUrl = `${backendUrl}${req.path.replace("/api", "")}`; // Forming the backend URL

    try {
        const response = await axios({
            method: req.method,
            url: apiUrl,
            data: req.body,
            headers: req.headers,
        });

        // Add CORS headers to the response
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        // Send the response back to the client
        res.status(response.status).send(response.data);
    } catch (error) {
        // Log the error for debugging
        console.error("Error with proxy request:", error.message);

        // If the error has a response from the backend (48.209.37.8)
        if (error.response) {
            // Send the error status and data from the backend
            res.status(error.response.status).send({
                error: error.response.data, // Error details from backend
                status: error.response.status, // HTTP status from backend
                headers: error.response.headers, // Headers from backend
            });
        } else if (error.request) {
            // If no response was received from the backend
            res.status(502).send({
                error: "No response received from backend",
                message: error.message,
            });
        } else {
            // For other errors (network, axios config, etc.)
            res.status(500).send({
                error: "Proxy server error",
                message: error.message,
            });
        }
    }
});

app.listen(port, () => {
    console.log(`Proxy service running on port ${port} http://localhost:3000/api/`);
});
