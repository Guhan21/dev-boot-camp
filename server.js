const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const colors = require("colors");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");

// Load Environment Variables
dotenv.config({ path: "./config/config.env" });

// Connect to a DataBase
connectDB();

// Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const PORT = process.env.PORT || 5000;
const env = process.env.NODE_ENV || "development";

const app = express();

// Rate limit object
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
  });

// Pre Middlewares
app.use(morgan('dev'));         // Logger
app.use(express.json());        // Body Parser
app.use(fileUpload());          // File Upload
app.use(cookieParser());        // Cookie Parser
app.use(mongoSanitize());       // Sanitize data
app.use(helmet());              // Set security headers
app.use(xss());                 // Prevent XSS attacks
app.use(limiter);               // Rate limiting
app.use(hpp());                 // Prevent http param pollution
app.use(cors());                // Enable CORS

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);


// Post Middlewares
app.use(errorHandler);

const server = app.listen(PORT, console.log(`Server running in ${env} mode on port ${PORT}`.yellow));


// Handle Unhandled Rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
