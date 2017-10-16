(function () {

    var app = angular.module("ecu-estate");
    var TemplateController = function ($scope, $http) {

        $scope.date = new Date();
        $http.get("offercount").then(function (response) {
            $scope.counter = response.data.offers;
        });

        $http.get("isLoggedIn").then(function () {
            $scope.isLoggedIn = true;
        }).catch(function () {
            $scope.isLoggedIn = false;
        })
    };
    app.controller("TemplateController", TemplateController);

})();