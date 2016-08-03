angular.module('starter.controllers')
    .controller('ClientOrderCtrl', [
        '$scope', '$state', 'Product', '$ionicLoading', '$ionicActionSheet', 'ClientOrder',
        function ($scope, $state, Product, $ionicLoading, $ionicActionSheet, ClientOrder) {
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
                return ClientOrder.query({
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
                $state.go('client.view_order', {id: order.id});
            };

            $scope.showActionSheet = function (order) {
                $ionicActionSheet.show({
                    buttons: [
                        {text: 'Ver Detalhes'},
                        {text: '<b>Ver Entrega</b>'}
                    ],
                    titleText: 'O que fazer?',
                    cancelText: 'Cancelar',
                    cancel: function () {
                        //cancelamento
                    },
                    buttonClicked: function (index) {
                        switch (index) {
                            case 0:
                                $state.go('client.view_order', {id: order.id});
                                break;
                            case 1:
                                $state.go('client.view_delivery', {id: order.id});
                                break;
                        }
                    }
                });
            };
        }
    ]);