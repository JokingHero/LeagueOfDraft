'use strict';

angular.module('core').controller('FooterController', ['$scope', '$http', 'ngDialog',
    function($scope, $http, ngDialog) {

    	$scope.email = function() {
            $http.post('/contact', $scope.data).success(function(response) {
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
