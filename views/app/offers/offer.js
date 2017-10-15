(function () {

    (function () {
        var app = angular.module("ecu-estate");
        var OfferController = function ($scope, $http) {
            $scope.offer = {
                name: "Hallo",
                address: "bla"
            };
            $scope.sendData = function () {
                var data = '{"hello":"bar"}';
                console.log($scope.offer);
                console.log('In Function ' + data);
                $http.post("addOffer", $scope.offer);
            };
            return {};
        };

        app.controller("OfferController", OfferController);

    })();
})();