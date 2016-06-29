angular.module('starter.controllers')
    .controller('ClientViewOrderCtrl', [
        '$scope', '$state', 'Product', '$ionicLoading', 'Order',
        function ($scope, $state, Product, $ionicLoading, Order) {

            $scope.orders = [];
            $ionicLoading.show({
                template: 'Carregando...'
            });

            Order.query({id:null, include:'items'}, function (data) {
                angular.forEach(data.data, function (item) {
                    switch (item.status) {
                        case 0: item.statusName = 'Pendente'; break;
                        case 1: item.statusName = 'A caminho'; break;
                        case 2: item.statusName = 'Entregue'; break;
                        case 3: item.statusName = 'Cancelado'; break;
                    }
                });
                $scope.orders = data.data;
                //console.log($scope.orders);
                $ionicLoading.hide();
            }, function(dataError) {
                $ionicLoading.hide();
                console.log(dataError);
            });


        }
    ]);