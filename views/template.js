(function () {

    var app = angular.module("ecu-estate");
    var TemplateController = function ($scope) {
        $scope.counter = 5
    };
    app.controller("TemplateController", TemplateController);

})();