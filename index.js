const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000; // Railway will automatically set the PORT

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

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error("Error with proxy request:", error.message);
        res.status(500).send("Error with proxy request");
    }
});

app.listen(port, () => {
    console.log(`Proxy service running on port ${port}`);
});