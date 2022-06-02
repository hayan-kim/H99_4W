const express = require("express");
const Boards = require("../schemas/boards")
const Users = require("../models/user")
const Comments = require("../models/comment");
const comment = require("../models/comment");
const authMiddelware = require("../middlewares/auth-middleware");
const router = express.Router();


//전체 게시글 목록 조회
router.get("/boards", async (req, res) => {

    const boardslist = await Boards.find().sort({ 'date': -1 });
    res.json({
        boardslist
    })
})


//게시글 조회
router.get("/boards/:boardsId", async (req, res) => {
    const { boardsId } = req.params;

    const [detail] = await Boards.find({ _id: boardsId });
    res.json({
        detail
    })
})

//댓글 목록 조회 API
router.get("/comments/:commentId",  async (req, res) => {
    const { commentId } = req.params;

    const comments = await Comments.find({ commentId: commentId});
    const [detail] = await Comments.find({ _id: commentId});
    res.json({
        detail, comments
    });
})


//게시글 삭제
router.delete("/boards/:boardsId", async (req, res) => {
    const { boardsId } = req.params;
    const { password } = req.body;

    const existsBoards = await Boards.find({ _id: boardsId, password: password })
    if (!existsBoards.length) {
        res.json({ result: "fail" })
    } else {
        await Boards.deleteOne({ _id: boardsId });
        res.json({ result: "success" });
    }

})

//댓글 삭제
router.delete("/comments/:commentId", authMiddelware, async (req, res) =>{
    const { userId } = res.locals.user;
    const { commentId } = req.params;


    const [ detail1 ] = await Comments.find({_id: commentId});
    const [ detail2 ] = await Users.find({_id: userId});

    if(detail1.user === detail2){
        await Comments.deleteOne({ _id: commentId});
        res.json({ result: "success"})
    }else{
        res.json({ result: "fail"});
    }

});


//게시글 수정
router.patch("/boards/:boardsId", async (req, res) => {
    const { boardsId } = req.params;
    const { title, content, password } = req.body;

    const existsBoards = await Boards.find({ _id: boardsId, password: password })

    if (!existsBoards.length) {
        res.json({ result: "fail" })
    } else {
        await Boards.updateOne({ _id: boardsId }, { $set: { title, content } });
        res.json({ result: "success" });
    }
});

//댓글 수정
router.patch("/comments/:commentId", authMiddelware, async (req, res) =>{
    const { userId } = res.locals.user;
    const { commentId } = req.params;

    const { comment, user } = req.body;

    const existComments = await Comments.find({ _id : commentId}, { $set: {comment,user } });

    if(!existComments.length) {
        res.json({ result: "fail" });
    }else {
        await Comments.updateOne({ _id: commentId}, { $set: {comment,user}});
        res.json({ result: "success"})
    }
});



//게시글 작성
router.post("/boards", async (req, res) => {
    const { userId } = res.locals.user;
    const { title, user, password, content } = req.body;

    const createdBoards = await Boards.create({ title: title, user: user, password: password, content: content });
    res.json({ boards: createdBoards });
});


//댓글 작성 API
router.post("/comments", authMiddelware, async (req, res) => {
    const { userId } = res.locals.user;
    const writeId = await Users.findOne({ _id: userId }).exec();

    const { contentId, content } = req.body;

    if (comment === " ") {
        res.send("댓글을 입력해주세요.")
        return;
    }

    const createComment = await Comments.create({ commentId: contentId, comment: comment, user: writeId.user });

    res.send("댓글 입력이 완료!")
});


module.exports = router;