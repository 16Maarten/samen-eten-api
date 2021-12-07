const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const secret = process.env.JWT_SECRET
        jwt.verify(token, secret)
        req.user = jwt.decode(token)
        next()
    } catch (e) {
        return res.status(401).send({
            code: 401,
            error: "Unauthorized ",
            message: "You are not signed in"
        })
    }
}