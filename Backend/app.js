const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');
const captionRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const errorHandler = require('./middlewares/errorHandler');
const rideRoutes = require('./routes/ride.routes');
const extraRoutes = require('./routes/extra.routes');

connectToDb();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
};

app.use(cors( corsOptions ));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/users', userRoutes);
app.use('/captains', captionRoutes);
app.use('/maps', mapsRoutes);
app.use('/rides', rideRoutes);
app.use('/extra',extraRoutes);

// Use the error handling middleware
app.use(errorHandler);

module.exports = app;