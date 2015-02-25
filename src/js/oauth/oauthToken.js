'use strict';

/*jshint -W084 */
angular.module('ng-oauth2.token', ['ngStorage']).factory('OauthToken', ['$rootScope', '$location', '$sessionStorage', '$timeout', 'OauthEndpoint', function ($rootScope, $location, $sessionStorage, $timeout, OauthEndpoint) {

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

        isExpired: function () {
            return (this.getToken() && this.getToken().expires_at && new Date(this.getToken().expires_at) < new Date());
        }
    };

}]);