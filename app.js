const express = require("express");
const app = express();
const postsRoutes = require("./api/posts/posts.routes");
const connectDb = require("./database");

connectDb();
app.use(express.json());
app.use("/posts", postsRoutes);
// Error Handling Middleware
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

//Path Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ messgae: "Path Not Found" });
});
app.listen(8000, () => {
  console.log("The application is running on localhost:8000");
});
