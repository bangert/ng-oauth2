'use strict';

var app = angular.module('testApp', ['ng-oauth2']);

app.config(['$locationProvider', 'OauthProvider', function ($locationProvider, OauthProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    OauthProvider.setOauthServerAddress('http://test.com');
    OauthProvider.setClientId('test');
    OauthProvider.setProfileUrl('http://test.com');
    OauthProvider.setUnauthorizedUrl('http://test.com');
    OauthProvider.setLogoutUrl('http://test.com');
}]);

app.controller('TestCtrl', ['$scope', '$http', 'Oauth', function ($scope, $http, Oauth) {

    $scope.simulateUnauthorized = function () {
        $http.get(Oauth.unauthorizedUrl);
    };

    $scope.simulateLogoutEmit = function () {
        $scope.$emit('oauth2:logout');
    };

}]);