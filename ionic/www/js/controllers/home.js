angular.module('starter.controllers')
    .controller('HomeCtrl', [
        '$scope', '$state', '$http', 'appConfig',
        function ($scope, $state, $http, appConfig) {
            var url = appConfig.baseUrl + '/api/authenticated';

            $scope.user = {};
            $scope.getUser = function () {
                $http.get(url).then(function (data) {
                    $scope.user = data.data;
                });
            };

            $scope.getUser();
    }]);
