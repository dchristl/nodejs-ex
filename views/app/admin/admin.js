(function () {

    (function () {
        var app = angular.module("ecu-estate");
        var AdminController = function ($scope, $http, $routeParams) {
            $scope.sendData = function () {
                console.log($scope.offer);
                $http.post("addOffer", $scope.offer);
            };

            $scope.id = $routeParams.id;

            $http.get("offer/" + $scope.id).then(function (response) {
                console.log(response.data);
                $scope.offer = response.data;
            });

            return {};
        };


        app.controller("AdminController", AdminController);

    })();
})();