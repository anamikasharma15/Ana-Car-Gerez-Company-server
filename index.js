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
        //     .find({_id: ObjectID(req.params.id)})
        //     .toArray();
        //     res.send(result[0]);
        //     // console.log(result);
        // });


        // GET API for offer Cart 
      app.get('/cart', async(req,res) => {
        let query = {};
        const email = req.query.email;

        if(email){
          query = {email : email};
        }
        const result = await ordersCollection.find(query).toArray();
        res.send(result)
      })
      


      // POST API for offer Cart
      app.post('/cart', async(req, res) =>{
        const cart = req.body
        cart.createdAt = new Date()
        const result = await ordersCollection.insertOne(cart)
        console.log(req.body);
        console.log(result);
        res.json(result)
      })
      

      // DELETE API for deleting orders
      app.delete('/deletedOrder/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: ObjectID(id)}
        const deletedOrder = await ordersCollection.deleteOne(query);
        console.log(deletedOrder);
        res.json(deletedOrder);
      })

        // // confirm order

        // app.post("/confirmOrder", async(req,res)=>{
        //     const result = await ordersCollection.insertOne(req.body);
        //     res.send(result); 
        // });

        // // my orders
        // app.get("myOrder/:email", async (req, res) =>{
        //     console.log(req.params.email);
        //     const result = await ordersCollection
        //     .find({ email: req.params.email})
        //     .toArray();
        //     res.send(result);

        // })

        // // delete order
        // app.delete("/deleteOrder/:id", async (req,res) =>{
        //     const result = await ordersCollection.deleteOne({
        //         _id: ObjectID(req.params.id),
        //     })
        //     console.log(result);
        // })

        // review 
        app.post("/addReview", async(req, res) =>{
        const result = await reviewCollection.insertOne(req.body);
        res.send(result);
  
        });

        // get review
        app.get("/addReview", async (req, res) =>{
            const result = await reviewCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });
        // user
        app.post("/addUserInfo", async (req, res) => {
            console.log("req.body");
            const result = await usersCollection.insertOne(req.body);
            res.send(result);
            console.log(result);
          });

          // make admin
          app.put("/makeAdmin", async (req, res) => {
            const filter = { email: req.body.email };
            const result = await usersCollection.find(filter).toArray();
            if (result) {
              const documents = await usersCollection.updateOne(filter, {
                $set: { role: "admin" },
              });
              console.log(documents);
            }
          });
          
  // check admin or not
    app.get("/checkAdmin/:email", async (req, res) => {
     const result = await usersCollection
      .find({ email: req.params.email })
      .toArray();
      console.log(result);
      res.send(result);
    });

    // all order
    app.get("/allOrders", async (req, res) => {
      // console.log("hello");
      const result = await ordersCollection.find({}).toArray();
      res.send(result);
    });

    // status update order
  app.put("/statusUpdate/:id", async (req, res) => {
    const filter = { _id: ObjectID(req.params.id) };
    console.log(req.params.id);
    const result = await ordersCollection.updateOne(filter, {
      $set: {
        status: req.body.status,
      },
    });
    res.send(result);
    console.log(result);
  });

  // all product
  app.get("/allProducts", async (req, res) => {
    // console.log("hello");
    const result = await productsCollection.find({}).toArray();
    res.send(result);
  });

  // status update products
  // app.put("/statusUpdate/:id", async (req, res) => {
  //   const filter = { _id: ObjectID(req.params.id) };
  //   console.log(req.params.id);
  //   const result = await productsCollection.updateOne(filter, {
  //     $set: {
  //       status: req.body.status,
  //     },
  //   });
  //   res.send(result);
  //   console.log(result);
  // }); 

  // product delete
  app.delete('/deletedProduct/:{id}', async(req,res) => {
    const id = req.params.id;
    const query = {_id: ObjectID(id)}
    const deletedOrder = await productsCollection.deleteOne(query);
    console.log(deletedOrder);
    res.json(deletedOrder);
  })



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


