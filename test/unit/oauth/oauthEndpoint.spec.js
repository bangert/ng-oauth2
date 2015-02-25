'use strict';

describe('OauthEndpoint', function () {

    var window;

    beforeEach(module('testApp'));

    beforeEach(inject(function ($window) {
        $window.location.assign = jasmine.createSpy();
        window = $window;
    }));

    beforeEach(inject(function (Oauth) {
        Oauth.oauthServerAddress = 'http://test.com';
        Oauth.unauthorizedUrl = 'http://test.com/unauthorized';
        Oauth.logoutUrl = 'http://test.com/logout';
        Oauth.responseType = 'token';
        Oauth.scope = 'testScope';
        Oauth.state = 'testState';
    }));

    describe('getOauthUrl()', function () {

        it("should create the correct url", inject(function (OauthEndpoint) {
            expect(OauthEndpoint.getOauthUrl()).toBe('http://test.com?response_type=token&client_id=titan&redirect_uri=http%3A%2F%2Fserver%2F&scope=testScope&state=testState');
        }));
    });

    describe('redirectToOauthPage()', function () {

        it('should perform a redirect to the oauth page to allow the user to login', inject(function (OauthEndpoint) {
            OauthEndpoint.redirectToOauthPage();
            expect(window.location.assign).toHaveBeenCalledWith('http://test.com?response_type=token&client_id=titan&redirect_uri=http%3A%2F%2Fserver%2F&scope=testScope&state=testState');
        }));
    });

    describe('redirectToUnauthorizedPage()', function () {

        it('should perform a redirect to the unauthorized page when the user is no authorized', inject(function (OauthEndpoint) {
            OauthEndpoint.redirectToUnauthorizedPage();
            expect(window.location.assign).toHaveBeenCalledWith('http://test.com/unauthorized');
        }));
    });

    describe('redirectToLogoutPage()', function () {

        it('should perform a redirect to the logout page when the user logs out', inject(function (OauthEndpoint) {
            OauthEndpoint.redirectToLogoutPage();
            expect(window.location.assign).toHaveBeenCalledWith('http://test.com/logout');
        }));
    });

});