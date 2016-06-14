angular.module('starter.controllers', [])
    .controller('LoginCtrl', [
        '$scope', 'OAuth', '$ionicPopup', '$state',
        function ($scope, OAuth, $ionicPopup, $state) {
        //console.log("testando ...");

        $scope.user = {
            username: '',
            password: ''
        }

        $scope.login = function() {
            OAuth.getAccessToken($scope.user)
                .then(function (data) {
                    //console.log(OAuth);
                    $state.go('home');
                }, function (responseError) {
                    $ionicPopup.alert({
                        title: 'Advertência',
                        template: 'Login e/ou senha inválidos'
                    })
                    //console.debug(responseError);
                });
        }
    }]);