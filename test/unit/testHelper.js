'use strict';

/**
 *
 * An Angular Jasmine testing utility
 *
 * automatically injects these services:
 * '$httpBackend', '$rootScope', '$controller', '$compile'


 describe('app.controllers', function() {

  var s = new TestBoilerplate(
    [
      // require these modules
      'app.services'
    ], [
      // load these services to s.{Account}
      'Comments',
      '$routeParams',
    ]
  );

    describe('CommentsCtrl', function() {
      var data = [{
        "comment": "hi",
        'user': {
          _id: 'userid'
        }
      }];

      it('should fetch comments', function() {
        
        // this is what we expect the controller to fetch
        // and we supply the data it should get
        s.willGET('/capsules/1/comments', data);

        // call the control
        s.$routeParams.id = 1;
        s.controller('CommentsCtrl');

        // having executed the controller
        // we can test the s.$scope
        expect(s.$scope.comments).toEqualData(data);
    });
  });
});

 **/
function TestBoilerplate(modules, injections, spies, templates) {
    var self = this;
    var moduleParams = {};

    /**
     * Preload templates as compiled modules using the html2js in Karma.
     */
    if(templates) {
        angular.forEach(templates, function(templateURLs, baseTemplatePath) {
            angular.forEach(templateURLs, function(templateURL) {
                // where karma preprocessor loaded it into
                var fullPath = baseTemplatePath + templateURL;
                // module name is full/path/to/the.html
                modules.push(fullPath);
            });
        });
    }

    /**
     * Load up the modules that we require.
     */
    angular.forEach(modules, function(module) {
        moduleParams[module] = [module];
    });

    /**
     * Now the test spies.
     */
    angular.forEach(spies, function(spy) {
        var module = spy[0],
            service = spy[1],
            methods = spy[2];

        if(!moduleParams[module]) {
            moduleParams[module] = [module];
        }
        moduleParams[module].push(function($provide) {
            // Add a decorator to the service we wish to spy on. By using the
            // decorator we intercept the actual service calls and pass through
            // all others.
            $provide.decorator(service, function ($delegate) {
                angular.forEach(methods, function(method) {
                    // Unlike spyOn(), creating a fake method circumvents the
                    // original method so that it is not called during tests.
                    // We add a decorator to the $delegate (the service we're
                    // spying on) to 'replace' the original method.
                    $delegate[method] = jasmine.createSpy(method);
                });
                return $delegate;
            });
        });
    });

    // modules need to be sorted. do the spy ones first
    beforeEach(function() {
        angular.forEach(moduleParams, function(moduleParam) {
            module.apply(undefined, moduleParam);
        });

        // Add in our custom matcher for checking data that's returned from
        // the $httpBackend helper methods.
        jasmine.addMatchers({
            toEqualData: function toEqualData(expected) {
                return angular.equals(this.actual, expected);
            }
        });

    });

    injections = injections || [];
    injections = injections.concat(['$httpBackend', '$rootScope', '$controller', '$compile', '$templateCache']);

    beforeEach(inject(function($injector) {
        angular.forEach(injections, function(name) {
            self[name] = $injector.get(name);
        });

        // always make a $scope
        self.$scope = self.$rootScope.$new();

        if(templates) {
            angular.forEach(templates, function(templateURLs, baseTemplatePath) {
                angular.forEach(templateURLs, function(templateURL) {
                    var full = baseTemplatePath + templateURL;
                    // copy it ...
                    var template = self.$templateCache.get(full);
                    // to the URL the directive will request it at
                    self.$templateCache.put(templateURL, template);
                });
            });
        }

    }));

    // always verify all requests
    this.verifyRequests();
}

/**
 * Make sure the backend is finished its job before moving on.
 */
TestBoilerplate.prototype.verifyRequests = function() {
    var self = this;
    afterEach(function() {
        self.$httpBackend.verifyNoOutstandingExpectation();
        self.$httpBackend.verifyNoOutstandingRequest();
        // clear any local storage used during the tests.
        window.localStorage.clear();
    });
};

/**
 * Expect a get operation for the $httpBackend.
 * @param url the url to stub out
 * @param response the response data
 * @param statusCode the status code of the response
 * @returns {*}
 */
TestBoilerplate.prototype.willGET = function(url, response, statusCode) {
    return this.$httpBackend
        .expectGET(url)
        .respond(statusCode || 200, response);
};

/**
 * Expect a post operation for the $httpBackend.
 * @param url the url to stub out
 * @param post the data in the post request
 * @param response the response data
 * @param statusCode the status code of the response
 * @returns {*}
 */
TestBoilerplate.prototype.willPOST = function(url, post, response, statusCode) {
    return this.$httpBackend
        .expectPOST(url, post)
        .respond(statusCode || 201, response);
};

/**
 * Expect a put operation for the $httpBackend.
 * @param url the url to stub out
 * @param post the data in the put request
 * @param response the response data
 * @param statusCode the status code of the response
 * @returns {*}
 */
TestBoilerplate.prototype.willPUT = function(url, post, response, statusCode) {
    return this.$httpBackend
        .expectPUT(url, post)
        .respond(statusCode || 200, response);
};

/**
 * Flush the backend
 */
TestBoilerplate.prototype.flush = function() {
    this.$httpBackend.flush();
};

/**
 * make controller and flush expected requests
 *
 * @param controllerName
 * @param dontFlush
 * @returns {*}
 */
TestBoilerplate.prototype.controller = function(controllerName, dontFlush) {
    var ctlr =  this.$controller(controllerName, {$scope: this.$scope});
    if(!dontFlush) {
        this.flush();
    }
    return ctlr;
};


/**
 *
 * For pre-loading templates for directive testing
 *
 * because angular mock $httpBackend will intercept all requests
 * you need a way to let the directive fetch its template.
 *
 * in your karma.conf add the partials to your files list:
 *   // load partials for testing directives
 *   // using html2js preprocessor
 *   'app/partials/*.html',
 *
 * and add the karma preprocessor:
 * // generate js files from html templates to expose them during testing.
 * preprocessors = {
*   'app/partials/*.html': 'html2js'
* };
 *
 * then add those templates to the testing boilerplate:
 *
 * templates: {
*   'phoneapp/yapp/': [
*     'partials/capsule-summary.html'
*   ]
* }
 *
 * now you will be able to compile directives
 **/

TestBoilerplate.prototype.directive = function(html, scopeVars, testFunc) {
    var htmlEl = angular.element(html), el, self = this, directiveScope;
    if(scopeVars) {
        angular.forEach(scopeVars, function(v, k) {
            self.$scope[k] = v;
        });
    }
    el = this.$compile(htmlEl)(this.$scope);
    this.$scope.$digest();
    this.$scope.$apply();
    if(testFunc) {
        // children scope is that inner scope created by the directive
        // else it uses the scope it was given by parent
        // warning: this may not be perfect yet
        directiveScope = el.children().scope() || el.scope();
        testFunc(el, directiveScope);
    }
    return el;
};


TestBoilerplate.prototype.debug = function(obj) {
    try {
        // circular references are popular in angular
        // but they cannot be printed
        console.log(JSON.stringify(obj));
    } catch(err) {
        console.log('' + obj + '::');
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                console.log(key + '=' + obj[key]);
            }
        }
    }
};