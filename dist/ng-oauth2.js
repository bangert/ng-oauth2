'use strict';
angular.module('ng-oauth2', [
    'ng-oauth2.token',
    'ng-oauth2.profile',
    'ng-oauth2.endpoint'
]).provider('Oauth', function () {
    var config = {
            oauthServerAddress: '',
            clientId: '',
            profileUrl: '',
            unauthorizedUrl: '',
            logoutUrl: '',
            responseType: 'token',
            scope: '',
            state: '',
            headerTokenName: 'Authorization',
            randomizeState: true,
            redirectOnUnauthorized: true,
            sendTokenOnEveryRequest: true,
            redirectOnLogout: true
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
        setUnauthorizedUrl: function (unauthorizedUrl) {
            config.unauthorizedUrl = unauthorizedUrl;
        },
        setResponseType: function (responseType) {
            config.responseType = responseType;
        },
        setLogoutUrl: function (logoutUrl) {
            config.logoutUrl = logoutUrl;
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
        setRedirectOnLogout: function (redirectOnLogout) {
            config.redirectOnLogout = redirectOnLogout;
        },
        $get: function () {
            return config;
        }
    };
});
angular.module('ng-oauth2').config(['$httpProvider', function ($httpProvider) {

    $httpProvider.interceptors.push('OauthHttpInterceptor');
    $httpProvider.interceptors.push('OauthUnauthorizedHttpInterceptor');

}]);
angular.module('ng-oauth2.endpoint', []).factory('OauthEndpoint', ['$window', '$location', 'Oauth', function ($window, $location, Oauth) {

    return {
        getOauthUrl: function () {
            return Oauth.oauthServerAddress + '?' +
                'response_type=' + Oauth.responseType + '&' +
                'client_id=' + encodeURIComponent(Oauth.clientId) + '&' +
                'redirect_uri=' + encodeURIComponent($location.absUrl()) + '&' +
                'scope=' + Oauth.scope + '&' +
                'state=' + Oauth.state;
        },

        redirectToOauthPage: function () {
            this.redirectToUrl(this.getOauthUrl());
        },

        redirectToUnauthorizedPage: function () {
            this.redirectToUrl(Oauth.unauthorizedUrl);
        },

        redirectToLogoutPage: function () {
            this.redirectToUrl(Oauth.logoutUrl);
        },

        redirectToUrl: function (url) {
            $window.location.assign(url);
        }
    };

}]);
angular.module('ng-oauth2').factory('OauthHttpInterceptor', ['$q', 'Oauth', 'OauthToken', function ($q, Oauth, OauthToken) {
    return {
        request: function (config) {

            if (Oauth.sendTokenOnEveryRequest && OauthToken.getToken()) {
                config.headers[Oauth.headerTokenName] = OauthToken.getToken().access_token;
            }

            return config;
        }
    };
}]);
angular.module('ng-oauth2.profile', []).factory('OauthProfile', ['$rootScope', '$q', '$http', 'Oauth', function ($rootScope, $q, $http, Oauth) {

    $rootScope.oauthProfile = null;

    $rootScope.getOauthProfile = function () {
        return $rootScope.oauthProfile;
    };

    $rootScope.hasOauthProfile = function () {
        return !!$rootScope.oauthProfile;
    };

    return {
        makeProfileRequest: function () {
            var deferred = $q.defer();
            $http.get(Oauth.profileUrl).
                success(function (data) {
                    $rootScope.oauthProfile = data;
                    deferred.resolve(data);
                })
                .error(function () {
                    deferred.reject("error");
                });

            return deferred.promise;
        }
    };

}]);
angular.module('ng-oauth2').run(['OauthToken', 'OauthProfile', 'OauthEndpoint', function (OauthToken, OauthProfile, OauthEndpoint) {

    var token = OauthToken.getTokenFromString();
    OauthToken.removeFragment();

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
angular.module('ng-oauth2.token', ['ngStorage']).factory('OauthToken', ['$rootScope', '$location', '$sessionStorage', '$timeout', 'Oauth', 'OauthEndpoint', function ($rootScope, $location, $sessionStorage, $timeout, Oauth, OauthEndpoint) {

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
        if (Oauth.redirectOnLogout) {
            $timeout(function () {
                OauthEndpoint.redirectToLogoutPage();
            }, 110);
        }
    };

    return {
        setToken: function (token) {
            token.expires_at = this.getExpiresAt(token.expires_in);
            $sessionStorage.oauthToken = token;
        },

        getExpiresAt: function (expiresIn) {
            var time = new Date();
            time.setSeconds(time.getSeconds() + parseInt(expiresIn));
            return time.getTime();
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
            return new Date().getTime() >= this.getToken().expires_at;
        }
    };

}]);
angular.module('ng-oauth2').factory('OauthUnauthorizedHttpInterceptor', ['$rootScope', '$q', 'Oauth', 'OauthEndpoint', function ($rootScope, $q, Oauth, OauthEndpoint) {
    return {
        responseError: function (rejection) {
            if (Oauth.redirectOnUnauthorized && rejection.status === 401) {
                OauthEndpoint.redirectToUnauthorizedPage();
            }

            return $q.reject(rejection);
        }
    };
}]);