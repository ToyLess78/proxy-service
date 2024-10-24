const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.all("/api/*", async (req, res) => {
    const backendUrl = "http://48.209.37.8:8000";
    const apiUrl = `${backendUrl}${req.path.replace("/api", "")}`;

    try {
        const response = await axios({
            method: req.method,
            url: apiUrl,
            data: req.body,
            headers: req.headers,
        });

        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        res.status(response.status).send(response.data);
    } catch (error) {
        const errorHandlers = {
            response: () => res.status(error.response.status).send({
                error: error.response.data,
                status: error.response.status,
                headers: error.response.headers,
            }),
            request: () => res.status(502).send({
                error: "No response received from backend",
                message: error.message,
            }),
            default: () => res.status(500).send({
                error: "Proxy server error",
                message: error.message,
            })
        };

        (errorHandlers[error.response ? 'response' : error.request ? 'request' : 'default'])();
    }
});

app.listen(port, () => {
    console.log(`Proxy service running on port ${port} http://localhost:3000/api/`);
});