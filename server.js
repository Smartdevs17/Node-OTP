require("dotenv").config()
const mongoose = require("mongoose");
const app = require("./app")


mongoose.connect(process.env.MONGO_URL_LOCAL,{useNewUrlParser: true});

const connection = mongoose.connection;
connection.on("error", (error) => console.log(error))
connection.once("open", () => console.log("connected to DB successfully"));

const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log("Server started successfully");
})