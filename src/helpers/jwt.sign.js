const secret = process.env.JWT_SECRET || "secret"
const jwt = require('jsonwebtoken')
module.exports = async function(user) {
    return await jwt.sign(await user.toJSON(), secret)
}