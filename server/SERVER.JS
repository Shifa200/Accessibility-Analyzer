// 1. Load environment variables from .env file
require('dotenv').config();

// 2. Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 3. Initialize Express app
const app = express();

// 4. Define PORT and MongoDB URI from environment variables
const PORT = process.env.PORT || 5000; // Use port 5000 for backend
const MONGODB_URI = process.env.MONGODB_URI;

// 5. Middleware Setup
// Enable CORS for all routes - this is important for frontend-backend communication
app.use(cors());
// Parse JSON request bodies (e.g., when your frontend sends data)
app.use(express.json());

// 6. Database Connection
// Check if MONGODB_URI is defined
if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in your .env file.');
    process.exit(1); // Exit the process if URI is missing
}

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit if connection fails
    });

// 7. Basic Route for Testing (API Endpoint)
// When a GET request comes to the root URL '/', respond with a message.
app.get('/', (req, res) => {
    res.send('Accessibility Analyzer Backend is running!');
});

// 8. Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});