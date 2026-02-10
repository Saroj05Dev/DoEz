const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// import { v2 as cloudinary } from 'cloudinary';
const path = require("path");


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
const notificationRoutes = require('./routes/notification_routes');


const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
});

// Socket.io Map to track users
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    userSockets.set(userId, socket.id);
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  });

  socket.on('updateLocation', (data) => {
    // data: { userId, role, lat, lng, bookingId, targetId }
    const { userId, role, lat, lng, bookingId, targetId } = data;

    // Broadcast to the specifically targeted user (the other party in the booking)
    if (targetId) {
      io.to(`user_${targetId}`).emit('locationUpdated', {
        userId,
        role,
        lat,
        lng,
        bookingId
      });
    }
  });

  socket.on('disconnect', () => {
    // Find and remove the user from mapping
    for (let [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        break;
      }
    }
    console.log('User disconnected');
  });
});

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
app.use('/api/admin', adminRouter);
app.use('/api/notifications', notificationRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

server.listen(ServerConfig.PORT, async () => {
  await connectDB();
  console.log(`Server started at port ${ServerConfig.PORT}...!!`);
});