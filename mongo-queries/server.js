require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = express();

connectDB();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API is running")
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
app.use("/api/users", require("./routes/userRoutes"))
