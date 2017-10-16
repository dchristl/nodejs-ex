(function () {
    var app = angular.module("ecu-estate", ['ngRoute']);
    app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $routeProvider.when("/main",
            {
                templateUrl: "app/main/landing.html",
                controller: "MainController"
            })
            .when("/offer",
                {
                    templateUrl: "app/offers/offer.html",
                    controller: "OfferController"
                })
            .when("/admin/:id",
                {
                    templateUrl: "restricted",
                    controller: "AdminController"
                })
            .when("/login",
                {
                    templateUrl: "app/login/login.html"
                })

            .otherwise({redirectTo: '/main'});
    }]);
})();


