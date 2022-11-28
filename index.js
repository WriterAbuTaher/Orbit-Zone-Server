const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASS}@cluster0.v7xheu4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {

        const categoriesCollection = client.db('orbitZone').collection('categories');
        const productCollection = client.db('orbitZone').collection('products');
        const usersCollection = client.db('orbitZone').collection('users');
        const bookingsCollection = client.db('orbitZone').collection('bookings');
        const adverstainmentCollection = client.db('orbitZone').collection('adverstainment');

        // get the categories
        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories);
        })

        // get categories with id
        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { category_id: id };
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })

        // get products with id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { category_id: id };
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })

        // post product from client side
        app.post("/products", async (req, res) => {
            const query = req.body;
            const result = await productCollection.insertOne(query);
            res.send(result);
        });

        app.post("/users", async (req, res) => {
            const query = req.body;
            const result = await usersCollection.insertOne(query);
            res.send(result);
        });

        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        app.get('/users/admin/:id', async (req, res) => {
            const email = req.params.id;
            const query = { email };
            const user = await usersCollection.findOne(query)
            res.send({ isAdmin: user?.role === 'admin' });
        });

        app.put('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.post("/bookings", async (req, res) => {
            const query = req.body;
            const result = await bookingsCollection.insertOne(query);
            res.send(result);
        });

        app.get('/bookings/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await bookingsCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/products', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/allproducts', async (req, res) => {
            const query = {};
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })

        app.post("/adverstainment", async (req, res) => {
            const query = req.body;
            const result = await adverstainmentCollection.insertOne(query);
            res.send(result);
        });

        app.get('/adverstainment', async (req, res) => {
            const query = {};
            const users = await adverstainmentCollection.find(query).toArray();
            res.send(users);
        });
    }

    finally {

    }
}

run().catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})