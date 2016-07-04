angular.module('starter.controllers')
    .controller('ClientCheckoutCtrl', [
        '$scope', '$state', '$cart', 'Order', '$ionicLoading', '$ionicPopup', 'Cupom', '$cordovaBarcodeScanner',
        function ($scope, $state, $cart, Order, $ionicLoading, $ionicPopup, Cupom, $cordovaBarcodeScanner) {
            //console.log("testando ...");

            var cart = $cart.get();
            $scope.cupom = cart.cupom;
            $scope.items = cart.items;
            $scope.total = $cart.getTotalFinal();
            //$scope.showDelete = true;

            $scope.removeItem = function(i) {
                $cart.removeItem(i);
                $scope.items.splice(i, 1);
                $scope.total = $cart.getTotalFinal();
            };

            $scope.openListProduct = function() {
                $state.go('client.view_products');
            };

            $scope.openProductDetail = function(i) {
                $state.go('client.checkout_item_detail', {index: i});
            };

            $scope.save = function() {
                if (validaCupomPedido()) {
                    var o = {items: angular.copy($scope.items)};
                    angular.forEach(o.items, function (item) {
                        item.product_id = item.id;
                    });
                    $ionicLoading.show({
                        template: 'Carregando... '
                    });
                    if ($scope.cupom.value) {
                        o.cupom_code = $scope.cupom.code;
                    }
                    Order.save({id: null}, o, function (data) {
                        $ionicLoading.hide();
                        $state.go('client.checkout_successful');
                    }, function (responseError) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Advertência',
                            template: 'Pedido não realizado - Tente Novamente'
                        })
                    });
                }
            };

            $scope.readBarCode = function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(barcodeData) {
                        getValueCupom(barcodeData.text);
                    }, function(error) {
                        $ionicPopup.alert({
                            title: 'Advertência',
                            template: 'Não foi possível ler o código de barras - Tente novamente'
                        })
                    });
            };

            $scope.removeCupom = function() {
                $cart.removeCupom();
                $scope.cupom = $cart.get().cupom;
                $scope.total = $cart.getTotalFinal();
            };

            //Privates
            function getValueCupom(code) {
                $ionicLoading.show({
                    template: 'Carregando... '
                });

                Cupom.get({code: code}, function(data) {
                    $cart.setCupom(data.data.code, data.data.value);
                    $scope.cupom = $cart.get().cupom;
                    $scope.total = $cart.getTotalFinal();
                    $ionicLoading.hide();
                }, function(responseError) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Advertência',
                        template: 'Cupom inválido'
                    })
                });
            };

            function validaCupomPedido() {
                if($cart.getTotalFinal() < 0){
                    $ionicPopup.alert({
                        title: 'Advertência',
                        template:'Valor do cupom ultrapassa o valor do pedido. Adicione mais itens para utilizar o cupom'
                    });
                    return false;
                }
                return true;
            };
        }]);
