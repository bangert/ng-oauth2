'use strict';

angular.module('ng-oauth2.endpoint', []).factory('OauthEndpoint', ['$window', '$location', 'Oauth', function ($window, $location, Oauth) {

    return {
        getOauthUrl: function () {
            return Oauth.oauthServerAddress + '?' +
                'response_type=' + Oauth.responseType + '&' +
                'client_id=' + encodeURIComponent(Oauth.clientId) + '&' +
                'redirect_uri=' + encodeURIComponent($location.absUrl()) + '&' +
                'scope=' + Oauth.scope + '&' +
                'state=' + Oauth.state;
        },

        redirectToOauthPage: function () {
            $window.location.assign(this.getOauthUrl());
        },

        redirectToUnauthorizedPage: function () {
            $window.location.assign(Oauth.unauthorizedUrl);
        },

        redirectToLogoutPage: function () {
            $window.location.assign(Oauth.logoutUrl);
        }
    };

}]);