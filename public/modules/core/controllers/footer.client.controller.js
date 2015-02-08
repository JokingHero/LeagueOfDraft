'use strict';

angular.module('core').controller('FooterController', ['$scope', 'ngDialog',
    function($scope, ngDialog) {

        $scope.contactModal = function() {
            ngDialog.open({
                template: 'modules/core/views/contact.client.view.html',
                className: 'ngdialog-theme-plain',
                controller: 'FooterController'
            });
        };
    }
]);