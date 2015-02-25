'use strict';

angular.module('ng-oauth2').run(['OauthToken', 'OauthProfile', 'OauthEndpoint', function (OauthToken, OauthProfile, OauthEndpoint) {

    var token = OauthToken.getTokenFromString();

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