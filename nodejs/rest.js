function make(app) {

    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    var dbModule = require('./database.js');


    app.post('/addOffer', function (req, res) {
        dbModule.insertOffer(req.body, function () {
            res.status(200).send();
        });

    });


    app.get('/offercount', function (req, res) {
        dbModule.getOfferCount(function (offerCount) {
            res.send('{ "offers": ' + offerCount + '}');
        });

    });


    app.get('/offer/:id', function (req, res) {

        if (req.params.id === 'new') {
            res.status(200);
        } else {
            dbModule.getOfferById(req.params.id, function (item) {
                if (item) {
                    res.send(item);
                } else {
                    res.redirect('/#!/admin/new');
                }
            });
        }

    });

// error handling
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Something bad happened!');
    });


    app.post('/login', function (req, res) {

        dbModule.isUserValid(req.body.username, req.body.password, function (userValid) {
            if (!userValid) {
                res.redirect("/#!/login");
            } else {
                req.session_state.user = req.body.username;
                res.redirect('/#!/admin/new');
            }
        });

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
