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

function verifyJWT(req, res, next) {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) {
    res.status(401).send({ message: "Unauthorized Access" });
  }
  const token = authHeaders.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (error, decoded) {
    if (error) {
      res.status(403).send({ message: "Forbidden Access" });
    }
    req.decoded = decoded;
    next();
  });
}

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

    app.get("/reviewEmail", verifyJWT, async (req, res) => {
      const decoded = req.decoded;
      if (decoded.email !== req.query.email) {
        res.status(403).send({ message: "Forbidden Access" });
      }
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
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

    app.get(`/review/:id`, async (req, res) => {
      const id = req.params.id;
      console.log("This is Id", id);
      const query = { _id: ObjectId(id) };
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

    app.put("/review/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updatedUser = req.body;
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          describe: updatedUser.describe,
        },
      };
      const result = await reviewCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });

    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    });

    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
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
