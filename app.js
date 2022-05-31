const express = require("express");

const connect = require("./schemas")          // index.js 는 생략가능함
const app = express();
const port = 3000;


connect();

const boardsRouter = require("./routes/boards");

const requestMiddleware = (req, res, next) =>{
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
}

app.use(express.json());
app.use(requestMiddleware);

app.use("/api", [boardsRouter]);

app.get('/', (req,res) => {                 
    res.send("Hello World")
});

app.listen(port, () => {
    console.log(port, "포트가 서버가 켜졌어요!");
});