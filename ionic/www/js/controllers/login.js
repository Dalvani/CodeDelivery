angular.module('starter.controllers')
    .controller('LoginCtrl', [
        '$scope', 'OAuth', 'OAuthToken', '$ionicPopup', '$state', 'UserData', 'User', '$localStorage',
        function ($scope, OAuth, OAuthToken, $ionicPopup, $state, UserData, User, $localStorage) {
            //console.log("testando ...");

            $scope.user = {
                username: '',
                password: ''
            };

            $scope.login = function() {
                var promise = OAuth.getAccessToken($scope.user);
                promise
                    .then(function (data) {
                        var token = $localStorage.get('device_token');
                        return User.updateDeviceToken({},{device_token: token}).$promise;
                    })
                    .then(function (data) {
                        return User.authenticated({include: 'client'}).$promise;
                    })
                    .then(function(data) {
                        UserData.set(data.data);

                        if(UserData.get().role == 'client')
                            $state.go('client.checkout');
                        else if(UserData.get().role == 'deliveryman')
                            $state.go('deliveryman.order');
                    }, function(responseError) {
                        UserData.set(null);
                        OAuthToken.removeToken();
                        $ionicPopup.alert({
                            title: 'Advertência',
                            template: 'Login e/ou senha inválidos'
                        })
                        //console.debug(responseError);
                    });
            };
    }]);