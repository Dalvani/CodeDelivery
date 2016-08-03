angular.module('starter.controllers')
    .controller('DeliverymanViewOrderCtrl', [
        '$scope', '$stateParams', 'DeliverymanOrder', '$ionicLoading', '$ionicPopup', '$cordovaGeolocation', '$state',
        function ($scope, $stateParams, DeliverymanOrder, $ionicLoading, $ionicPopup, $cordovaGeolocation, $state) {
            var watch, lat = null, long = null;
            $scope.order = [];
            $ionicLoading.show({
                template: 'Carregando...'
            });

            DeliverymanOrder.get({id: $stateParams.id, include: "items,cupom"}, function (data) {
                $scope.order = data.data;
                $ionicLoading.hide();
            }, function(dataError) {
                $ionicLoading.hide();
            });

            $scope.goToDelivery = function() {
                $ionicPopup.alert({
                    title: 'Advertência',
                    template: 'Para parar a localização de OK.'
                }).then(function(){
                    stopWatchPosition();
                });
                DeliverymanOrder.updateStatus({id: $stateParams.id}, {status: 1}, function() {
                    var watchOptions = {
                        timeout: 15000,
                        enableHighAccuracy: false
                    };
                    watch = $cordovaGeolocation.watchPosition(watchOptions);
                    watch.then(null,
                        function (responseError) {
                            console.log(responseError);
                        },
                        function (position) {
                            if(!lat) {
                                lat = position.coords.latitude;
                                long = position.coords.longitude;
                            }else{
                                lat -= 0.4;
                            }

                            DeliverymanOrder.geo({id: $stateParams.id}, {
                                latitude: lat,
                                longitude: long,
                            });
                        }
                    );
                });
            };

            $scope.deliveryCompleted = function(){
                DeliverymanOrder.updateStatus({id: $stateParams.id}, {status: 2}, function() {
                    $ionicPopup.alert({
                        title: 'Advertência',
                        template: 'Pedido entregue com sucesso!'
                    }).then(function(){
                        $state.go('deliveryman.order');
                    });
                }, function(responseError){
                    $ionicPopup.alert({
                        title: 'Advertência',
                        template: 'Não foi possível atualizar o status do pedido como entregue. (' + responseError + ').'
                    });
                });
            };

            function stopWatchPosition() {
                if (watch && typeof watch == 'object' && watch.hasOwnProperty('watchID')) {
                    $cordovaGeolocation.clearWatch(watch.watchID);
                }
            }
        }
    ]);