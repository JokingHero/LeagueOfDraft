'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'ngDialog',
    function($scope, Authentication, Menus, ngDialog) {
        $scope.authentication = Authentication;
        $scope.isCollapsed = false;
        $scope.menu = Menus.getMenu('topbar');

        $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function() {
            $scope.isCollapsed = false;
        });

        $scope.signInModal = function() {
            ngDialog.open({
                template: 'modules/users/views/authentication/signin.client.view.html',
                className: 'ngdialog-theme-plain',
                controller: 'AuthenticationController'
            });
        };

        $scope.signUpModal = function() {
            ngDialog.open({
                template: 'modules/users/views/authentication/signup.client.view.html',
                className: 'ngdialog-theme-plain',
                controller: 'AuthenticationController'
            });
        };
    }
]);
