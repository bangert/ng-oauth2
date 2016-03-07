# ng-oauth2

[![Build Status](https://travis-ci.org/el-davo/ng-oauth2.svg?branch=master)](https://travis-ci.org/el-davo/ng-oauth2)

An oauth2 implementation for angular based appliactions

## Getting Started

Run the following command to install

```
bower install ng-oauth2 --save
```

## Activate Oauth

To activate oauth in your application make sure to add ng-oauth2 as a dependency of your application as shown below

```js
var app = angular.module('testApp', ['ng-oauth2']);
```

## Configuration

To configure oauth you may use the ng-oauth2 provider which can be injected into a configuration block.

A minimum example is shown below

```js
app.config(['$locationProvider', 'OauthProvider', function ($locationProvider, OauthProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');      // Make sure this line is configured to allow ng-oauth2 to do its work
    OauthProvider.setOauthServerAddress('http://test.com');
    OauthProvider.setClientId('test');
    OauthProvider.setProfileUrl('http://test.com');
    OauthProvider.setUnauthorizedUrl('http://test.com');
    OauthProvider.setLogoutUrl('http://test.com');
}]);
```

The following options are available in ng-oauth2

```js
OauthProvider.setOauthServerAddress('http://test.com');     //The url to the oauth provider (login page)
OauthProvider.setClientId('test');                          //Oauth client id flag
OauthProvider.setProfileUrl('http://test.com');             //A url to grab user information after successful login
OauthProvider.setUnauthorizedUrl('http://test.com');        //A url to redirect to after a 401 response is detected on any request
OauthProvider.setLogoutUrl('http://test.com');              //A url to redirect to after logging out of the application
OauthProvider.setResponseType('token');                     //Sets the response type flag on the login url (Default = token)
OauthProvider.setScope('scope');                            //Sets the scope flag on the login url (Default = empty)
OauthProvider.setState('state');                            //Sets the state flag on the login url (Default = empty). Used to prevent CSRF attacks
OauthProvider.setHeaderTokenName('authorization');          //Sets the header to be used to pass the oauth token on each request (Default = Authorization)
OauthProvider.randomizeState(true);                         //Whether or not to generate a random state flag on the login url (Default = true)
OauthProvider.redirectOnUnauthorized(true);                 //Whether or not to redirect on a 401 response on any request (Default = true)
OauthProvider.sendTokenOnEveryRequest(true);                //Whether or not to send the oauth token on every request header (Default = true)
OauthProvider.redirectOnLogout(true);                       //Whether or not to redirect after logging out (Default = true)
```

ng-oauth2 will create a number of functions on the root scope that you may use in your partials. An example implementation is below

```html
<div>
    <div ng-hide="hasOauthProfile()">
        Loading
    </div>

    <div ng-show="hasOauthProfile()">
        logged in as {{getOauthProfile().displayName}}
    </div>

    <br>
    <button ng-click="oauthLogout()">Logout</button>
    <button ng-click="simulateUnauthorized()" ng-controller="TestCtrl">Simulate a 401 unauthorized response from
        server
    </button>
</div>
```

## Logout

To logout from anywhere inside the application just emit the event as shown below

```js
$scope.$emit('oauth2:logout');
```

## License

MIT