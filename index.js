const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5000;
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  serviceId,
} = require("mongodb");
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
  const reviewCollection = client.db("reviewProvider").collection("reviewData");
  try {
    app.get("/threeCard", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const threeData = await cursor.limit(3).toArray();
      res.send(threeData);
    });

    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const GetAllService = await cursor.toArray();
      res.send(GetAllService);
    });

    app.get(`/service/:id`, async (req, res) => {
      const id = req.params.id;
      console.log("This is Id", id);
      const query = { _id: ObjectId(id) };
      const searchService = serviceCollection.find(query);
      const result = await searchService.toArray();
      res.send(result);
    });

    app.get("/review", async (req, res) => {
      const query = {};
      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/reviewEmail", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      console.log(query);
      const findData = reviewCollection.find(query);
      const result = await findData.toArray();
      console.log(result);
      res.send(result);
    });

    app.get(`/reviewServiceId`, async (req, res) => {
      let query = {};
      if (req.query.serviceId) {
        query = {
          serviceId: req.query.serviceId,
        };
      }
      const searchService = reviewCollection.find(query);
      const result = await searchService.toArray();

      res.send(result);
    });

    app.post("/service", async (req, res) => {
      const user = req.body;
      const result = await serviceCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });

    app.post("/review", async (req, res) => {
      const user = req.body;
      const result = await reviewCollection.insertOne(user);
      console.log(result);
      res.send(result);
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
