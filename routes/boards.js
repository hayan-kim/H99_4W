const express = require("express");
const Boards = require("../schemas/boards")
const router = express.Router();



router.get("/boards", async (req, res) => {

    const boardslist = await Boards.find().sort({'date':-1});
    res.json({
        boardslist
    })
})



router.get("/boards/:boardsId", async (req, res) => {
    const { boardsId } = req.params;

    const [detail] = await Boards.find({_id: boardsId});
    res.json({
        detail
    })
})



router.delete("/boards/:boardsId", async (req, res) => {
    const { boardsId } = req.params;
    const { password } = req.body;
    
    const existsBoards = await Boards.find({ _id: boardsId, password: password })
    if(!existsBoards.length){
        res.json({ result: "fail" })
    }else{
        await Boards.deleteOne({ _id: boardsId });
        res.json({ result: "success" });
    }
    
})



router.patch("/boards/:boardsId", async (req, res) => {
    const { boardsId } = req.params;
    const { title, content, password } = req.body;
    
    const existsBoards = await Boards.find({ _id: boardsId, password: password })

    if(!existsBoards.length){
        res.json({ result: "fail" })
    }else{
        await Boards.updateOne({ _id: boardsId }, { $set: { title, content } });
        res.json({ result: "success" });
    }
})




router.post("/boards", async (req, res) =>{
    const { title, user, password, content } = req.body;

    const createdBoards = await Boards.create({ title: title, user: user, password: password, content: content });
    res.json({ boards: createdBoards });
});



module.exports = router;