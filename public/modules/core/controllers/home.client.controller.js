'use strict';


angular.module('core').controller('HomeController', ['$scope', '$filter', 'Authentication', '$modal',
    function($scope, $filter, Authentication, $modal) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        $scope.search = {
            'name': ''
        };

        $scope.champions = [{
            'name': 'aatrox',
            'id': '266'
        }, {
            'name': 'ahri',
            'id': '103'
        }, {
            'name': 'akali',
            'id': '84'
        }, {
            'name': 'alistar',
            'id': '12'
        }, {
            'name': 'amumu',
            'id': '32'
        }, {
            'name': 'anivia',
            'id': '34'
        }, {
            'name': 'annie',
            'id': '1'
        }, {
            'name': 'ashe',
            'id': '22'
        }, {
            'name': 'azir',
            'id': '268'
        }, {
            'name': 'blitzcrank',
            'id': '53'
        }, {
            'name': 'brand',
            'id': '63'
        }, {
            'name': 'braum',
            'id': '201'
        }, {
            'name': 'caitlyn',
            'id': '51'
        }, {
            'name': 'cassiopeia',
            'id': '69'
        }, {
            'name': 'chogath',
            'id': '31'
        }, {
            'name': 'corki',
            'id': '42'
        }, {
            'name': 'darius',
            'id': '122'
        }, {
            'name': 'diana',
            'id': '131'
        }, {
            'name': 'draven',
            'id': '119'
        }, {
            'name': 'drmundo',
            'id': '36'
        }, {
            'name': 'elise',
            'id': '60'
        }, {
            'name': 'evelynn',
            'id': '28'
        }, {
            'name': 'ezreal',
            'id': '81'
        }, {
            'name': 'fiddlesticks',
            'id': '9'
        }, {
            'name': 'fiora',
            'id': '114'
        }, {
            'name': 'fizz',
            'id': '105'
        }, {
            'name': 'galio',
            'id': '3'
        }, {
            'name': 'gangplank',
            'id': '41'
        }, {
            'name': 'garen',
            'id': '86'
        }, {
            'name': 'gnar',
            'id': '150'
        }, {
            'name': 'gragas',
            'id': '79'
        }, {
            'name': 'graves',
            'id': '104'
        }, {
            'name': 'hecarim',
            'id': '120'
        }, {
            'name': 'heimerdinger',
            'id': '74'
        }, {
            'name': 'irelia',
            'id': '39'
        }, {
            'name': 'janna',
            'id': '40'
        }, {
            'name': 'jarvan',
            'id': '59'
        }, {
            'name': 'jax',
            'id': '24'
        }, {
            'name': 'jayce',
            'id': '126'
        }, {
            'name': 'jinx',
            'id': '222'
        }, {
            'name': 'kalista',
            'id': '429'
        }, {
            'name': 'karma',
            'id': '43'
        }, {
            'name': 'karthus',
            'id': '30'
        }, {
            'name': 'kassadin',
            'id': '38'
        }, {
            'name': 'katarina',
            'id': '55'
        }, {
            'name': 'kayle',
            'id': '10'
        }, {
            'name': 'kennen',
            'id': '85'
        }, {
            'name': 'khazix',
            'id': '121'
        }, {
            'name': 'kogmav',
            'id': '96'
        }, {
            'name': 'leblanc',
            'id': '7'
        }, {
            'name': 'leesin',
            'id': '64'
        }, {
            'name': 'leona',
            'id': '89'
        }, {
            'name': 'lissandra',
            'id': '127'
        }, {
            'name': 'lucian',
            'id': '236'
        }, {
            'name': 'lulu',
            'id': '117'
        }, {
            'name': 'lux',
            'id': '99'
        }, {
            'name': 'malphite',
            'id': '54'
        }, {
            'name': 'malzahar',
            'id': '90'
        }, {
            'name': 'maokai',
            'id': '57'
        }, {
            'name': 'masteryi',
            'id': '11'
        }, {
            'name': 'missfortune',
            'id': '21'
        }, {
            'name': 'mordekaiser',
            'id': '82'
        }, {
            'name': 'morgana',
            'id': '25'
        }, {
            'name': 'nami',
            'id': '267'
        }, {
            'name': 'nasus',
            'id': '75'
        }, {
            'name': 'nautilus',
            'id': '111'
        }, {
            'name': 'nidalee',
            'id': '76'
        }, {
            'name': 'nocturne',
            'id': '56'
        }, {
            'name': 'nunu',
            'id': '20'
        }, {
            'name': 'olaf',
            'id': '2'
        }, {
            'name': 'orianna',
            'id': '61'
        }, {
            'name': 'pantheon',
            'id': '80'
        }, {
            'name': 'poppy',
            'id': '78'
        }, {
            'name': 'quinn',
            'id': '133'
        }, {
            'name': 'rammus',
            'id': '33'
        }, {
            'name': 'reksai',
            'id': '421'
        }, {
            'name': 'renekton',
            'id': '58'
        }, {
            'name': 'rengar',
            'id': '107'
        }, {
            'name': 'riven',
            'id': '92'
        }, {
            'name': 'rumble',
            'id': '68'
        }, {
            'name': 'ryze',
            'id': '13'
        }, {
            'name': 'sejuani',
            'id': '113'
        }, {
            'name': 'shaco',
            'id': '35'
        }, {
            'name': 'shen',
            'id': '98'
        }, {
            'name': 'shyvana',
            'id': '102'
        }, {
            'name': 'singed',
            'id': '27'
        }, {
            'name': 'sion',
            'id': '14'
        }, {
            'name': 'sivir',
            'id': '15'
        }, {
            'name': 'skarner',
            'id': '72'
        }, {
            'name': 'sona',
            'id': '37'
        }, {
            'name': 'soraka',
            'id': '16'
        }, {
            'name': 'swain',
            'id': '50'
        }, {
            'name': 'syndra',
            'id': '134'
        }, {
            'name': 'talon',
            'id': '91'
        }, {
            'name': 'tarick',
            'id': '44'
        }, {
            'name': 'teemo',
            'id': '17'
        }, {
            'name': 'thresh',
            'id': '412'
        }, {
            'name': 'tristana',
            'id': '18'
        }, {
            'name': 'trundle',
            'id': '48'
        }, {
            'name': 'tryndamere',
            'id': '23'
        }, {
            'name': 'twistedfate',
            'id': '4'
        }, {
            'name': 'twitch',
            'id': '29'
        }, {
            'name': 'udyr',
            'id': '77'
        }, {
            'name': 'urgot',
            'id': '6'
        }, {
            'name': 'varus',
            'id': '110'
        }, {
            'name': 'vayne',
            'id': '67'
        }, {
            'name': 'veigar',
            'id': '45'
        }, {
            'name': 'velkoz',
            'id': '161'
        }, {
            'name': 'vi',
            'id': '254'
        }, {
            'name': 'viktor',
            'id': '112'
        }, {
            'name': 'vladimir',
            'id': '8'
        }, {
            'name': 'volibear',
            'id': '106'
        }, {
            'name': 'warwick',
            'id': '19'
        }, {
            'name': 'wukong',
            'id': '62'
        }, {
            'name': 'xerath',
            'id': '101'
        }, {
            'name': 'xinzhao',
            'id': '5'
        }, {
            'name': 'yasuo',
            'id': '157'
        }, {
            'name': 'yorick',
            'id': '83'
        }, {
            'name': 'zac',
            'id': '154'
        }, {
            'name': 'zed',
            'id': '238'
        }, {
            'name': 'ziggs',
            'id': '115'
        }, {
            'name': 'zilean',
            'id': '26'
        }, {
            'name': 'zyra',
            'id': '143'
        }];
        $scope.purple_ban1 = [{}];
        $scope.purple_ban2 = [{}];
        $scope.purple_ban3 = [{}];
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
            $scope.gameType = $scope.authentication.user.type || '5sr';
            $scope.gameRole = $scope.authentication.user.role || 'Unknown';
            $scope.gameRegion = $scope.authentication.user.region || 'Unknown';
            $scope.gameLeague = $scope.authentication.user.league || 'Unknown';
            $scope.gameSummoner = $scope.authentication.user.summoner || 'Unknown';
        });

        $scope.filterIt = function() {
            var order = $filter('orderBy')($scope.champions, 'name');
            return $filter('filter')(order, $scope.search.name);
        };
    }
]);
