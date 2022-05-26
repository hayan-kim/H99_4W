const express = require ("express"); 
const connect = require("./schemas");
const app = express();
const port = 3001;

connect();

const boardRouter = require("./routes/boards");

const requestMiddleware = (req, res, next) => { 
    console.log('Request URL:', req.originalUrl, ' - ', new Date());
    next();
}
app.use(express.json()); 
app.use(requestMiddleware); 

app.use('/api', [boardRouter]); 

app.get('/', (req,res) => {     
    res.send("블로그 시작!")
});

app.listen(port, () => {                        
    console.log(port, "포트로 서버가 켜졌어요!");
});