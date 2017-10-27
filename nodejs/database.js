mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;
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


var db = null, dbDetails = {};
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
var crypto = require('crypto');


function hashPassword(password, salt, callback) {
    var iterations = 10000;
    crypto.pbkdf2(password, salt, iterations, 512, 'sha512', callback);
}

initDb(function (err) {
    console.log('Error connecting to Mongo. Message:\n' + err);
});

var dbConnection = function () {
    if (!db) {
        initDb(function (err) {
            console.log("Error occured" + err);
        });
    }

    return db;
};


function insertUser(userName, pass) {
    var salt = crypto.randomBytes(128).toString('base64');
    if (db) {
        hashPassword(pass, salt, function (err, derivedKey) {
            db.collection('users').updateOne({user: userName}, {
                user: userName,
                salt: salt,
                hash: derivedKey.toString('hex')
            }, {upsert: true});
        });
    }


}


function isUserValid(userName, pass, callback) {

    if (db) {
        db.collection('users').findOne({user: userName}, function (err, user) {
            if (err || !user) {
                return callback(false);
            }
            hashPassword(pass, user.salt, function (err, derivedKey) {
                return callback(user.hash === derivedKey.toString('hex'));
            });
        });
    }

}

function getOfferCount(callback) {
    if (db) {
        db.collection('offers').count(function (err, count) {
            if (!err) {
                callback(count);
            } else {
                callback(0);

            }
        });
    } else {
        callback(-1);
    }
}

var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

function getOfferById(id, callback) {
    if (db) {
        if (!checkForHexRegExp.test(id)) {
            callback(null);
        }

        db.collection('offers').findOne({
            _id: mongodb.ObjectID(id)
        }, function (err, items) {
            callback(items);
        });
    }

}

function insertOffer(offer, callback) {
    if (db) {
        dbConnection.collection('offers').updateOne({_id: mongodb.ObjectID(offer.id)}, offer, callback, {upsert: true});
    }
}

insertDefaultUser = function (counter) {
    if (counter > 10) {
        console.log('Too many retries giving up');
        return;
    }
    if (!db) {
        setTimeout(function () {
            insertDefaultUser(counter+1);
        }, 1000);//wait 1000 milliseconds then recheck
        console.log('Waiting until database available');
        return;
    }
    if (db) {
        insertUser('admin', process.env.PORTAL_PASS);
    }

};
insertDefaultUser(0);

module.exports.initDb = initDb;
module.exports.isUserValid = isUserValid;
module.exports.getOfferCount = getOfferCount;
module.exports.getOfferById = getOfferById;
module.exports.insertOffer = insertOffer;
