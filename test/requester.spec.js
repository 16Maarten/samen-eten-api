const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();
const app = require("../src/app");
const neo = require("../neo");

const User = require("../src/models/user.model")();
const Studenthome = require("../src/models/studenthome.model")();
const Meal = require("../src/models/meal.model")();


let requester = chai.request(app).keepOpen();
module.exports = requester;

// close the app after all tests
after(async function () {
  await Promise.all([User.deleteMany(), Studenthome.deleteMany(), Meal.deleteMany()]);
  console.log("after - COLLECTIONS DROPPED");
  const session = neo.session();
  await session.run(neo.dropAll);
  await session.close();

  console.log("CONNECTION CLOSED");
  requester.close();
});