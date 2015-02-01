'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'ngDialog',
    function($scope, $http, $location, Authentication, ngDialog) {
        $scope.authentication = Authentication;

        // If user is signed in then redirect back home
        if ($scope.authentication.user) $location.path('/');

        $scope.signup = function() {
            $http.post('/auth/signup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;
                $scope.closeThisDialog();
                // And redirect to the index page
                $location.path('/settings/profile');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.signin = function() {
            $http.post('/auth/signin', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;
                $scope.closeThisDialog();
                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };


        $scope.forgotPassword = function() {
            if (typeof $scope.closeThisDialog === 'function') {
                $scope.closeThisDialog();
            }
            ngDialog.open({
                template: 'modules/users/views/password/forgot-password.client.view.html',
                className: 'ngdialog-theme-plain',
                controller: 'PasswordController'
            });
        };
    }
]);
