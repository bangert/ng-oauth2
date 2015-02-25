'use strict';

/*jshint -W084 */
angular.module('ng-oauth2.token', ['ngStorage']).factory('OauthToken', ['$rootScope', '$location', '$sessionStorage', '$timeout', 'OauthEndpoint', function ($rootScope, $location, $sessionStorage, $timeout, OauthEndpoint) {

    var oAuth2HashTokens = [
        'access_token',
        'token_type',
        'expires_in',
        'scope',
        'state',
        'error',
        'error_description'
    ];

    $rootScope.oauthLogout = function () {
        delete $sessionStorage.oauthToken;
        $timeout(function () {
            OauthEndpoint.redirectToLogoutPage();
        }, 110);
    };

    return {
        setToken: function (token) {
            $sessionStorage.oauthToken = token;
        },

        getToken: function () {
            return $sessionStorage.oauthToken;
        },

        isTokenSet: function () {
            return this.getToken() ? true : false;
        },

        getTokenFromString: function () {
            var params = {},
                regex = /([^&=]+)=([^&]*)/g,
                m;

            while (m = regex.exec($location.hash())) {
                params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            }

            if (params.access_token || params.error) {
                return params;
            }
        },

        removeFragment: function () {
            var curHash = $location.hash();
            angular.forEach(oAuth2HashTokens, function (hashKey) {
                var re = new RegExp('&' + hashKey + '(=[^&]*)?|^' + hashKey + '(=[^&]*)?&?');
                curHash = curHash.replace(re, '');
            });

            $location.hash(curHash);
        },

        isExpired: function () {
            return (this.getToken() && this.getToken().expires_at && new Date(this.getToken().expires_at) < new Date());
        }
    };

}]);