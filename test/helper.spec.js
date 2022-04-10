require("dotenv").config();
const connect = require("../connect");
const neo = require("../neo");

const User = require("../src/models/user.model")();
const Meal = require("../src/models/meal.model")();
const Studenthome = require("../src/models/studenthome.model")();

connect.mongo(process.env.MONGO_TEST_DB);
connect.neo(process.env.NEO4J_TEST_DB);

beforeEach(async () => {
  await Promise.all([
    User.deleteMany(),
    Studenthome.deleteMany(),
    Meal.deleteMany(),
  ]);
  console.log("after - COLLECTIONS DROPPED");
  const session = neo.session();
  await session.run(neo.dropAll);
  await session.close();
});
