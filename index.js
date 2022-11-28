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

        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories);
        })

        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { category_id: id };
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { category_id: id };
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })

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