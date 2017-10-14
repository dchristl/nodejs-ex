(function () {
    var app = angular.module("ecu-estate", ['ngRoute']);
    app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $routeProvider.when("/main",
            {
                templateUrl: "views/app/main/landing.html",
                controller: "MainController"
            })
            .when("/offer",
            {
                templateUrl: "views/app/offers/offer.html",
                controller: "OfferController"
            })

            .otherwise({redirectTo: '/main'});
    }]);
})();


