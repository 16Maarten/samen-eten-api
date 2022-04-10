require("dotenv").config();
const User = require("../models/user.model")();
const neo = require("../../neo");
const jwtSecretKey = process.env.JWT_SECRET;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sign = require("../helpers/jwt.sign");
const jwtDecode = require("../helpers/jwt.decode");

class UserController {
  validateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res
        .status(401)
        .json({
          error: "Authorization header missing!",
          datetime: new Date().toISOString(),
        })
        .end();
    } else {
      const token = authHeader.substring(7, authHeader.length);
      jwt.verify(token, jwtSecretKey, (err, payload) => {
        if (err) {
          res
            .status(401)
            .json({
              error: "Not authorized",
              datetime: new Date().toISOString(),
            })
            .end();
        }
        if (payload) {
          req.userId = payload.id;
          next();
        }
      });
    }
  }

  async login({ body }, res, next) {
    const foundUser = await User.findOne({ email: body.email });
    if (foundUser === null) {
      return res
        .status(401)
        .json({
          message: "Email does not exist",
        })
        .end();
    }
    const isPasswordValid = await bcrypt.compare(
      body.password,
      foundUser.password
    );
    if (isPasswordValid) {
      const token = await sign(foundUser);
      return res
        .status(200)
        .json({
          message: "Login Success",
          _id: foundUser._id,
          userName: foundUser.userName,
          email: foundUser.email,
          token: token,
        })
        .end();
    } else {
      return res
        .status(401)
        .json({
          message: "Password is incorrect",
        })
        .end();
    }
  }

  async create({ body }, res, next) {
    if (body.password === undefined) {
      res.status(400).send({ message: "password is missing" }).end();
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;

    const newUser = await User.create(body);
    const token = await sign(await newUser);

    const session = neo.session();
    await session.run(neo.create, {
      userId: newUser._id.toString(),
    });
    session.close();

    res
      .send({
        message: "Creation Success",
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        token: token,
      })
      .end();
  }

  async follow(req, res, next) {
    const user1Id = req.body.user;
    const user2Id = req.params.id;
    if (user1Id && user2Id) {
      const user1 = await checkId(user1Id);
      const user2 = await checkId(user2Id);
      if (user1 && user2) {
        try {
          const session = neo.session();
          await session.run(neo.follow, {
            user1Id: user1Id,
            user2Id: user2Id,
          });
          session.close();
        } catch (error) {
          next();
        }
        res.status(200).send({ message: "Follow succes" }).end();
      } else {
        res
          .status(400)
          .send({ message: "UserId or FollowerId doesn't exist" })
          .end();
      }
    } else {
      res.status(400).send({ message: "missing id" }).end();
    }
    function checkId(id) {
      return User.findById(id);
    }
  }

  async followers(req, res, next) {
    const userId = req.params.id;
    const follow = req.body.follow;
    if (userId) {
      const user1 = await checkId(userId);
      if (user1) {
        let users;
        try {
          const session = neo.session();
          if (follow) {
            users = await session.run(neo.yourFollowers, {
              userId: userId,
            });
          } else {
            users = await session.run(neo.followers, {
              userId: userId,
            });
          }
          session.close();
        } catch (error) {
          next();
        }
        let followers = [];
        for (let i = 0; i < users.records.length; i++) {
          const node = users.records[i]._fields[0];
          let returnItem = await User.findById(node.properties._id);
          returnItem = {
            _id: returnItem._id,
            firstName: returnItem.firstName,
            lastName: returnItem.lastName,
          };
          followers.push(returnItem);
        }
        res.status(200).send(followers).end();
      } else {
        res
          .status(400)
          .send({ message: "UserId or FollowerId doesn't exist" })
          .end();
      }
    } else {
      res.status(400).send({ message: "missing id" }).end();
    }
    function checkId(id) {
      return User.findById(id);
    }
  }

  async unfollow(req, res, next) {
    const user1Id = req.body.user;
    const user2Id = req.params.id;
    if (user1Id && user2Id) {
      const user1 = await checkId(user1Id);
      const user2 = await checkId(user2Id);
      if (user1 && user2) {
        try {
          const session = neo.session();
          await session.run(neo.unfollow, {
            user1Id: user1Id,
            user2Id: user2Id,
          });
          session.close();
        } catch (error) {
          next();
        }
        res.status(200).send({ message: "unFollow succes" }).end();
      } else {
        res
          .status(400)
          .send({ message: "UserId or FollowerId doesn't exist" })
          .end();
      }
    } else {
      res.status(400).send({ message: "missing id" }).end();
    }
    function checkId(id) {
      return User.findById(id);
    }
  }

  delete = async (req, res, next) => {
    const entity = await User.findById(req.params.id);
    await entity.delete()
    const session = neo.session();
    await session.run(neo.delete, {
      user: req.params.id,
    });
    session.close();
    res
      .status(200)
      .send({message: "entity with id: " + req.params.id + " deleted"})
      .end();
  };
}
module.exports = new UserController();
