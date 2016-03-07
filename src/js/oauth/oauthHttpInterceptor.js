'use strict';

angular.module('ng-oauth2').factory('OauthHttpInterceptor', ['$q', 'Oauth', 'OauthToken', function ($q, Oauth, OauthToken) {
    return {
        request: function (config) {

            if (Oauth.sendTokenOnEveryRequest && OauthToken.getToken()) {
                if (Oauth.headerTokenName.toLowerCase == 'authorization') {
                    config.headers[Oauth.headerTokenName] = 'Bearer ' + OauthToken.getToken().access_token;
                } else {
                    config.headers[Oauth.headerTokenName] = OauthToken.getToken().access_token;
                }
            }

            return config;
        }
    };
}]);
