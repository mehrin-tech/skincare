import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
console.log('ENV CHECK:', process.env.NODE_ENV);
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import doctorRoutes from './routes/doctor.js';
import appointmentRoutes from './routes/appointment.js';
import requestLogger from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { NotFoundError } from './utils/appError.js';
import servicesRoutes from "./routes/services.js";
import aboutRoutes from "./routes/about.js";
import jwt from 'jsonwebtoken';
import User from './models/User.js';
// ES6 module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Connect to database
connectDB();

const app = express();

// View Engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Expose logged-in user to EJS views globally for premium navbar dynamic auth states
app.use(async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        res.locals.user = user;
      }
    }
  } catch (err) {
    // Session token invalid or expired, proceed silently as guest
  }
  next();
});

app.use(requestLogger);

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);
app.use("/services", servicesRoutes);

app.use("/about", aboutRoutes);

app.use((req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
