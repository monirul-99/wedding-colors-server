const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wa0jwjm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  const serviceCollection = client
    .db("serviceProvider")
    .collection("serviceData");
  try {
    app.get("/threeCard", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const threeData = await cursor.limit(3).toArray();
      res.send(threeData);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("Data Get Running");
});

app.listen(port, () => {
  console.log(`Server CMD Running ${port}`);
});
