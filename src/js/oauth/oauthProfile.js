'use strict';

angular.module('ng-oauth2.profile', []).factory('OauthProfile', ['$rootScope', '$q', '$http', 'Oauth', function ($rootScope, $q, $http, Oauth) {

    $rootScope.oauthProfile = null;

    $rootScope.getOauthProfile = function () {
        return $rootScope.oauthProfile;
    };

    $rootScope.hasOauthProfile = function () {
        return !!$rootScope.oauthProfile;
    };

    return {
        makeProfileRequest: function () {
            var deferred = $q.defer();
            $http.get(Oauth.profileUrl).
                success(function (data) {
                    $rootScope.oauthProfile = data;
                    deferred.resolve(data);
                })
                .error(function () {
                    deferred.reject("error");
                });

            return deferred.promise;
        }
    };

}]);