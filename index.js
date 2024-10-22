const express = require("express");
const axios = require("axios");
const cors = require("cors"); // CORS connection
const app = express();
const port = process.env.PORT || 3000;

// Allow all requests (for simplicity, but can be limited to specific domains)
app.use(cors());

// Middleware for handling JSON-tel
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

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error("Error with proxy request:", error.message);
        res.status(500).send("Error with proxy request");
    }
});

app.listen(port, () => {
    console.log(`Proxy service running on port ${port}`);
});