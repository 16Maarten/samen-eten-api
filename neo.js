const neo4j = require("neo4j-driver");

function connect(dbName) {
  this.dbName = dbName;
  // if (process.env.NODE_ENV === "dev") {
  //   this.driver = neo4j.driver(
  //     process.env.NEO4J_URL,
  //     neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
  //   );
  // } else if (process.env.NODE_ENV === "test") {
  //   this.driver = neo4j.driver(
  //     process.env.NEO4J_URL,
  //     neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
  //   );
  // } else if (process.env.NODE_ENV === "prod") {
  //   this.driver = neo4j.driver(
  //     process.env.NEO4J_CONNECTION,
  //     neo4j.auth.basic(process.env.NEO4J_CONNECTION_USER, process.env.NEO4J_CONNECTION_PASSWORD)
  //   );
  // }
      this.driver = neo4j.driver(
      process.env.NEO4J_URL,
      neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    );
}

function session() {
  return this.driver.session({
    database: this.dbName,
    defaultAccessMode: neo4j.session.WRITE,
  });
}

module.exports = {
  connect,
  session,
  dropAll: "MATCH (n) DETACH DELETE n",
  create: "MERGE (:User {_id:$userId})",
  follow:"MATCH (user1:User{_id: $user1Id}) MATCH (user2:User{_id: $user2Id}) MERGE (user1)-[:FOLLOWS]->(user2)",
  unfollow:"MATCH (user1:User{_id: $user1Id}) MATCH (user2:User{_id: $user2Id}) MATCH (user1)-[rel:FOLLOWS]->(user2) DELETE rel",
  yourFollowers:"MATCH (user1:User{_id: $userId}) MATCH (user2:User)-[:FOLLOWS]->(user1:User) RETURN user2",
  followers:"MATCH (user1:User{_id: $userId}) MATCH (user1:User)-[:FOLLOWS]->(user2:User) RETURN user2",
  delete:"MATCH (user:User{_id: $user}) DETACH DELETE user"
};
