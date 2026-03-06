const express = require("express");

const app = express();

app.use(express.json());


const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const donationRoutes = require("./routes/donationRoutes");
const slotRoutes = require("./routes/slotRoutes");
const templeRoutes = require("./routes/templeRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/temples", templeRoutes);

module.exports = app;