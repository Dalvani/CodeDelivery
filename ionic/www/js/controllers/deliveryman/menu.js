angular.module('starter.controllers')
    .controller('DeliverymanMenuCtrl', [
        '$scope', '$state', 'UserData',
        function ($scope, $state, UserData) {
            $scope.user = UserData.get();
        }
    ]);