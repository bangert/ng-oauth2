'use strict';

var app = angular.module('testApp', ['ng-oauth2']);

app.config(['$locationProvider', 'OauthProvider', function ($locationProvider, OauthProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    OauthProvider.setOauthServerAddress('http://cit-login.apps.titan.lab.emc.com/oauth/authorize');
    OauthProvider.setClientId('titan');
    OauthProvider.setProfileUrl('http://citoauth-titan-user-management.apps.titan.lab.emc.com/currentuser');
    OauthProvider.setUnauthorizedUrl('http://cit-login.apps.titan.lab.emc.com/unauthorized');
    OauthProvider.setLogoutUrl('http://cit-login.apps.titan.lab.emc.com/logout');
    //OauthProvider.setSendTokenOnEveryRequest(false);
}]);

app.controller('TestCtrl', ['$scope', '$http', 'Oauth', 'OauthToken', 'OauthProfile', function ($scope, $http, Oauth, OauthToken, OauthProfile) {

    $scope.profile = OauthProfile;

    $scope.logout = function() {
        OauthToken.logout();
    };

    $scope.simulateUnauthorized = function () {
        $http.get(Oauth.unauthorizedUrl);
    };

}]);