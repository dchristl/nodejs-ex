//  OpenShift sample Node application
var express = require('express'),
    app = express(),
    morgan = require('morgan');

Object.assign = require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
        mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
        mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
        mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
        mongoPassword = process.env[mongoServiceName + '_PASSWORD']
    mongoUser = process.env[mongoServiceName + '_USER'];

    if (mongoHost && mongoPort && mongoDatabase) {
        mongoURLLabel = mongoURL = 'mongodb://';
        if (mongoUser && mongoPassword) {
            mongoURL += mongoUser + ':' + mongoPassword + '@';
        }
        // Provide UI label that excludes user id and pw
        mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
        mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;

    }
}
var db = null,
    dbDetails = new Object();
var mongodb = require('mongodb');

var initDb = function (callback) {
    if (mongoURL == null) return;


    if (mongodb == null) return;

    mongodb.connect(mongoURL, function (err, conn) {
        if (err) {
            callback(err);
            return;
        }

        db = conn;
        dbDetails.databaseName = db.databaseName;
        dbDetails.url = mongoURLLabel;
        dbDetails.type = 'MongoDB';

        console.log('Connected to MongoDB at: %s', mongoURL);
    });
};
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/addOffer', function (req, res) {
    if (!db) {
        initDb(function (err) {
        });
    }
    if (db) {
        var promise = db.collection('offers').insert(req.body);
    } else {
        res.send('{ "offers": -1 }');
    }
    res.status(200).send();
});


app.get('/offercount', function (req, res) {
    // try to initialize the db on every request if it's not already
    // initialized.
    if (!db) {
        initDb(function (err) {
        });
    }
    if (db) {
        db.collection('offers').count(function (err, count) {
            res.send('{ "offers": ' + count + '}');
        });
    } else {
        res.send('{ "offers": -1 }');
    }
});

app.get('/offer/:id', function (req, res) {

    if (!db) {
        initDb(function (err) {
        });
    }
    if (db && mongodb.ObjectID.isValid(req.params.id)) {
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

initDb(function (err) {
    console.log('Error connecting to Mongo. Message:\n' + err);
});

var serveStatic = require('serve-static');
app.use(serveStatic(__dirname + '/views')).listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;
