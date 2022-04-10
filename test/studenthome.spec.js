require("dotenv").config();
const requester = require("./requester.spec");
const Studenthome = require("../src/models/studenthome.model")();

const testUser = {
  firstName: "Henk",
  lastName: "de Wit",
  email: "henk@server.nl",
  studentNumber: 4357383,
  birthday: "2004-08-12",
  password: "secrets",
};

let testStudenthome;
let token;
let userId;

describe("Studenthome CRUD", async () => {
  beforeEach(async () => {
    const result = await requester.post("/api/users/register").send(testUser);
    token = result.body.token
    userId = result.body._id
    testStudenthome = {
      name: "Studenthuis Breda",
      streetName: "Lovensdijkstraat",
      houseNumber: 45,
      postalCode: "3478KL",
      residence: "Breda",
      phoneNumber: "065635348723",
      owner: userId,
    };
  })
  it("Should create a studenthome", async function () {
    const res = await requester.post(`/api/studenthomes`).send(testStudenthome).set("authorization", "Bearer " + token)
    const studenthome = await Studenthome.findOne();
    res.should.have.status(201);
    res.body.should.be.an("object").that.has.keys("id");
    res.body.id.should.be.a("string").that.equals(studenthome._id.toString());
  });

  it("Should give error name is missing", async function () {
    delete testStudenthome.name
    const res = await requester.post(`/api/studenthomes`).send(testStudenthome).set("authorization", "Bearer " + token)
    res.should.have.status(400);
    res.body.should.be.an("object").that.has.keys("message");
    res.body.message.should.be.a("string").that.equals("studenthome validation failed: name: A studenthome needs to have a name.");
  });

  it("Should give error ivalid postal code", async function () {
    testStudenthome.postalCode = 33343
    const res = await requester.post(`/api/studenthomes`).send(testStudenthome).set("authorization", "Bearer " + token)
    res.should.have.status(400);
    res.body.should.be.an("object").that.has.keys("message");
    res.body.message.should.be.a("string").that.equals("studenthome validation failed: postalCode: Invalid postalCode");
  });

  it("Should give error invalid phoneNumber", async function () {
    testStudenthome.phoneNumber = 33343
    const res = await requester.post(`/api/studenthomes`).send(testStudenthome).set("authorization", "Bearer " + token)
    res.should.have.status(400);
    res.body.should.be.an("object").that.has.keys("message");
    res.body.message.should.be.a("string").that.equals("studenthome validation failed: phoneNumber: Invalid phoneNumber");
  });

  it("Should give studenthomes", async function () {
    await requester.post(`/api/studenthomes`).send(testStudenthome).set("authorization", "Bearer " + token)
    const res = await requester.get(`/api/studenthomes`).set("authorization", "Bearer " + token)
    res.should.have.status(200);
    res.body.should.be.an("array").that.has.lengthOf(1);
  });

  it("Should give a single studenthomes", async function () {
    const id = await requester.post(`/api/studenthomes`).send(testStudenthome).set("authorization", "Bearer " + token)
    const res = await requester.get("/api/studenthomes/" +id.body.id).set("authorization", "Bearer " + token)
    const studenthome = await Studenthome.findOne();
    res.should.have.status(200);
    res.body.should.be.an("object").that.has.keys( "_id","houseNumber","name","owner","phoneNumber","postalCode","residence","streetName","__v");
    res.body._id.should.be.a("string").that.equals(studenthome._id.toString());
  });

  it("Shouldn't give a studenthomes", async function () {
    await requester.post(`/api/studenthomes`).send(testStudenthome).set("authorization", "Bearer " + token)
    const res = await requester.get("/api/studenthomes/121").set("authorization", "Bearer " + token)
    res.should.have.status(400);
    res.body.should.be.an("object").that.has.keys( "message");
    res.body.message.should.be.a("string").that.equals("Invalid resource id: 121");
  });

  it("Should update studenthome", async function () {
    const id = await requester.post(`/api/studenthomes`).send(testStudenthome).set("authorization", "Bearer " + token)
    testStudenthome.name = "studentenhuis Prinsebeek"
    const res = await requester.put("/api/studenthomes/" +id.body.id).send(testStudenthome).set("authorization", "Bearer " + token)
    const studenthome = await Studenthome.findOne();
    res.should.have.status(200);
    res.body.should.be.an("object").that.has.keys( "_id","houseNumber","name","owner","phoneNumber","postalCode","residence","streetName","__v");
    studenthome.name.should.be.a("string").that.equals("studentenhuis Prinsebeek");
  });

  it("Shouldn't update a studenthomes", async function () {
    await requester.post(`/api/studenthomes`).send(testStudenthome).set("authorization", "Bearer " + token)
    testStudenthome.name = "studentenhuis Prinsebeek"
    const res = await requester.put("/api/studenthomes/121").send(testStudenthome).set("authorization", "Bearer " + token)
    res.should.have.status(400);
    res.body.should.be.an("object").that.has.keys( "message");
    res.body.message.should.be.a("string").that.equals("Invalid resource id: 121");
  });

  it("Should delete studenthome", async function () {
    const id = await requester.post(`/api/studenthomes`).send(testStudenthome).set("authorization", "Bearer " + token)
    const res = await requester.delete("/api/studenthomes/" +id.body.id).set("authorization", "Bearer " + token)
    res.should.have.status(200);
    res.body.should.be.an("object").that.has.keys( "message");
    res.body.message.should.be.a("string").that.equals("entity with id: "+ id.body.id +" deleted");
  });

  it("Shouldn't delete a studenthomes", async function () {
    testStudenthome.name = "studentenhuis Prinsebeek"
    const res = await requester.delete("/api/studenthomes/121").set("authorization", "Bearer " + token)
    res.should.have.status(400);
    res.body.should.be.an("object").that.has.keys( "message");
    res.body.message.should.be.a("string").that.equals("Invalid resource id: 121");
  });

  it("Studenthome unauthorized", async function () {
    const id = await requester.post(`/api/studenthomes`).send(testStudenthome).set("authorization", "Bearer " + token)
    const res = await requester.delete("/api/studenthomes/" +id.body.id)
    res.should.have.status(401);
    res.body.should.be.an("object").that.has.keys( "datetime", "error");
    res.body.error.should.be.a("string").that.equals("Authorization header missing!");
  });
});
