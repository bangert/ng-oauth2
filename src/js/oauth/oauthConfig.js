'use strict';

angular.module('ng-oauth2').config(['$httpProvider', function ($httpProvider) {

    $httpProvider.interceptors.push('oauthHttpInterceptor');
    $httpProvider.interceptors.push('oauthUnauthorizedHttpInterceptor');

}]);