'use strict';

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