const jwt = require("jsonwebtoken");
const User = require("../models/user")

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(' ');

    if(tokenType !== 'Bearer'){
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요',
        });
        return;
    }
    //에러가 났다면
    try {
        //검증
        const { userId } =jwt.verify(tokenValue,"my-secret-key");
        //유저가 데이터 베이스에 있는지 확인
      User.findById(userId).exec().then((user) =>{
            res.locals.user = user;
            next();
        }) ;
    } catch (error) {
        res.status(401).send({
            errorMessage: "로그인 후 사용하세요",
        });
        return;
    }
};