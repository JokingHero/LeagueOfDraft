'use strict';

module.exports = {
    app: {
        title: 'Pick best possible champion in League Of Legends draft!',
        description: 'Win League Of Legends games in champion select! Or at least increase Your chances. We will tell You what champion to pick, considering current meta, your performance and counters.',
        keywords: 'league of legends, lol, champion select, what champion to pick, counterpick, champion draft'
    },
    port: process.env.PORT || 3000,
    templateEngine: 'swig',
    // The secret should be set to a non-guessable string that
    // is used to compute a session hash
    sessionSecret: 'leaguesupersecretdraft',
    // The name of the MongoDB collection to store sessions in
    sessionCollection: 'sessions',
    // The session cookie settings
    sessionCookie: {
        path: '/',
        httpOnly: true,
        // If secure is set to true then it will cause the cookie to be set
        // only when SSL-enabled (HTTPS) is used, and otherwise it won't
        // set a cookie. 'true' is recommended yet it requires the above
        // mentioned pre-requisite.
        secure: false,
        // Only set the maxAge to null if the cookie shouldn't be expired
        // at all. The cookie will expunge when the browser is closed.
        maxAge: null,
        // To set the cookie in a specific domain uncomment the following 
        // setting:
        // domain: 'yourdomain.com'
    },
    // The session cookie name
    sessionName: 'connect.sid',
    leagueKey: '0b7bff22-1905-4d35-b28e-f766375e95f3',
    leagueRequestLimit: 1500, //divide always by two coz we must fetch also id - RIOT limitation is 3000 requests every 10 sec
    mandrill: process.env.MANDRILL_APIKEY || 'dvifSXcwpPWLiwxWf5kULQ',
    log: {
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: 'combined',
        // Stream defaults to process.stdout
        // Uncomment to enable logging to a log on the file system
        options: {
            stream: 'access.log'
        }
    },
    assets: {
        lib: {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.css',
                'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/fontawesome/css/font-awesome.min.css',
                'public/lib/slider-pro/dist/css/slider-pro.min.css',
                'public/lib/ngDialog/css/ngDialog.css',
                'public/lib/ngDialog/css/ngDialog-theme-plain.min.css',
                'public/lib/angularjs-toaster/toaster.min.css',
                'public/lib/angular-loading-bar/build/loading-bar.min.css'
            ],
            js: [
                'public/lib/jquery/dist/jquery.min.js',
                'public/lib/jquery-ui/jquery-ui.min.js',
                'public/lib/angular/angular.js',
                'public/lib/angular-resource/angular-resource.js',
                'public/lib/angular-animate/angular-animate.min.js',
                'public/lib/angular-ui-router/release/angular-ui-router.js',
                'public/lib/angular-ui-utils/ui-utils.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/angular-dragdrop/src/angular-dragdrop.min.js',
                'public/lib/slider-pro/dist/js/jquery.sliderPro.min.js',
                'public/lib/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js',
                'public/lib/ngDialog/js/ngDialog.min.js',
                'public/lib/bootstrap/js/tooltip.js',
                'public/lib/lodash/lodash.min.js',
                'public/lib/angularjs-toaster/toaster.min.js',
                'public/lib/angular-scroll/angular-scroll.min.js',
                'public/lib/angular-loading-bar/build/loading-bar.min.js',
                'public/lib/ngInfiniteScroll/build/ng-infinite-scroll.min.js'
            ]
        },
        css: [
            'public/modules/**/css/*.css'
        ],
        js: [
            'public/config.js',
            'public/application.js',
            'public/modules/*/*.js',
            'public/modules/*/*[!tests]*/*.js'
        ],
        tests: [
            'public/lib/angular-mocks/angular-mocks.js',
            'public/modules/*/tests/*.js'
        ]
    }
};
