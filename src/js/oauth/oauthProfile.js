'use strict';

angular.module('ng-oauth2.profile', []).factory('OauthProfile', ['$http', 'Oauth', function ($http, Oauth) {

    var profile = null;

    return {
        makeProfileRequest: function () {
            $http.get(Oauth.profileUrl).
                success(function (data) {
                    profile = data;
                });
        },

        getProfile: function () {
            return profile;
        },

        hasProfile: function () {
            return !!profile;
        }
    };

}]);