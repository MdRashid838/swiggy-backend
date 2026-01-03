require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectMongoDB = require("./src/connection");
const bodyParser = require("body-parser");
const path = require("path");

const Restaurant = require("./src/routes/restaurantRouter");
const menuItem = require("./src/routes/menuItemRouter");
const orderRoute = require("./src/routes/orderRouter");
const authRouter = require("./src/routes/authRouter");
const userRoute = require("./src/routes/userRouter");

const app = express();

/* ================== MIDDLEWARE FIRST ================== */

app.use(
  cors({
    origin: [
      "https://www-swiggy-clone-mq7x.onrender.com",
      "http://localhost:5173",
    ],
    methods: "GET,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ BODY PARSER MUST COME BEFORE ROUTES
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ================== STATIC ================== */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================== DB ================== */
connectMongoDB();

/* ================== ROUTES ================== */

app.use("/auth", authRouter);
app.use("/restaurant", Restaurant);
app.use("/menuitem", menuItem);
app.use("/orders", orderRoute);
app.use("/users", userRoute);

/* ================== DEFAULT ================== */

app.get("/", (req, res) => {
  res.send("Zomato Clone API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("app is running on port", PORT);
});
