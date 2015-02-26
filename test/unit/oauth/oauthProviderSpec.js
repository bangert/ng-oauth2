'use strict';

describe('OauthProvider', function () {

    beforeEach(module('ng-oauth2'));

    beforeEach(function () {
        var fakeModule = angular.module('test.app', function () {
        });
        fakeModule.config(function (OauthProvider) {
            OauthProvider.setOauthServerAddress('http://test.com/login');
            OauthProvider.setClientId('testClientId');
            OauthProvider.setProfileUrl('http://test.com/profile');
            OauthProvider.setUnauthorizedUrl('http://test.com/unauthorized');
            OauthProvider.setResponseType('testResponseType');
            OauthProvider.setLogoutUrl('http://test.com/logout');
            OauthProvider.setScope('testScope');
            OauthProvider.setState('testState');
            OauthProvider.setHeaderTokenName('testHeaderTokenName');
            OauthProvider.setRandomizeState(false);
            OauthProvider.setRedirectOnUnauthorized(false);
            OauthProvider.setSendTokenOnEveryRequest(false);
            OauthProvider.setRedirectOnLogout(false);
        });
        module('test.app');
    });

    describe('config', function () {
        
        it('should be able to set each option from the provider', inject(function (Oauth) {
            expect(Oauth.oauthServerAddress).toBe('http://test.com/login');
            expect(Oauth.clientId).toBe('testClientId');
            expect(Oauth.profileUrl).toBe('http://test.com/profile');
            expect(Oauth.unauthorizedUrl).toBe('http://test.com/unauthorized');
            expect(Oauth.logoutUrl).toBe('http://test.com/logout');
            expect(Oauth.responseType).toBe('testResponseType');
            expect(Oauth.scope).toBe('testScope');
            expect(Oauth.state).toBe('testState');
            expect(Oauth.headerTokenName).toBe('testHeaderTokenName');
            expect(Oauth.randomizeState).toBeFalsy();
            expect(Oauth.redirectOnUnauthorized).toBeFalsy();
            expect(Oauth.sendTokenOnEveryRequest).toBeFalsy();
            expect(Oauth.redirectOnLogout).toBeFalsy();
        }));
    });

});