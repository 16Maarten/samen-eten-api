require("dotenv").config();
const requester = require("./requester.spec");
const Meal = require("../src/models/meal.model")();

const testUser = {
  firstName: "Henk",
  lastName: "de Wit",
  email: "henk@server.nl",
  studentNumber: 4357383,
  birthday: "2004-08-12",
  password: "secrets",
};

let token;
let userId;
let testMeal;

describe("Meal CRUD", async () => {
  beforeEach(async () => {
    const user = await requester.post("/api/users/register").send(testUser);
    token = user.body.token
    userId = user.body._id
    testMeal = {
        name: "wokkels",
        studenthome: "624d575acc556cfef2aedcd2",
        description: "italian food",
        creationDate: "2021-2-6 18:00:00",
        offerdOn: "2021-2-6 18:00:00",
        price: 2,
        allergies: "tomatoes",
        ingredients: ["pasta", "tomatoes"],
        organizer: user.body._id  
    };
  })
  it("Should create a meal", async function () {
    const res = await requester.post(`/api/meals`).send(testMeal).set("authorization", "Bearer " + token)
    const meal = await Meal.findOne();
    res.should.have.status(201);
    res.body.should.be.an("object").that.has.keys("id");
    res.body.id.should.be.a("string").that.equals(meal._id.toString());
  });

  it("Should give error name is missing", async function () {
    delete testMeal.name
    const res = await requester.post(`/api/meals`).send(testMeal).set("authorization", "Bearer " + token)
    res.should.have.status(400);
    res.body.should.be.an("object").that.has.keys("message");
    res.body.message.should.be.a("string").that.equals("meal validation failed: name: A meal needs to have a name.");
  });

  it("Should give error ivalid price", async function () {
    testMeal.price = -5
    const res = await requester.post(`/api/meals`).send(testMeal).set("authorization", "Bearer " + token)
    res.should.have.status(400);
    res.body.should.be.an("object").that.has.keys("message");
    res.body.message.should.be.a("string").that.equals("meal validation failed: price: A price is minimal 0");
  });

  it("Should give meals", async function () {
    await requester.post(`/api/meals`).send(testMeal).set("authorization", "Bearer " + token)
    const res = await requester.get(`/api/meals`).set("authorization", "Bearer " + token)
    res.should.have.status(200);
    res.body.should.be.an("array").that.has.lengthOf(1);
  });

  it("Should give a single meal", async function () {
    const id = await requester.post(`/api/meals`).send(testMeal).set("authorization", "Bearer " + token)
    const res = await requester.get("/api/meals/" +id.body.id).set("authorization", "Bearer " + token)
    const meal = await Meal.findOne();
    res.should.have.status(200);
    res.body.should.be.an("object").that.has.keys( "_id","allergies","name","organizer","creationDate","offerdOn","reviews","price","participants", "ingredients", "studenthome","__v");
    res.body._id.should.be.a("string").that.equals(meal._id.toString());
  });

  it("Shouldn't  give a meal", async function () {
    await requester.post(`/api/meals`).send(testMeal).set("authorization", "Bearer " + token)
    const res = await requester.get("/api/meals/121").set("authorization", "Bearer " + token)
    res.should.have.status(400);
    res.body.should.be.an("object").that.has.keys( "message");
    res.body.message.should.be.a("string").that.equals("Invalid resource id: 121");
  });

  it("Should update meal", async function () {
    const id = await requester.post(`/api/meals`).send(testMeal).set("authorization", "Bearer " + token)
    testMeal.name = "Friet"
    const res = await requester.put("/api/meals/" +id.body.id).send(testMeal).set("authorization", "Bearer " + token)
    const meal = await Meal.findOne();
    res.should.have.status(200);
    res.body.should.be.an("object").that.has.keys( "_id","allergies","name","organizer","creationDate","offerdOn","reviews","price","participants", "ingredients", "studenthome","__v");
    meal.name.should.be.a("string").that.equals("Friet");
  });

  it("Shouldn't update a meal", async function () {
    await requester.post(`/api/meals`).send(testMeal).set("authorization", "Bearer " + token)
    testMeal.name = "studentenhuis Prinsebeek"
    await requester.post(`/api/meals`).send(testMeal).set("authorization", "Bearer " + token)
    const res = await requester.get("/api/meals/121").set("authorization", "Bearer " + token)
    res.should.have.status(400);
    res.body.should.be.an("object").that.has.keys( "message");
    res.body.message.should.be.a("string").that.equals("Invalid resource id: 121");
  });

  it("Should delete meal", async function () {
    const id = await requester.post(`/api/meals`).send(testMeal).set("authorization", "Bearer " + token)
    const res = await requester.delete("/api/meals/" +id.body.id).set("authorization", "Bearer " + token)
    res.should.have.status(200);
    res.body.should.be.an("object").that.has.keys( "message");
    res.body.message.should.be.a("string").that.equals("entity with id: "+ id.body.id +" deleted");
  });

  it("Shouldn't delete a meal", async function () {
    const res = await requester.delete("/api/meals/121").set("authorization", "Bearer " + token)
    res.should.have.status(400);
    res.body.should.be.an("object").that.has.keys( "message");
    res.body.message.should.be.a("string").that.equals("Invalid resource id: 121");
  });

  it("Studenthome unauthorized", async function () {
    const id = await requester.post(`/api/meals`).send(testMeal).set("authorization", "Bearer " + token)
    const res = await requester.delete("/api/meals/" +id.body.id)
    res.should.have.status(401);
    res.body.should.be.an("object").that.has.keys( "datetime", "error");
    res.body.error.should.be.a("string").that.equals("Authorization header missing!");
  });


});
