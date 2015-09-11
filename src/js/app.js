'use strict';

var app = angular.module('testApp', ['ng-oauth2']);

app.config(['$locationProvider', 'OauthProvider', function ($locationProvider, OauthProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    OauthProvider.setOauthServerAddress('//cit-login.apps.titan.lab.emc.com/oauth/authorize');
    OauthProvider.setClientId('titan');
    OauthProvider.setProfileUrl('//cit-titan-user-management.apps.titan.lab.emc.com/currentuser');
    OauthProvider.setUnauthorizedUrl('//cit-login.apps.titan.lab.emc.com/unauthorized');
    OauthProvider.setLogoutUrl('//cit-login.apps.titan.lab.emc.com/oauth/logout');

    /*OauthProvider.setOauthServerAddress('http://test.com');
    OauthProvider.setClientId('test');
    OauthProvider.setProfileUrl('http://test.com');
    OauthProvider.setUnauthorizedUrl('http://test.com');
    OauthProvider.setLogoutUrl('http://test.com');*/
}]);

app.controller('TestCtrl', ['$scope', '$http', 'Oauth', function ($scope, $http, Oauth) {

    $scope.simulateUnauthorized = function () {
        $http.get(Oauth.unauthorizedUrl);
    };

    $scope.simulateLogoutEmit = function () {
        $scope.$emit('oauth2:logout');
    };

}]);