'use strict';

angular.module('ng-oauth2').run(['$rootScope', 'OauthToken', 'OauthProfile', 'OauthEndpoint', function ($rootScope, OauthToken, OauthProfile, OauthEndpoint) {

    var token = OauthToken.getTokenFromString();
    OauthToken.removeFragment();

    if (token) {
        OauthToken.setToken(token);
    }

    if (OauthToken.isTokenSet() && !OauthToken.isExpired()) {
        OauthProfile.makeProfileRequest();
    }

    if (OauthToken.isTokenSet() && OauthToken.isExpired()) {
        OauthEndpoint.redirectToOauthPage();
    }

    if (!OauthToken.isTokenSet()) {
        OauthEndpoint.redirectToOauthPage();
    }

    $rootScope.$on('oauth2:logout', function() {
        $rootScope.oauthLogout();
    });
}]);