const express = require("express")
const Board = require("../schemas/board")
const router = express.Router();


// 게시글 작성
router.post("/boards", async (req, res) => {    
  const { boardId, content } = req.body;
  
   const Createboard = await Board.create({
        boardId,content,
    }
  );     

  res.json({ message: "게시글을 작성했습니다." });
});


/// 게시글 조회 
router.get("/boards/:boardId", async (req,res) => {                   
    const { boardId }= req.params;

    const [board] = await Board.find({ boardId });
    res.json({
         board,
    });
}); 

//  게시글 수정
router.put("/boards/:boardId", async (req, res) => {
  const { boardId } = req.params;
  const {content} = req.body;

  const boards = await Board.find({ boardId });
    
  res.json({success: true, message: "게시글을 수정하였습니다."});
});

// 게시글 삭제
router.delete("/boards/:boardId", async (req, res) => {
  const { boardId } = req.params;

  const boards = await Board.find({ boardId });

  res.json({success: true, message: "게시글을 삭제하였습니다."});
});

module.exports = router;