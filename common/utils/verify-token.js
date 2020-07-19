
const jwt = require('jsonwebtoken');

class VerifyToken {
    constructor(config){

        this.token=config.get('token:secret')
        this.verifyToken= this.verifyToken.bind(this)

    }

    async verifyToken(req,res,next){
        let token = req.headers['authorization'];
        if (!token)
             res.send({
                 response: "ERROR",
                 message: "token not found"
            });

        jwt.verify(token, this.token, function(err, decoded) {
            if (err) {
                res.send({
                    response: "ERROR",
                    message: "error while authorizing"
                });
            }

            req.decoded = decoded;
              next();
        });
    }
}

module.exports = VerifyToken;