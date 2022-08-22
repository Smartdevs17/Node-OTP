const express = require("express");
const app = express();

const userRoute = require("./Routers/userRouter");

app.use(express.json());
app.use("/api/register/user",userRoute)



module.exports = app;