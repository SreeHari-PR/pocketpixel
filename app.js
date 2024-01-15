require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const multer = require('multer');
const dbConnection = require('./config/config');
app.use(express.json());
dbConnection();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/adminassets')));

app.use(express.static(path.join(__dirname, 'public/assets')))

app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  next()
})






// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: process.env.SESSIONSECRET, resave: true, saveUninitialized: true }));

// Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', userRoutes);
app.use('/admin', adminRoutes);

app.use((req, res, next) => {
  res.status(404).render("./layouts/404Error", { userData: null });
  next()
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

