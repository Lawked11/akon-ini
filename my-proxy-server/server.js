const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Endpoint to receive data and forward to Webhook.site
app.post('/send-webhook', async (req, res) => {
    const webhookUrl = 'https://webhook.site/da4b8f92-dfec-4654-9e57-46fab5dcfcb3'; // Make sure this URL is correctly written

    
    try {
        // Forward request to Webhook.site
        const response = await axios.post(webhookUrl, req.body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        res.status(200).json({
            message: 'Data sent to webhook successfully',
            data: response.data,
        });
    } catch (error) {
        console.error('Error sending data to webhook:', error);
        res.status(500).json({
            message: 'Failed to send data to webhook',
            error: error.message,
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Node server is running on http://localhost:${PORT}`);
});
