'use strict';

describe('OauthHttpInterceptor', function () {

    var $httpBackend;

    beforeEach(module('testApp'));

    beforeEach(inject(function (_$httpBackend_, Oauth, OauthToken) {
        $httpBackend = _$httpBackend_;
        Oauth.profileUrl = 'http://test.com/profile';
        OauthToken.setToken({access_token: 'test_token', expires_in: 399});
    }));

    describe('interceptor', function () {

        var token;

        beforeEach(function () {
            token = null;
            $httpBackend.whenGET('http://test.com/profile').respond(function (method, url, data, headers) {
                token = headers.Authorization;
                return [200];
            });
        });

        fit("should add the authorization token to the request when sendTokenOnEveryRequest is enabled", inject(function (Oauth, OauthProfile) {
            Oauth.sendTokenOnEveryRequest = true;
            OauthProfile.makeProfileRequest();
            $httpBackend.flush();
            expect(token).toBe('test_token1');
        }));

        it('should not add the authorization token to the request when sendTokenOnEveryRequest is disabled', inject(function (Oauth, OauthProfile) {
            Oauth.sendTokenOnEveryRequest = false;
            OauthProfile.makeProfileRequest();
            $httpBackend.flush();
            expect(token).toBeUndefined();
        }));
    });
});