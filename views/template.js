(function () {

    var app = angular.module("ecu-estate");
    var TemplateController = function ($scope, $http) {

        $scope.date = new Date();
        $http.get("offercount.js").then(function (response) {
            $scope.counter = response.data.counter;
        })
    };
    app.controller("TemplateController", TemplateController);

})();