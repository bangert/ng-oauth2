'use strict';

angular.module('ng-oauth2').config(['$httpProvider', function ($httpProvider) {

    $httpProvider.interceptors.push('OauthHttpInterceptor');
    $httpProvider.interceptors.push('OauthUnauthorizedHttpInterceptor');

}]);