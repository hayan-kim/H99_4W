const express = require("express");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const authmiddelware = require("./middlewares/auth-middleware");
const router = express.Router();


const postUsersSchema = Joi.object({
    email: Joi.string().min(4).max(16).required(),
    nickname: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,16}$'))
        .required(),
    password: Joi.string().min(4).max(16).required(),
    confirmPassword: Joi.string().min(4).max(16).required(),
});
// 회원 가입 API
router.post("/new_users", async (req, res) => {
    const { nickname, email, password, confirmPassword } = req.body

    if (password.includes(nickname) || password.includes(email)) {
        res.status(400).send({
            errorMessage: '패스워드에 닉네임이나 이메일이 포함되어 있습니다.',
        })
    }

    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
        });
        return;
    }

    const existUsers = await User.find({
        $or: [{ email }, { nickname }]
    });
    if (existUsers.length) {
        res.status(400).send({
            errorMessage: '이미 가입된 이메일 또는 닉네임이 있습니다.'
        });
        return;
    }

    const user = new User({ email, nickname, password });

    await user.save();

    res.status(201).send({});
});

//로그인 API

router.post("/auth", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findone({ email, password }).exec();

    if (!user) {
        res.status(400).send({
            errorMessage: '이메일 또는 패스워드가 잘못됐습니다.',
        });
        return;
    }

    const token = jwt.sign({ userId: user.userId }, "white-secret-key");
    res.send({
        token,
    });

});

// 로그인 검사
router.get("/users/me", authmiddelware,  async (req, res) =>{
    const { user } = res.locals;
    res.send({
        user: {
            email: user.email,
            nickname: user.nickname,
        },// 패스워드 안남기는 게 좋기떄문
    });
});