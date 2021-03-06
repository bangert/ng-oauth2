'use strict';

describe('OauthToken', function () {

    var window, sessionStorage, timeout;

    beforeEach(module('testApp'));

    beforeEach(inject(function ($window, $sessionStorage, $timeout, OauthToken) {
        $window.location.assign = jasmine.createSpy();
        window = $window;
        sessionStorage = $sessionStorage;
        timeout = $timeout;
    }));

    beforeEach(inject(function (Oauth) {
        Oauth.logoutUrl = 'http://test.com/logout';
    }));

    describe('oauthLogout()', function () {

        it("should delete the session token and then redirect to the logout page", inject(function ($rootScope) {
            sessionStorage.oauthToken = 'TEST-TOKEN';
            expect(sessionStorage.oauthToken).toBe('TEST-TOKEN');
            $rootScope.oauthLogout();
            expect(sessionStorage.oauthToken).toBeUndefined();
            timeout.flush();
            expect(window.location.assign).toHaveBeenCalledWith('http://test.com/logout');
        }));

        it("should delete the session token and not redirect to the login page", inject(function (Oauth, $rootScope) {
            Oauth.redirectOnLogout = false;
            sessionStorage.oauthToken = 'TEST-TOKEN';
            expect(sessionStorage.oauthToken).toBe('TEST-TOKEN');
            $rootScope.oauthLogout();
            expect(sessionStorage.oauthToken).toBeUndefined();
            expect(window.location.assign).not.toHaveBeenCalled();
        }));
    });

    describe('setToken()', function () {

        it("should create a new token object on the users session", inject(function (OauthToken) {
            OauthToken.setToken({token: 'test', expires_in: 399});
            expect(sessionStorage.oauthToken.token).toBe('test');
            expect(sessionStorage.oauthToken.expires_in).toBe(399);
        }));
    });

    describe('getToken()', function () {

        it("should return the token object from the session", inject(function (OauthToken) {
            OauthToken.setToken({token: 'test', expires: 399});
            expect(OauthToken.getToken().token).toBe('test');
            expect(OauthToken.getToken().expires).toBe(399);
        }));
    });

    describe('isTokenSet()', function () {

        it("should return true if the token is set on the users session", inject(function (OauthToken) {
            OauthToken.setToken({token: 'test', expires: 399});
            expect(OauthToken.isTokenSet()).toBeTruthy();
        }));

        it("should return false if the token is not set on the users session", inject(function (OauthToken) {
            sessionStorage.oauthToken = undefined;
            expect(OauthToken.isTokenSet()).toBeFalsy();
        }));
    });

    describe('getTokenFromString()', function () {

        it("should return the list of params from the browser url", inject(function ($location, OauthToken) {
            $location.hash('access_token=testToken&token_type=bearer&state=testState&expires_in=43199&scope=openid&jti=b0c7401a-a8fd-48ee-b26e-c98daa4810cf');
            var token = OauthToken.getTokenFromString();
            expect(token.access_token).toBe('testToken');
            expect(token.token_type).toBe('bearer');
            expect(token.state).toBe('testState');
            expect(token.expires_in).toBe('43199');
            expect(token.scope).toBe('openid');
            expect(token.jti).toBe('b0c7401a-a8fd-48ee-b26e-c98daa4810cf');
        }));

        it("should return undefined if no parameters are on the browser url", inject(function ($location, OauthToken) {
            $location.hash('');
            var token = OauthToken.getTokenFromString();
            expect(token).toBeUndefined();
        }));
    });

    describe('getTokenFromString()', function () {

        beforeEach(inject(function ($location) {
            $location.hash('access_token=testToken&token_type=bearer&state=testState&expires_in=43199&scope=openid&jti=b0c7401a-a8fd-48ee-b26e-c98daa4810cf');
        }));

        it("should remove the parameters from the url and leave only the jti param", inject(function ($location, OauthToken) {
            expect($location.hash()).toBe('access_token=testToken&token_type=bearer&state=testState&expires_in=43199&scope=openid&jti=b0c7401a-a8fd-48ee-b26e-c98daa4810cf');
            OauthToken.removeFragment();
            expect($location.hash()).toBe('jti=b0c7401a-a8fd-48ee-b26e-c98daa4810cf');
        }));
    });

    describe('isExpired()', function () {

        var baseTime = new Date();
        beforeEach(inject(function () {
            jasmine.clock().mockDate(baseTime);
        }));

        it("should return true if today date is greater than the session expires_at parameter", inject(function ($sessionStorage, OauthToken) {
            $sessionStorage.oauthToken = {expires_at: baseTime.getTime() - 1};
            expect(OauthToken.isExpired()).toBe(true);
        }));

        it("should return false if today date is less than the session expires_at parameter", inject(function ($sessionStorage, OauthToken) {
            $sessionStorage.oauthToken = {expires_at: baseTime.getTime() + 1};
            expect(OauthToken.isExpired()).toBe(false);
        }));

        it("should return true if today date is equal to the session expires_at parameter", inject(function ($sessionStorage, OauthToken) {
            $sessionStorage.oauthToken = {expires_at: baseTime.getTime()};
            expect(OauthToken.isExpired()).toBe(true);
        }));

        it("should return false if the expiry date does not exist", inject(function ($sessionStorage, OauthToken) {
            $sessionStorage.oauthToken = {};
            expect(OauthToken.isExpired()).toBe(true);
        }));

        it("should return false if the expiry date is null", inject(function ($sessionStorage, OauthToken) {
            $sessionStorage.oauthToken = {expires_at: null};
            expect(OauthToken.isExpired()).toBe(true);
        }));
    });

});
