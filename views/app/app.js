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
                templateUrl: "app/admin/admin.html",
                controller: "AdminController"
            })

            .otherwise({redirectTo: '/main'});
    }]);
})();


