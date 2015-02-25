'use strict';

angular.module('ng-oauth2.profile', []).factory('OauthProfile', ['$rootScope', '$http', 'Oauth', function ($rootScope, $http, Oauth) {

    var oauthProfile = null;

    $rootScope.getOauthProfile = function () {
        return oauthProfile;
    };

    $rootScope.hasOauthProfile = function () {
        return !!oauthProfile;
    };

    return {
        makeProfileRequest: function () {
            $http.get(Oauth.profileUrl).
                success(function (data) {
                    oauthProfile = data;
                });
        }
    };

}]);