'use strict';

app.config(function ($provide) {
    var DELAY_MS = 500;

    $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);

    $provide.decorator('$httpBackend', function ($delegate) {
        var proxy = function (method, url, data, callback, headers) {
            var interceptor = function () {
                var _this = this, _arguments = arguments;
                setTimeout(function () {
                    // return result to the client AFTER delay
                    callback.apply(_this, _arguments);
                }, DELAY_MS);
            };
            return $delegate.call(this, method, url, data, interceptor, headers);
        };
        for (var key in $delegate) {
            proxy[key] = $delegate[key];
        }
        return proxy;
    });

});

app.run(['$httpBackend', 'Oauth', function ($httpBackend, Oauth) {

    $httpBackend.whenGET(new RegExp(Oauth.profileUrl)).passThrough();

    $httpBackend.whenGET(new RegExp(Oauth.unauthorizedUrl)).respond(function (method, url, data, headers) {
        console.log(method + " " + url);
        
        return [401];
    });

}]);
