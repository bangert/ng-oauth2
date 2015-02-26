'use strict';

describe('OauthEndpoint', function () {

    beforeEach(module('ng-oauth2'));

    beforeEach(inject(function ($sessionStorage, OauthEndpoint) {
        spyOn(OauthEndpoint, 'redirectToUrl');
    }));

    beforeEach(inject(function (Oauth) {
        Oauth.oauthServerAddress = 'http://test.com';
        Oauth.unauthorizedUrl = 'http://test.com/unauthorized';
        Oauth.clientId = 'clientId';
        Oauth.logoutUrl = 'http://test.com/logout';
        Oauth.responseType = 'token';
        Oauth.scope = 'testScope';
        Oauth.state = 'testState';
    }));

    describe('getOauthUrl()', function () {

        it("should create the correct url", inject(function (OauthEndpoint) {
            expect(OauthEndpoint.getOauthUrl()).toBe('http://test.com?response_type=token&client_id=clientId&redirect_uri=http%3A%2F%2Fserver%2F&scope=testScope&state=testState');
        }));
    });

    describe('redirectToOauthPage()', function () {

        it('should perform a redirect to the oauth page to allow the user to login', inject(function (OauthEndpoint) {
            OauthEndpoint.redirectToOauthPage();
            expect(OauthEndpoint.redirectToUrl).toHaveBeenCalledWith('http://test.com?response_type=token&client_id=clientId&redirect_uri=http%3A%2F%2Fserver%2F&scope=testScope&state=testState');
        }));
    });

    describe('redirectToUnauthorizedPage()', function () {

        it('should perform a redirect to the unauthorized page when the user is no authorized', inject(function (OauthEndpoint) {
            OauthEndpoint.redirectToUnauthorizedPage();
            expect(OauthEndpoint.redirectToUrl).toHaveBeenCalledWith('http://test.com/unauthorized');
        }));
    });

    describe('redirectToLogoutPage()', function () {

        it('should perform a redirect to the logout page when the user logs out', inject(function (OauthEndpoint) {
            OauthEndpoint.redirectToLogoutPage();
            expect(OauthEndpoint.redirectToUrl).toHaveBeenCalledWith('http://test.com/logout');
        }));
    });

});