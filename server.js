const express = require("express");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./config/.env" });
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./config/db");
const { requireAuth } = require("./middleware/auth.middleware");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://frontend-blog-mern-tnlz.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      origin?.includes(".vercel.app")
    ) {
      return callback(null, true);
    }
    return callback(new Error("CORS blocked"), false);
  },
  credentials: true,
  allowedHeaders: ["sessionId", "Authorization", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// JWT
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Authenticated user",
    user: res.locals.user,
  });
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// Export pour Vercel (obligatoire)
module.exports = app;

// Listen uniquement en local
if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
}
