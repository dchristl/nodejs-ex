function make(app) {

    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    var dbModule = require('./database.js');
    var mongodb = require('mongodb');

    app.post('/addOffer', function (req, res) {
        if (!dbModule.dbConnection) {
            dbModule.initDb(function (err) {
            });
        }
        if (dbModule.dbConnection) {
            var promise = dbModule.dbConnection.collection('offers').insertOne(req.body);
        } else {
            res.status(200).send();
        }
        res.status(200).send();
    });


    app.get('/offercount', function (req, res) {
        // try to initialize the db on every request if it's not already
        // initialized.
        var dbConnection = dbModule.dbConnection();
        if (dbConnection) {
            dbConnection.collection('offers').count(function (err, count) {
                res.send('{ "offers": ' + count + '}');
            });
        } else {
            res.send('{ "offers": -1 }');
        }
    });


    app.get('/offer/:id', function (req, res) {

        if (!dbModule.dbConnection) {
            dbModule.initDb(function (err) {
            });
        }
        if (dbModule.dbConnection && mongodb.ObjectID.isValid(req.params.id)) {
            db.collection('offers').findOne({
                _id: mongodb.ObjectID(req.params.id, function () {

                })
            }, function (err, items) {
                res.send(items);
            });
        } else {
            res.status(200);
        }
    });

// error handling
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Something bad happened!');
    });
}

module.exports.make = make;

console.log('REST initialized');
