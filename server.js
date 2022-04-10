require("dotenv").config();

const connect = require("./connect");

const app = require("./src/app");

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
if (process.env.NODE_ENV === "dev") {
  connect.mongo(process.env.MONGO_PROD_DB);
  connect.neo(process.env.NEO4J_PROD_DB);
} else if (process.env.NODE_ENV === "test") {
  connect.mongo(process.env.MONGO_TEST_DB);
  connect.neo(process.env.NEO4J_TEST_DB);
} else if (process.env.NODE_ENV === "prod") {
  connect.atlas(process.env.ATLAS_CONNECTION);
  connect.neo(process.env.NEO4J_PROD_DB);
}

