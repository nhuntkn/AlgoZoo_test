const express = require('express');
const app = require('../src/app/index');
const { APP_PORT } = require('../src/config/env');
const fileRoutes = require("./routes/fileRoutes");

app.use("/api/files", fileRoutes);

// Global error handling middleware
app.use((error, req, res, next) => {
    if (res.headersSent) { // Corrected from res.headerSent to res.headersSent
        return next(error);
    }
    res.status(error.status || 500); // Corrected from error.code to error.status
    res.json({ message: error.message || 'An unknown error occurred!' });
});

app.use(express.static('./public'))

// Start the server
app.listen(APP_PORT, () => {
    console.log(`Server is running on port ${APP_PORT}`); // Corrected string interpolation
});
