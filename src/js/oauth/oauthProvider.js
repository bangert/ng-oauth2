'use strict';

angular.module('ng-oauth2', [
    'ng-oauth2.token',
    'ng-oauth2.profile',
    'ng-oauth2.endpoint'
]).provider('Oauth', function () {
    var config = {
        oauthServerAddress: '',
        clientId: '',
        profileUrl: '',
        unauthorizedUrl: '',
        logoutUrl: '',
        responseType: 'token',
        scope: '',
        state: '',
        headerTokenName: 'Authorization',

        randomizeState: true,
        redirectOnUnauthorized: true,
        sendTokenOnEveryRequest: true,
        redirectOnLogout: true
    };

    return {

        setOauthServerAddress: function (oauthServerAddress) {
            config.oauthServerAddress = oauthServerAddress;
        },

        setClientId: function (clientId) {
            config.clientId = clientId;
        },

        setProfileUrl: function (profileUrl) {
            config.profileUrl = profileUrl;
        },

        setAuthorizePath: function (authorizePath) {
            config.authorizePath = authorizePath;
        },

        setUnauthorizedUrl: function (unauthorizedUrl) {
            config.unauthorizedUrl = unauthorizedUrl;
        },

        setResponseType: function (responseType) {
            config.responseType = responseType;
        },

        setLogoutUrl: function (logoutUrl) {
            config.logoutUrl = logoutUrl;
        },

        setScope: function (scope) {
            config.scope = scope;
        },

        setState: function (state) {
            config.state = state;
        },

        setHeaderTokenName: function (headerTokenName) {
            config.headerTokenName = headerTokenName;
        },

        setRandomizeState: function (randomizeState) {
            config.randomizeState = randomizeState;
        },

        setRedirectOnUnauthorized: function (redirectOnUnauthorized) {
            config.redirectOnUnauthorized = redirectOnUnauthorized;
        },

        setSendTokenOnEveryRequest: function (sendTokenOnEveryRequest) {
            config.sendTokenOnEveryRequest = sendTokenOnEveryRequest;
        },

        setRedirectOnLogout: function (redirectOnLogout) {
            config.redirectOnLogout = redirectOnLogout;
        },

        $get: function () {
            return config;
        }
    };
});