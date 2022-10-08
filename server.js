const express = require("express");
const cors = require("cors");
const options = {
    origin: "http://localhost:3000",
    useSuccessStatus: 200,
}
const app = express();
app.use(cors(options));



app.get("/",(req,res) => {
    res.send("Welcome from home");
})
app.get("/books",(req,res) => {
    res.send("Welcome from books");
})
const PORT = 8000;
app.listen(PORT,() => {
    console.log("Server is running in", PORT);
})