'use strict';
angular.module('ng-oauth2').config(['$httpProvider', function ($httpProvider) {

    $httpProvider.interceptors.push('oauthHttpInterceptor');
    $httpProvider.interceptors.push('oauthUnauthorizedHttpInterceptor');

}]);
angular.module('ng-oauth2.endpoint', []).factory('OauthEndpoint', ['$window', '$location', 'Oauth', function ($window, $location, Oauth) {

    return {
        getOauthUrl: function () {
            var url,
                authPathHasQuery = (Oauth.authorizePath.indexOf('?') == -1) ? false : true,
                appendChar = (authPathHasQuery) ? '&' : '?';    //if authorizePath has ? already append OAuth2 params

            url = Oauth.oauthServerAddress + Oauth.authorizePath +
            appendChar + 'response_type=' + Oauth.responseType + '&' +
            'client_id=' + encodeURIComponent(Oauth.clientId) + '&' +
            'redirect_uri=' + encodeURIComponent($location.absUrl()) + '&' +
            'scope=' + Oauth.scope + '&' +
            'state=' + Oauth.state;

            return url;
        },

        redirectToOauthPage: function () {
            $window.location.assign(this.getOauthUrl());
        },

        redirectToUnauthorizedPage: function () {
            $window.location.assign(Oauth.unauthorizedUrl);
        }
    };

}]);
angular.module('ng-oauth2').factory('oauthHttpInterceptor', ['$q', 'Oauth', 'OauthToken', function ($q, Oauth, OauthToken) {
    return {
        request: function (config) {

            if (Oauth.sendTokenOnEveryRequest && OauthToken.getToken()) {
                config.headers[Oauth.headerTokenName] = OauthToken.getToken().access_token;
            }

            return config;
        }
    };
}]);
angular.module('ng-oauth2.profile', []).factory('OauthProfile', ['$http', 'Oauth', function ($http, Oauth) {

    var profile = null;

    return {
        makeProfileRequest: function () {
            $http.get(Oauth.profileUrl).
                success(function (data) {
                    profile = data;
                });
        },

        getProfile: function () {
            return profile;
        },

        hasProfile: function () {
            return !!profile;
        }
    };

}]);
angular.module('ng-oauth2', [
    'ng-oauth2.token',
    'ng-oauth2.profile',
    'ng-oauth2.endpoint'
]).provider('Oauth', function () {
    var config = {
            oauthServerAddress: '',
            clientId: '',
            profileUrl: '',
            authorizePath: '/oauth/authorize',
            unauthorizedUrl: '',
            responseType: 'token',
            scope: '',
            state: '',
            headerTokenName: 'Authorization',
            randomizeState: true,
            redirectOnUnauthorized: true,
            sendTokenOnEveryRequest: true
        };
    return {
        setOauthServerAddress: function (oauthServerAddress) {
            config.oauthServerAddress = oauthServerAddress;
        },
        setClientId: function (clientId) {
            config.clientId = clientId;
        },
        setProfileUrl: function (profileUrl) {
            config.profileUrl = profileUrl;
        },
        setAuthorizePath: function (authorizePath) {
            config.authorizePath = authorizePath;
        },
        setUnauthorizedUrl: function (unauthorizedUrl) {
            config.unauthorizedUrl = unauthorizedUrl;
        },
        setResponseType: function (responseType) {
            config.responseType = responseType;
        },
        setScope: function (scope) {
            config.scope = scope;
        },
        setState: function (state) {
            config.state = state;
        },
        setHeaderTokenName: function (headerTokenName) {
            config.headerTokenName = headerTokenName;
        },
        setRandomizeState: function (randomizeState) {
            config.randomizeState = randomizeState;
        },
        setRedirectOnUnauthorized: function (redirectOnUnauthorized) {
            config.redirectOnUnauthorized = redirectOnUnauthorized;
        },
        setSendTokenOnEveryRequest: function (sendTokenOnEveryRequest) {
            config.sendTokenOnEveryRequest = sendTokenOnEveryRequest;
        },
        $get: function () {
            return config;
        }
    };
});
angular.module('ng-oauth2').run(['OauthToken', 'OauthProfile', 'OauthEndpoint', function (OauthToken, OauthProfile, OauthEndpoint) {

    var token = OauthToken.getTokenFromString();

    if (token) {
        OauthToken.setToken(token);
    }

    if (OauthToken.isTokenSet() && !OauthToken.isExpired()) {
        OauthProfile.makeProfileRequest();
    }

    if (!OauthToken.isTokenSet()) {
        OauthEndpoint.redirectToOauthPage();
    }

}]);
/*jshint -W084 */
angular.module('ng-oauth2.token', ['ngStorage']).factory('OauthToken', ['$rootScope', '$location', '$sessionStorage', function ($rootScope, $location, $sessionStorage) {

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
        },

        destroy: function () {
            $sessionStorage.oauthToken = null;
            $rootScope.$broadcast('oauth:logout');
        }
    };

}]);
angular.module('ng-oauth2').factory('oauthUnauthorizedHttpInterceptor', ['$rootScope', '$q', 'Oauth', 'OauthEndpoint', function ($rootScope, $q, Oauth, OauthEndpoint) {
    return {
        responseError: function (rejection) {
            if (Oauth.redirectOnUnauthorized && rejection.status === 401) {
                OauthEndpoint.redirectToUnauthorizedPage();
            }

            return $q.reject(rejection);
        }
    };
}]);