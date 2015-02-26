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
            this.redirectToUrl(this.getOauthUrl());
        },

        redirectToUnauthorizedPage: function () {
            this.redirectToUrl(Oauth.unauthorizedUrl);
        },

        redirectToLogoutPage: function () {
            this.redirectToUrl(Oauth.logoutUrl);
        },

        redirectToUrl: function (url) {
            $window.location.assign(Oauth.logoutUrl);
        }
    };

}]);