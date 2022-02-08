const express = require('express');
const { MongoClient} = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.s5rla.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log('connect to tourx database');

    // create database
    const database = client.db("tourxDB");
    // create collection
    const packagesCollection = database.collection("tourPackages");

    // Get api
    app.get('/tourpackages',async(req,res) => {
      const cursor = packagesCollection.find({});
      const tourPackages = await cursor.toArray();
      res.send(tourPackages);
    })

    // Get single api
    app.get('/tourpackages/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const tourPackage = await packagesCollection.findOne(query);
      res.json(tourPackage);
    })

    // POST api
    app.post('/addpackage', async(req,res) =>{
        const addPackage = req.body;
        console.log('Hit the post api',addPackage);
        const result = await packagesCollection.insertOne(addPackage);
        res.json(result);
    })

    // Delete api
    app.delete('/tourpackages/:id',async(req,res) => {
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await packagesCollection.deleteOne(query);
      res.json(result);
    })
    
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World Running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})