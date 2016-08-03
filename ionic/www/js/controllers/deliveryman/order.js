angular.module('starter.controllers')
    .controller('DeliverymanOrderCtrl', [
        '$scope', '$state', 'Product', '$ionicLoading', 'DeliverymanOrder',
        function ($scope, $state, Product, $ionicLoading, DeliverymanOrder) {
            $scope.orders = [];

            $ionicLoading.show({
                template: 'Carregando...'
            });

            $scope.doRefresh = function () {
                getOrders().then(function (data) {
                    angular.forEach(data.data, function (item) {
                        switch (item.status) {
                            case 0: item.statusName = 'Pendente'; break;
                            case 1: item.statusName = 'A caminho'; break;
                            case 2: item.statusName = 'Entregue'; break;
                            case 3: item.statusName = 'Cancelado'; break;
                        }
                    });
                    $scope.orders = data.data;
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(dataError) {
                    $scope.$broadcast('scroll.refreshComplete');
                })
            };

            function getOrders() {
                return DeliverymanOrder.query({
                    id:null,
                    include:'items',
                    orderBy: 'created_at',
                    sortedBy: 'desc'
                }).$promise;
            };

            getOrders().then(function (data) {
                angular.forEach(data.data, function (item) {
                    switch (item.status) {
                        case 0: item.statusName = 'Pendente'; break;
                        case 1: item.statusName = 'A caminho'; break;
                        case 2: item.statusName = 'Entregue'; break;
                        case 3: item.statusName = 'Cancelado'; break;
                    }
                });
                $scope.orders = data.data;
                $ionicLoading.hide();
            }, function(dataError) {
                $ionicLoading.hide();
                console.log(dataError);
            });

            $scope.openOrderDetail = function(order) {
                $state.go('deliveryman.view_order', {id: order.id});
            };
        }
    ]);