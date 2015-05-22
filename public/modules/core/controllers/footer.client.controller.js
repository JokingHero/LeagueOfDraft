'use strict';

angular.module('core').controller('FooterController', ['$scope', '$http', 'ngDialog', 'toaster',
    function($scope, $http, ngDialog, toaster) {

        $scope.email = function() {
            $http.post('/contact', $scope.data).success(function(response) {
                $scope.closeThisDialog();
                toaster.pop({
                    type: 'success',
                    title: 'Message',
                    body: response.message
                });
                $scope.success = response.message;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.contactModal = function() {
            ngDialog.open({
                template: 'modules/core/views/contact.client.view.html',
                className: 'ngdialog-theme-plain',
                controller: 'FooterController'
            });
        };
    }
]);
