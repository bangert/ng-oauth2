'use strict';

describe('OauthProfile', function () {

    var $httpBackend;

    beforeEach(module('ng-oauth2'));

    beforeEach(inject(function (_$httpBackend_, OauthProfile) {
        $httpBackend = _$httpBackend_;

        var user = {displayName: 'bob'};

        $httpBackend.whenGET('http://test.com/profile').respond(user);
    }));

    describe('initialization', function () {

        it("should define an oauthProfile variable on the root scope and default to null", inject(function ($rootScope) {
            expect($rootScope.oauthProfile).toBeDefined();
            expect($rootScope.oauthProfile).toBeNull();
        }));
    });

    describe('getOauthProfile()', function () {

        it("should return null if the users profile is not set", inject(function ($rootScope) {
            expect($rootScope.getOauthProfile()).toBeNull();
        }));

        it("should return the profile of the user if the users profile is set", inject(function ($rootScope) {
            $rootScope.oauthProfile = {displayName: 'bob'};
            expect($rootScope.getOauthProfile().displayName).toBe('bob');
        }));
    });

    describe('hasOauthProfile()', function () {

        it("should return false if the users profile is null", inject(function ($rootScope) {
            expect($rootScope.hasOauthProfile()).toBeFalsy();
        }));

        it("should return the profile of the user if the users profile is set", inject(function ($rootScope) {
            $rootScope.oauthProfile = {displayName: 'bob'};
            expect($rootScope.hasOauthProfile()).toBeTruthy();
        }));
    });

    describe('makeProfileRequest()', function () {

        beforeEach(inject(function (Oauth) {
            Oauth.profileUrl = 'http://test.com/profile';
        }));

        it("should make a request to the server to get the users information if they are logged in", inject(function ($rootScope, OauthProfile) {
            $rootScope.$apply();

            var promise = OauthProfile.makeProfileRequest(),
                profile = null;

            promise.then(function (data) {
                profile = data;
            });
            $httpBackend.flush();
            expect($rootScope.hasOauthProfile()).toBeTruthy();
            expect($rootScope.getOauthProfile().displayName).toBe('bob');
            expect(profile.displayName).toBe('bob');
        }));
    });

});