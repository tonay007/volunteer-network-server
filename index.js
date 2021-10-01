var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: __dirname + `\\.env` });
const ObjectId = require('mongodb').ObjectID

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.gsvjd.mongodb.net/volunteer-network?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

var port = 4000;

app.get('/', function (req, res) {
    res.send("Server is Running")
})

client.connect(err => {
    var regList = client.db("volunteer-network").collection("event-registrations");

    app.get("/events", function (req, res) {
        var queryEmail = req.query.email;
        regList.find({ email: queryEmail })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post("/addEvent", function (req, res) {
        var data = req.body;
        regList.insertOne(data)
            .then(function (result) {
                res.send(result);
            });
    });

    app.delete('/cancel/:id', (req, res) => {
        regList.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0)
            })
    })
});

app.listen(process.env.PORT || port);
