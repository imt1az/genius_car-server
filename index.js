const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// MiddleWare
app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5zbdq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-shard-00-00.5zbdq.mongodb.net:27017,cluster0-shard-00-01.5zbdq.mongodb.net:27017,cluster0-shard-00-02.5zbdq.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-6b1q0k-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("geniusCar").collection('service');
    
    app.get('/services',async(req,res)=>{
        const query = {};
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
    })

    // Add Service
    app.post('/service',async(req,res)=>{
      const newService = req.body;
      const result= await serviceCollection.insertOne(newService);
      res.send(result);

    })
    // Delete
    app.delete('/service/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)}
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/service/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const service = await serviceCollection.findOne(query);
        res.send(service);
    })

  } 
  finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Genius Server");
});

app.listen(port, () => console.log("Listening from", port));
