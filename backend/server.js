const express = require("express");
const dotenv = require("dotenv").config()
const connectDb = require("./config/dbConnection");
const app = express()
const cors = require("cors")
const port = process.env.PORT || 5000;

connectDb()
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000' || 'http://localhost:8000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(cors({ credentials: true, origin: "http://localhost:3000" || "http://localhost:8000" }))
app.use(express.json())
app.use("/api/users", require("./routes/userRoutes"))
app.use("/api/attendance", require("./routes/attendanceRoutes"))

app.get('/', (req, res) => {
    res.send('Hello World To Docker!');
  });

app.listen(port, () => {
    console.log('Server is running on port: ', port);
});