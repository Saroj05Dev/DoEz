const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors'); 

const ServerConfig = require('./config/serverConfig');
const connectDB = require('./config/dbConfig');
const serviceRoutes = require('./routes/Service_routes');
const subServiceRoutes = require('./routes/Sub_services_routes');
const subServices1Routes = require('./routes/Sub_services1_routes');
const subService2Routes = require('./routes/Sub_service2_routes');
const subService3Routes = require('./routes/Sub_service3_routes');
const bookingRoutes = require('./routes/booking_routes');
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/admin_routes');
const authRouter = require('./routes/authRoutes');
const provideroutes = require('./routes/Provider_routes');
const reviewroutes = require('./routes/review_routes');

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true                 
}));

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/services', serviceRoutes);
app.use('/api/sub-services', subServiceRoutes);
app.use('/api/sub-services1', subServices1Routes);
app.use('/api/sub-services2', subService2Routes);
app.use('/api/sub-services3', subService3Routes);
app.use('/api/reviews', reviewroutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/provider', provideroutes);

app.listen(ServerConfig.PORT, async () => {
    await connectDB();
    console.log(`Server started at port ${ServerConfig.PORT}...!!`);
});