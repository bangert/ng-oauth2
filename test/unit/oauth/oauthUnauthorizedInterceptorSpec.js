'use strict';

describe('OauthUnauthorizedHttpInterceptor', function () {

    var $httpBackend;

    beforeEach(module('testApp'));

    beforeEach(inject(function (_$httpBackend_, Oauth, OauthToken, OauthEndpoint) {
        $httpBackend = _$httpBackend_;
        Oauth.profileUrl = 'http://test.com/profile';
        Oauth.unauthorizedUrl = 'http://test.com/unauthorized';
        OauthToken.setToken({access_token: 'test_token', expires_in: 399});
        spyOn(OauthEndpoint, 'redirectToUrl');
        $httpBackend.whenGET('http://test.com/profile').respond(function () {
            return [401];
        });
    }));

    describe('interceptor', function () {

        it("should redirect to unauthorized page when redirectOnUnauthorized is true and a 401 response is detected", inject(function ($rootScope, Oauth, OauthProfile, OauthEndpoint) {
            Oauth.redirectOnUnauthorized = true;
            var promise = OauthProfile.makeProfileRequest(),
                profile = null;

            promise.then(function (data) {
                profile = data;
            });
            $httpBackend.flush();
            expect(OauthEndpoint.redirectToUrl).toHaveBeenCalledWith('http://test.com/unauthorized');
        }));

        it("should not redirect to unauthorized page when redirectOnUnauthorized is false and a 401 response is detected", inject(function ($rootScope, Oauth, OauthProfile, OauthEndpoint) {
            Oauth.redirectOnUnauthorized = false;
            var promise = OauthProfile.makeProfileRequest(),
                profile = null;

            promise.then(function (data) {
                profile = data;
            });
            $httpBackend.flush();
            expect(OauthEndpoint.redirectToUrl).not.toHaveBeenCalledWith('http://test.com/unauthorized');
        }));
    });
});