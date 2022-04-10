const requester = require("./requester.spec");
const User = require("../src/models/user.model")();

let testUser1;
let token;
let user2Id;
let user;
const testUser2 = {
    firstName: "gerrit",
    lastName: "de Haan",
    email: "gerrit@server.nl",
    studentNumber: 1242426,
    birthday: "2004-08-12",
    password: "secrets",
  };
describe("User CRUD", () => {
    beforeEach(async () => {
        const result = await requester.post("/api/users/register").send(testUser2);
        token = result.body.token
        user2Id = result.body._id
        testUser1 = {
            firstName: "Henk",
            lastName: "de Wit",
            email: "henk@server.nl",
            studentNumber: 4357383,
            birthday: "2004-08-12",
            password: "secrets",
        };
        user = {
            user: ""
        }
      })
    it("Should create a user", async function () {
        const res = await requester.post(`/api/users/register`).send(testUser1)
        const user = await User.findById(res.body._id);
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.keys("_id","token","message","email");
        res.body._id.should.be.a("string").that.equals(user._id.toString());
      });
    
      it("Should give error name is missing", async function () {
        delete testUser1.firstName
        const res = await requester.post(`/api/users/register`).send(testUser1)
        res.should.have.status(400);
        res.body.should.be.an("object").that.has.keys("message");
        res.body.message.should.be.a("string").that.equals("user validation failed: firstName: An user needs to have a firstName.");
      });
    
      it("Should give error ivalid email", async function () {
        testUser1.email = "jhgsasdjhg"
        const res = await requester.post(`/api/users/register`).send(testUser1)
        res.should.have.status(400);
        res.body.should.be.an("object").that.has.keys("message");
        res.body.message.should.be.a("string").that.equals("user validation failed: email: Invalid email");
      });

      it("Should give error ivalid email", async function () {
        testUser1.studentNumber = 12
        const res = await requester.post(`/api/users/register`).send(testUser1)
        res.should.have.status(400);
        res.body.should.be.an("object").that.has.keys("message");
        res.body.message.should.be.a("string").that.equals("user validation failed: studentNumber: A studentNumber has to be higher then 100000");
      });

      it("Should login user", async function () {
        await requester.post(`/api/users/register`).send(testUser1)
        const res = await requester.post(`/api/users/login`).send({  email: testUser1.email,password: testUser1.password})
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.keys("_id","token","message","email");
        res.body.message.should.be.a("string").that.equals("Login Success");
      });

      it("Shouldn't login user because of password", async function () {
        await requester.post(`/api/users/register`).send(testUser1)
        const res = await requester.post(`/api/users/login`).send({  email: testUser1.email,password: "123"})
        res.should.have.status(401);
        res.body.should.be.an("object").that.has.keys("message");
        res.body.message.should.be.a("string").that.equals("Password is incorrect");
      });

      it("Shouldn't login user because of email", async function () {
        await requester.post(`/api/users/register`).send(testUser1)
        const res = await requester.post(`/api/users/login`).send({  email: "email@mail.nl",password: testUser1.password})
        res.should.have.status(401);
        res.body.should.be.an("object").that.has.keys("message");
        res.body.message.should.be.a("string").that.equals("Email does not exist");
      });
    
      it("Should give a single user", async function () {
        const id = await requester.post(`/api/users/register`).send(testUser1)
        const res = await requester.get("/api/users/" +id.body._id).set("authorization", "Bearer " + token)
        const user = await User.findById(res.body._id);
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.keys("__v","_id","birthday","email","firstName","lastName","password","studentNumber");
        res.body._id.should.be.a("string").that.equals(user._id.toString());
      });
    
      it("Shouldn't give a user", async function () {
        await requester.post(`/api/users/register`).send(testUser1)
        const res = await requester.get("/api/users/121").set("authorization", "Bearer " + token)
        res.should.have.status(400);
        res.body.should.be.an("object").that.has.keys( "message");
        res.body.message.should.be.a("string").that.equals("Invalid resource id: 121");
      });
    
      it("Should update user", async function () {
        const id = await requester.post(`/api/users/register`).send(testUser1)
        testUser1.firstName = "Jan"
        const res = await requester.put("/api/users/" +id.body._id).send(testUser1).set("authorization", "Bearer " + token)
        const user = await User.findById(res.body._id);
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.keys("__v","_id","birthday","email","firstName","lastName","password","studentNumber");
        user.firstName.should.be.a("string").that.equals("Jan");
      });
    
      it("Shouldn't update a user", async function () {
        await requester.post(`/api/users/register`).send(testUser1)
        testUser1.firstName = "Jan"
        const res = await requester.put("/api/users/121").send(testUser1).set("authorization", "Bearer " + token)
        res.should.have.status(400);
        res.body.should.be.an("object").that.has.keys( "message");
        res.body.message.should.be.a("string").that.equals("Invalid resource id: 121");
      });
    
      it("Should delete user", async function () {
        const id = await requester.post(`/api/users/register`).send(testUser1)
        const res = await requester.delete("/api/users/" +id.body._id).set("authorization", "Bearer " + token)
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.keys( "message");
        res.body.message.should.be.a("string").that.equals("entity with id: "+ id.body._id +" deleted");
      });
    
      it("Shouldn't delete a user", async function () {
        const res = await requester.delete("/api/users/121").send(testUser1).set("authorization", "Bearer " + token)
        res.should.have.status(400);
        res.body.should.be.an("object").that.has.keys( "message");
        res.body.message.should.be.a("string").that.equals("Invalid resource id: 121");
      });
    
      it("user unauthorized", async function () {
        const id = await requester.post(`/api/users/register`).send(testUser1)
        const res = await requester.delete("/api/users/" +id.body.id)
        res.should.have.status(401);
        res.body.should.be.an("object").that.has.keys( "datetime", "error");
        res.body.error.should.be.a("string").that.equals("Authorization header missing!");
      });

      it("user follow", async function () {
        const id = await requester.post(`/api/users/register`).send(testUser1)
        user.user = id.body._id;
        const res = await requester.post("/api/users/"+user2Id+"/follow").send(user).set("authorization", "Bearer " + token)
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.keys( "message");
        res.body.message.should.be.a("string").that.equals("Follow succes");
      });

      it("user doesn't follow becuase of id", async function () {
        const id = await requester.post(`/api/users/register`).send(testUser1)
        user.user = id.body._id;
        const res = await requester.post("/api/users/121/follow").send(user).set("authorization", "Bearer " + token)
        res.should.have.status(400);
        res.body.should.be.an("object").that.has.keys( "message");
        res.body.message.should.be.a("string").that.equals("Invalid resource id: 121");
      });

      it("user unfollow", async function () {
        const id = await requester.post(`/api/users/register`).send(testUser1)
        user.user = id.body._id;
        await requester.post("/api/users/"+user2Id+"/follow").send(user).set("authorization", "Bearer " + token)
        const res = await requester.delete("/api/users/"+user2Id+"/unfollow").send(user).set("authorization", "Bearer " + token)
        res.should.have.status(200);
        res.body.should.be.an("object").that.has.keys( "message");
        res.body.message.should.be.a("string").that.equals("unFollow succes");
      });

      it("user doesn't unfollow becuase of id", async function () {
        const id = await requester.post(`/api/users/register`).send(testUser1)
        user.user = id.body._id;
        await requester.post("/api/users/"+user2Id+"/follow").send(user).set("authorization", "Bearer " + token)
        const res = await requester.delete("/api/users/121/unfollow").send(user).set("authorization", "Bearer " + token)
        res.should.have.status(400);
        res.body.should.be.an("object").that.has.keys( "message");
        res.body.message.should.be.a("string").that.equals("Invalid resource id: 121");
      });

      it("Get your followers", async function () {
        const id = await requester.post(`/api/users/register`).send(testUser1)
        user.user = id.body._id;
        await requester.post("/api/users/"+user2Id+"/follow").send(user).set("authorization", "Bearer " + token)
        const res = await requester.get("/api/users/"+id.body._id+"/followers").send({"follow": true}).set("authorization", "Bearer " + token)
        res.should.have.status(200);
        res.body.should.be.an("array").that.has.lengthOf(0)
      });

      it("Doesn't get your followers because of id", async function () {
        const id = await requester.post(`/api/users/register`).send(testUser1)
        user.user = id.body._id;
        await requester.post("/api/users/"+user2Id+"/follow").send(user).set("authorization", "Bearer " + token)
        const res = await requester.get("/api/users/121/followers").send({"follow": true}).set("authorization", "Bearer " + token)
        res.should.have.status(400);
        res.body.should.be.an("object").that.has.keys( "message");
        res.body.message.should.be.a("string").that.equals("Invalid resource id: 121");
      });

      it("Get someones followers", async function () {
        const id = await requester.post(`/api/users/register`).send(testUser1)
        user.user = id.body._id;
        await requester.post("/api/users/"+user2Id+"/follow").send(user).set("authorization", "Bearer " + token)
        const res = await requester.get("/api/users/"+id.body._id+"/followers").send({"follow": false}).set("authorization", "Bearer " + token)
        res.should.have.status(200);
        res.body.should.be.an("array").that.has.lengthOf(1)
      });

      it("Doesn't get someones followers because of id", async function () {
        const id = await requester.post(`/api/users/register`).send(testUser1)
        user.user = id.body._id;
        await requester.post("/api/users/"+user2Id+"/follow").send(user).set("authorization", "Bearer " + token)
        const res = await requester.get("/api/users/121/followers").send({"follow": false}).set("authorization", "Bearer " + token)
        res.should.have.status(400);
        res.body.should.be.an("object").that.has.keys( "message");
        res.body.message.should.be.a("string").that.equals("Invalid resource id: 121");
      });

})