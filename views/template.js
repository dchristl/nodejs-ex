(function () {

    var app = angular.module("ecu-estate");
    var TemplateController = function ($scope, $http) {

        $scope.date = new Date();
        $http.get("offercount").then(function (response) {
            $scope.counter = response.data.offers;
        })
    };
    app.controller("TemplateController", TemplateController);

})();