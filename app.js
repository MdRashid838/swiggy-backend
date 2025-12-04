require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectMongoDB = require("./src/connection");

const Restaurant = require("./src/routes/restaurantRouter");
const menuItem = require("./src/routes/menuItemRouter");
const orderRoute = require("./src/routes/orderRouter");
const authRouter = require("./src/routes/authRouter");
const userRoute = require("./src/routes/userRouter");

const app = express();

// middleware
app.use(
  cors({
    origin: ["https://www-swiggy-clone-mq7x.onrender.com"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploadsItems", express.static(path.join(__dirname, "uploadsItems")));

// mongodb connection
connectMongoDB();

// routes
app.use("/restaurant", Restaurant);
app.use("/menuitem", menuItem);
app.use("/orders", orderRoute);
app.use("/auth", authRouter);
app.use("/users", userRoute);

// default route
app.get("/", (req, res) => {
  res.send("Zomato Clone API is running...");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("app is running on port 5000...", { PORT });
});
