const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectID = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wq1g6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run() {
    try{
        await client.connect();
        const database = client.db('ana-car-gerez');
        const productsCollection = database.collection('products');
        const ordersCollection = database.collection("orders");
        const reviewCollection = database.collection("review");
        const usersCollection = database.collection("users");


        // add product
        app.post("/addProducts", async(req, res) =>{
            const result = await productsCollection.insertOne(req.body);
            res.send(result);
            // console.log(req.body);
        });
        // get all products
        app.get("/addProducts", async (req, res) =>{
            const result = await productsCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });
        // get single product
        app.get("/singleProduct/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await productsCollection
              .find({ _id: ObjectID(req.params.id) })
              .toArray();
            res.send(result[0]);
            console.log(result);
          });
        
        // app.get("singleProduct/:id", async(req, res) =>{
        //     const result = await productsCollection
        //     .find({_id: ObjectID( req.params.id)})
        //     .toArray();
        //     res.send(result[0]);
        //     // console.log(result);
        // });

        // confirm order

        app.post("/confirmOrder", async(req,res)=>{
            const result = await ordersCollection.insertOne(req.body);
            res.send(result); 
        });

        // my orders
        app.get("myOrder/:email", async (req, res) =>{
            const result = await ordersCollection
            .find({ email: req.params.email})
            .toArray();
            res.send(result);

        })

        // delete order
        app.delete("/deleteOrder/:id", async (req,res) =>{
            const result = await ordersCollection.deleteOne({
                _id: ObjectID(req.params.id),
            })
            console.log(result);
        })

        // review 
        app.post("/addReview", async(req, res) =>{
        const result = await reviewCollection.insertOne(req.body);
        res.send(result);
  
        });
        // user
        app.post("/addUserInfo", async (req, res) => {
            console.log("req.body");
            const result = await usersCollection.insertOne(req.body);
            res.send(result);
            console.log(result);
          });



        // console.log('database connect successfully'); 
    }
    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello car gerez!')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})