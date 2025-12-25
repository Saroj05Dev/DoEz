const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // 👈 Add this import

const ServerConfig = require('./config/serverConfig');
const connectDB = require('./config/dbConfig');
const serviceRoutes = require('./routes/Service_routes');
const subServiceRoutes = require('./routes/Sub_services_routes');
const bookingRoutes = require('./routes/booking_routes');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const provideroutes = require('./routes/Provider_routes');
const reviewroutes = require('./routes/review_routes');

const app = express();

// 👈 ADD CORS HERE - BEFORE any routes or middleware
app.use(cors({
  origin: 'http://localhost:5173',  // Your Vite frontend
  credentials: true                 // Required for httpOnly cookies
}));

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/services', serviceRoutes);
app.use('/api/sub-services', subServiceRoutes);
app.use('/api/reviews', reviewroutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/provider', provideroutes);

app.listen(ServerConfig.PORT, async () => {
    await connectDB();
    console.log(`Server started at port ${ServerConfig.PORT}...!!`);
});