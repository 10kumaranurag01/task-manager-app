const express = require('express');
const catalystSDK = require('zcatalyst-sdk-node');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    const catalyst = catalystSDK.initialize(req);
    res.locals.catalyst = catalyst;
    next();
});

app.use('/tasks', taskRoutes);

module.exports = app;
