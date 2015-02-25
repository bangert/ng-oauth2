'use strict';

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