'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'mean';
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'ngDragDrop', 'ngDialog', 'toaster', 'duScroll', 'angular-loading-bar', 'infinite-scroll'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
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

'use strict';

angular.module('core').controller('HomeController', ['$scope', '$document', '$http', '$location',
    '$filter', 'Authentication', '$modal', 'toaster',
    function($scope, $document, $http, $location, $filter, Authentication, $modal, toaster)
    {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        $scope.search = {
            'name': ''
        };

        $scope.champions = [
            {
                'name': 'aatrox',
                'id': '266'
        },
            {
                'name': 'ahri',
                'id': '103'
        },
            {
                'name': 'akali',
                'id': '84'
        },
            {
                'name': 'alistar',
                'id': '12'
        },
            {
                'name': 'amumu',
                'id': '32'
        },
            {
                'name': 'anivia',
                'id': '34'
        },
            {
                'name': 'annie',
                'id': '1'
        },
            {
                'name': 'ashe',
                'id': '22'
        },
            {
                'name': 'azir',
                'id': '268'
        },
            {
                'name': 'bard',
                'id': '432'
        },
            {
                'name': 'blitzcrank',
                'id': '53'
        },
            {
                'name': 'brand',
                'id': '63'
        },
            {
                'name': 'braum',
                'id': '201'
        },
            {
                'name': 'caitlyn',
                'id': '51'
        },
            {
                'name': 'cassiopeia',
                'id': '69'
        },
            {
                'name': 'chogath',
                'id': '31'
        },
            {
                'name': 'corki',
                'id': '42'
        },
            {
                'name': 'darius',
                'id': '122'
        },
            {
                'name': 'diana',
                'id': '131'
        },
            {
                'name': 'draven',
                'id': '119'
        },
            {
                'name': 'drmundo',
                'id': '36'
        },
            {
                'name': 'ekko',
                'id': '244'
        },
            {
                'name': 'elise',
                'id': '60'
        },
            {
                'name': 'evelynn',
                'id': '28'
        },
            {
                'name': 'ezreal',
                'id': '81'
        },
            {
                'name': 'fiddlesticks',
                'id': '9'
        },
            {
                'name': 'fiora',
                'id': '114'
        },
            {
                'name': 'fizz',
                'id': '105'
        },
            {
                'name': 'galio',
                'id': '3'
        },
            {
                'name': 'gangplank',
                'id': '41'
        },
            {
                'name': 'garen',
                'id': '86'
        },
            {
                'name': 'gnar',
                'id': '150'
        },
            {
                'name': 'gragas',
                'id': '79'
        },
            {
                'name': 'graves',
                'id': '104'
        },
            {
                'name': 'hecarim',
                'id': '120'
        },
            {
                'name': 'heimerdinger',
                'id': '74'
        },
            {
                'name': 'illaoi',
                'id': '420'
        },
            {
                'name': 'irelia',
                'id': '39'
        },
            {
                'name': 'janna',
                'id': '40'
        },
            {
                'name': 'jarvan',
                'id': '59'
        },
            {
                'name': 'jax',
                'id': '24'
        },
            {
                'name': 'jayce',
                'id': '126'
        },
            {
                'name': 'jinx',
                'id': '222'
        },
            {
                'name': 'kalista',
                'id': '429'
        },
            {
                'name': 'karma',
                'id': '43'
        },
            {
                'name': 'karthus',
                'id': '30'
        },
            {
                'name': 'kassadin',
                'id': '38'
        },
            {
                'name': 'katarina',
                'id': '55'
        },
            {
                'name': 'kayle',
                'id': '10'
        },
            {
                'name': 'kennen',
                'id': '85'
        },
            {
                'name': 'khazix',
                'id': '121'
        },
            {
                'name': 'kindred',
                'id': '203'
        },
            {
                'name': 'kogmaw',
                'id': '96'
        },
            {
                'name': 'leblanc',
                'id': '7'
        },
            {
                'name': 'leesin',
                'id': '64'
        },
            {
                'name': 'leona',
                'id': '89'
        },
            {
                'name': 'lissandra',
                'id': '127'
        },
            {
                'name': 'lucian',
                'id': '236'
        },
            {
                'name': 'lulu',
                'id': '117'
        },
            {
                'name': 'lux',
                'id': '99'
        },
            {
                'name': 'malphite',
                'id': '54'
        },
            {
                'name': 'malzahar',
                'id': '90'
        },
            {
                'name': 'maokai',
                'id': '57'
        },
            {
                'name': 'masteryi',
                'id': '11'
        },
            {
                'name': 'missfortune',
                'id': '21'
        },
            {
                'name': 'mordekaiser',
                'id': '82'
        },
            {
                'name': 'morgana',
                'id': '25'
        },
            {
                'name': 'nami',
                'id': '267'
        },
            {
                'name': 'nasus',
                'id': '75'
        },
            {
                'name': 'nautilus',
                'id': '111'
        },
            {
                'name': 'nidalee',
                'id': '76'
        },
            {
                'name': 'nocturne',
                'id': '56'
        },
            {
                'name': 'nunu',
                'id': '20'
        },
            {
                'name': 'olaf',
                'id': '2'
        },
            {
                'name': 'orianna',
                'id': '61'
        },
            {
                'name': 'pantheon',
                'id': '80'
        },
            {
                'name': 'poppy',
                'id': '78'
        },
            {
                'name': 'quinn',
                'id': '133'
        },
            {
                'name': 'rammus',
                'id': '33'
        },
            {
                'name': 'reksai',
                'id': '421'
        },
            {
                'name': 'renekton',
                'id': '58'
        },
            {
                'name': 'rengar',
                'id': '107'
        },
            {
                'name': 'riven',
                'id': '92'
        },
            {
                'name': 'rumble',
                'id': '68'
        },
            {
                'name': 'ryze',
                'id': '13'
        },
            {
                'name': 'sejuani',
                'id': '113'
        },
            {
                'name': 'shaco',
                'id': '35'
        },
            {
                'name': 'shen',
                'id': '98'
        },
            {
                'name': 'shyvana',
                'id': '102'
        },
            {
                'name': 'singed',
                'id': '27'
        },
            {
                'name': 'sion',
                'id': '14'
        },
            {
                'name': 'sivir',
                'id': '15'
        },
            {
                'name': 'skarner',
                'id': '72'
        },
            {
                'name': 'sona',
                'id': '37'
        },
            {
                'name': 'soraka',
                'id': '16'
        },
            {
                'name': 'swain',
                'id': '50'
        },
            {
                'name': 'syndra',
                'id': '134'
        },
            {
                'name': 'tahm',
                'id': '223'
        },
            {
                'name': 'talon',
                'id': '91'
        },
            {
                'name': 'taric',
                'id': '44'
        },
            {
                'name': 'teemo',
                'id': '17'
        },
            {
                'name': 'thresh',
                'id': '412'
        },
            {
                'name': 'tristana',
                'id': '18'
        },
            {
                'name': 'trundle',
                'id': '48'
        },
            {
                'name': 'tryndamere',
                'id': '23'
        },
            {
                'name': 'twistedfate',
                'id': '4'
        },
            {
                'name': 'twitch',
                'id': '29'
        },
            {
                'name': 'udyr',
                'id': '77'
        },
            {
                'name': 'urgot',
                'id': '6'
        },
            {
                'name': 'varus',
                'id': '110'
        },
            {
                'name': 'vayne',
                'id': '67'
        },
            {
                'name': 'veigar',
                'id': '45'
        },
            {
                'name': 'velkoz',
                'id': '161'
        },
            {
                'name': 'vi',
                'id': '254'
        },
            {
                'name': 'viktor',
                'id': '112'
        },
            {
                'name': 'vladimir',
                'id': '8'
        },
            {
                'name': 'volibear',
                'id': '106'
        },
            {
                'name': 'warwick',
                'id': '19'
        },
            {
                'name': 'wukong',
                'id': '62'
        },
            {
                'name': 'xerath',
                'id': '101'
        },
            {
                'name': 'xinzhao',
                'id': '5'
        },
            {
                'name': 'yasuo',
                'id': '157'
        },
            {
                'name': 'yorick',
                'id': '83'
        },
            {
                'name': 'zac',
                'id': '154'
        },
            {
                'name': 'zed',
                'id': '238'
        },
            {
                'name': 'ziggs',
                'id': '115'
        },
            {
                'name': 'zilean',
                'id': '26'
        },
            {
                'name': 'zyra',
                'id': '143'
        }];
        $scope.purple_ban1 = [{}];
        $scope.purple_ban2 = [{}];
        $scope.purple_ban3 = [{}];
        $scope.purple1 = [{
            'name': 'aaayou',
            'id': '-1'
        }];
        $scope.purple2 = [{}];
        $scope.purple3 = [{}];
        $scope.purple4 = [{}];
        $scope.purple5 = [{}];
        $scope.blue_ban1 = [{}];
        $scope.blue_ban2 = [{}];
        $scope.blue_ban3 = [{}];
        $scope.blue1 = [{}];
        $scope.blue2 = [{}];
        $scope.blue3 = [{}];
        $scope.blue4 = [{}];
        $scope.blue5 = [{}];

        $scope.$watch('authentication.user', function() {
            $scope.gameRole = $scope.authentication.user.role || 'Unknown';
            $scope.gameRegion = $scope.authentication.user.region || 'Unknown';
            $scope.gameSummoner = $scope.authentication.user.summoner || 'Unknown';
        });

        $scope.propositions = [];
        $scope.allPropositions = [];
        $scope.methods = [];

        $scope.getPropositions = function() {
            var blue = _.compact([$scope.blue1[0].id, $scope.blue2[0].id, $scope.blue3[0].id, $scope.blue4[0].id, $scope.blue5[0].id]);
            var purple = _.compact([$scope.purple1[0].id, $scope.purple2[0].id, $scope.purple3[0].id, $scope.purple4[0].id, $scope.purple5[0].id]);
            var team;

            if (blue.indexOf('-1') !== -1) {
                team = true;
                blue.splice(blue.indexOf('-1'), 1);
            }

            if (purple.indexOf('-1') !== -1) {
                team = false;
                purple.splice(purple.indexOf('-1'), 1);
            }

            if (typeof team === 'undefined') {
                toaster.pop({
                    type: 'warning',
                    title: 'Bad data',
                    body: "Move 'You' block to Your queue position and try again!"
                });
            }
            else {
                $scope.settingsDetails = {
                    bans: _.compact([$scope.purple_ban1[0].id, $scope.purple_ban2[0].id, $scope.purple_ban3[0].id,
                                     $scope.blue_ban1[0].id, $scope.blue_ban2[0].id, $scope.blue_ban3[0].id]).map(Number),
                    blue: blue.map(Number),
                    purple: purple.map(Number),
                    teamBlue: team,
                    gameRole: $scope.gameRole,
                    gameRegion: $scope.gameRegion,
                    gameSummoner: $scope.gameSummoner
                };
                $http.post('/predictions/specific', $scope.settingsDetails).success(
                    function(response) {
                        $scope.allPropositions = response.propositions;
                        $scope.methods = response.methods;
                        if (response.propositions.length < 1) {
                            toaster.pop({
                                type: 'warning',
                                title: 'Something went wrong',
                                body: 'We have no propositions prepared for this request.'
                            });
                        }
                        else if (response.propositions.length < 5) {
                            $scope.propositions = response;
                        }
                        else {
                            $scope.propositions = $scope.allPropositions.slice(0, 5);
                            var goTo = angular.element(document.getElementById(
                                'methods'));
                            $document.scrollToElement(goTo, 75, 1500);
                        }
                    }).error(function(response) {
                        toaster.pop({
                            type: 'error',
                            title: 'Error',
                            body: response
                        });
                });
            }
        };

        $scope.loadMorePropositions = function() {
            $scope.propositions = $scope.allPropositions.slice(0, $scope.propositions.length + 5);
        };

        $scope.filterIt = function() {
            var order = $filter('orderBy')($scope.champions, 'name');
            return $filter('filter')(order, $scope.search.name);
        };
}]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
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

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
    function($scope, $http, $location, Users, Authentication) {
        $scope.user = Authentication.user;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');

        // Update a user profile
        $scope.updateUserProfile = function(isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                var user = new Users($scope.user);

                user.$update(function(response) {
                    $scope.success = true;
                    Authentication.user = response;
                }, function(response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };

        // Change user password
        $scope.changeUserPassword = function() {
            $scope.success = $scope.error = null;

            $http.post('/users/password', $scope.passwordDetails).success(function(response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.passwordDetails = null;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);