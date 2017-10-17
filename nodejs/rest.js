function make(app) {

    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    var dbModule = require('./database.js');
    var mongodb = require('mongodb');


    app.post('/addOffer', function (req, res) {
        var dbConnection = dbModule.dbConnection();
        if (dbConnection) {
            var promise = dbConnection.collection('offers').insertOne(req.body);
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

        var dbConnection = dbModule.dbConnection();
        if (dbConnection && mongodb.ObjectID.isValid(req.params.id)) {
            dbConnection.collection('offers').findOne({
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


    app.post('/login', function (req, res) {

        var dbConnection = dbModule.dbConnection();
        if (dbConnection) {
            dbConnection.collection('users').findOne({user: req.body.user}, function (err, user) {
                if (!user) {
                    res.redirect("/#!/login");
                } else {
                    if (req.body.password === user.password) {
                        req.session_state.user = user;
                        res.redirect('/#!/admin/new');
                    } else {
                        res.redirect("/#!/login");
                    }
                }
            });

        }
    });

    app.get('/login', function (req, res) {
        res.redirect("/#!/login");
    });
    var path = require('path');
    app.get('/restricted', function (req, res) {

        if (!req.session_state.user) {
            res.status(302).redirect("/login");//TODO
        } else {
            res.sendFile(path.resolve(__dirname + "/../views/restricted/admin.html"));
        }

        // requireLogin(req, res, function () {
        //     res.sendFile(path.resolve(__dirname + "/../views/restricted/admin.html"));
        // });

    });

    app.get('/logout', function (req, res) {
        req.session_state.reset();
        res.redirect('/');
    });

    app.get('/isLoggedIn', function (req, res) {
        if (!req.session_state.user) {
            res.status(401).send();
        } else {
            res.status(200).send();
        }
    });

    // app.use(function (req, res, next) {
    //     if (req.session_state && req.session_state.user) {
    //         var user = dbConnection.collection('users').findOne({user: req.body.user});
    //         if (user) {
    //             req.user = user;
    //             delete req.user.password; // delete the password from the session
    //             req.session_state.user = user;  //refresh the session value
    //             res.locals.user = user;
    //         }
    //         // finishing processing the middleware and run the route
    //         next();
    //     } else {
    //         next();
    //     }
    // });

    function requireLogin(req, res, next) {
        if (!req.session_state.user) {
            res.redirect('/login');
        } else {
            next();
        }
    }


}


module.exports.make = make;

console.log('REST initialized');
