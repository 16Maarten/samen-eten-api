
const User = require('../models/user.model')()
const jwtSecretKey = process.env.JWT_SECRET || "secret"
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sign = require('../helpers/jwt.sign')
const jwtDecode = require('../helpers/jwt.decode')

class UserController {

    validateToken(req, res, next) {
        const authHeader = req.headers.authorization
        if (!authHeader) {
          res.status(401).json({
            error: 'Authorization header missing!',
            datetime: new Date().toISOString()
          })
        } else {
          // Strip the word 'Bearer ' from the headervalue
          const token = authHeader.substring(7, authHeader.length)
          jwt.verify(token, jwtSecretKey, (err, payload) => {
            if (err) {
              res.status(401).json({
                error: 'Not authorized',
                datetime: new Date().toISOString()
              })
            }
            if (payload) {
              req.userId = payload.id
              next()
            }
          })
        }
    }

    async login({ body }, res, next) {
        const foundUser = await User.findOne({ email: body.email })
        if (foundUser === null) {
            return res.status(401).json({
                message: 'Email does not exist'
            })
        }

        const isPasswordValid = await bcrypt.compare(body.password, foundUser.password)
        if (isPasswordValid) {
            const token = await sign(foundUser)
            return res.status(200).json({
                message: 'Login Success',
                _id: foundUser._id,
                userName: foundUser.userName,
                email: foundUser.email,
                token: token
            })
        } else {
            return res.status(401).json({
                message: 'Password is incorrect'
            })
        }
    }

    async create({ body }, res, next) {
        if (body.password === undefined) {
            res.status(400).send({ message: "password is missing" })
        }
        const hashedPassword = await bcrypt.hash(body.password, 10)
        body.password = hashedPassword

        const newUser = await User.create(body)
        const token = await sign(await newUser)

        res.send({
            message: 'Login Success',
            _id: newUser._id,
            userName: newUser.userName,
            email: newUser.email,
            token: token
        })
    }

    async getById({ params }, res, next) {
        const foundUser = await User.findById(params.id)
        res.send(foundUser)
    }

    async get({ headers }, res, next) {
        res.send(await jwtDecode(headers.authorization))
    }

    async getAll(req, res, next) {
        const users = await User.find()
        res.status(200).send(users)
    }

    async edit({ body, params }, res, next) {
        await User.findByIdAndUpdate({ _id: params.id }, body)
        res.send(await User.findById(params.id))
    }

    async delete({ body, params }, res, next) {
        const removedUser = await User.findByIdAndDelete(params.id)
        res.send({ message: "deleted", object: removedUser })
    }

}

module.exports = new UserController()