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
let testReview;
let mealId;

describe("Review CRUD", async () => {
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
    const res = await requester.post(`/api/meals`).send(testMeal).set("authorization", "Bearer " + token)
    mealId = res.body.id
    testReview = {
        rating: "5",
        text: "Was lekker!",
        creationDate: "2022-2-6 18:00:00",
        user: user.body._id,
      };
  })
  it("Should create a review", async function () {
    const res = await requester.post("/api/meals/"+mealId+"/reviews").send(testReview).set("authorization", "Bearer " + token)
    res.should.have.status(201);
    res.body.should.be.an("object").that.has.keys("message","id");
    res.body.message.should.be.a("string").that.equals("Review added!");
  });

  it("Should give error name is missing", async function () {
    delete testReview.rating
    const res = await requester.post("/api/meals/"+mealId+"/reviews").send(testReview).set("authorization", "Bearer " + token)
    res.should.have.status(400);
    res.body.should.be.an("object").that.has.keys("message");
    res.body.message.should.be.a("string").that.equals("meal validation failed: reviews.0.rating: A rating is required.");
  });

  it("Should give error ivalid rating", async function () {
    testReview.rating = 6
    const res = await requester.post("/api/meals/"+mealId+"/reviews").send(testReview).set("authorization", "Bearer " + token)
    res.should.have.status(400);
    res.body.should.be.an("object").that.has.keys("message");
    res.body.message.should.be.a("string").that.equals("meal validation failed: reviews.0.rating: A rating can only be 1, 2, 3, 4 or 5 stars.");
  });

  it("Should give reviews", async function () {
    await requester.post("/api/meals/"+mealId+"/reviews").send(testReview).set("authorization", "Bearer " + token)
    const res = await requester.get("/api/meals/"+mealId+"/reviews").set("authorization", "Bearer " + token)
    res.should.have.status(201);
    res.body.should.be.an("array").that.has.lengthOf(1);
  });

  it("Should give a single review", async function () {
    const id = await requester.post("/api/meals/"+mealId+"/reviews").send(testReview).set("authorization", "Bearer " + token)
    const res = await requester.get("/api/meals/"+mealId+"/reviews/" +id.body.id).set("authorization", "Bearer " + token)
    const meal = await Meal.findOne();
    res.should.have.status(201);
    res.body.should.be.an("object").that.has.keys( "_id","creationDate","text", "rating","user");
    res.body._id.should.be.a("string").that.equals(meal.reviews[0]._id.toString());
  });

  it("Shouldn't  give a meal", async function () {
    await requester.post("/api/meals/"+mealId+"/reviews").send(testReview).set("authorization", "Bearer " + token)
    const res = await requester.get("/api/meals/"+mealId+"/reviews/121").set("authorization", "Bearer " + token)
    res.should.have.status(400);
    res.body.should.be.an("object").that.has.keys( "message");
    res.body.message.should.be.a("string").that.equals("Invalid resource id: 121");
  });

  it("Should update review", async function () {
    const id = await requester.post("/api/meals/"+mealId+"/reviews").send(testReview).set("authorization", "Bearer " + token)
    testReview.text = "Niet lekker"
    const res = await requester.put("/api/meals/"+mealId+"/reviews/" +id.body.id).send(testReview).set("authorization", "Bearer " + token)
    const meal = await Meal.findOne();
    res.should.have.status(201);
    res.body.should.be.an("object").that.has.keys( "_id","creationDate","text", "rating","user");
    meal.reviews[0].text.should.be.a("string").that.equals("Niet lekker");
  });

  it("Shouldn't update a meal", async function () {
    await requester.post("/api/meals/"+mealId+"/reviews").send(testReview).set("authorization", "Bearer " + token)
    testReview.text = "Niet lekker"
    await requester.post("/api/meals/"+mealId+"/reviews").send(testReview).set("authorization", "Bearer " + token)
    const res = await requester.get("/api/meals/"+mealId+"/reviews/121").set("authorization", "Bearer " + token)
    res.should.have.status(400);
    res.body.should.be.an("object").that.has.keys( "message");
    res.body.message.should.be.a("string").that.equals("Invalid resource id: 121");
  });

  it("Should delete meal", async function () {
    const id = await requester.post("/api/meals/"+mealId+"/reviews").send(testReview).set("authorization", "Bearer " + token)
    const res = await requester.delete("/api/meals/"+mealId+"/reviews/"+id.body.id).set("authorization", "Bearer " + token)
    res.should.have.status(201);
    res.body.should.be.an("object").that.has.keys( "message");
    res.body.message.should.be.a("string").that.equals("entity with id: "+ id.body.id +" deleted");
  });

  it("Shouldn't delete a meal", async function () {
    const res = await requester.delete("/api/meals/"+mealId+"/reviews/121").set("authorization", "Bearer " + token)
    res.should.have.status(400);
    res.body.should.be.an("object").that.has.keys( "message");
    res.body.message.should.be.a("string").that.equals("Invalid resource id: 121");
  });

  it("Studenthome unauthorized", async function () {
    const id = await requester.post("/api/meals/"+mealId+"/reviews").send(testReview).set("authorization", "Bearer " + token)
    const res = await requester.delete("/api/meals/"+mealId+"/reviews/"+id.body.id)
    res.should.have.status(401);
    res.body.should.be.an("object").that.has.keys( "datetime", "error");
    res.body.error.should.be.a("string").that.equals("Authorization header missing!");
  });


});
