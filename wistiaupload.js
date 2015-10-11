var app = angular.module('wUploadApp');

app.directive('wistiaUpload', ['fileUpload', '$timeout', '$http', '$q',
    function (fileUpload, $timeout, $http, $q) {
        return {
            restrict: 'AE',
            // TODO The template should be named the same as the directive so that we know they go together
            // Rename your directive and template files so they match
            templateUrl: 'upload-template.html',
            // TODO Instead of using the scope to pass in the API key, use an Angular constant
            scope: {
                options: '='
            },
            // TODO You were right to use a controller here :)
            controller: function ($scope) {

                // TODO What is the difference between btnDisabled and processVideo?
                // It seems to me that you could combine them into an "uploading" variable and just disable the
                // button while uploading is true
                $scope.btnDisabled = false;
                $scope.processingVideo = false;

                function isVideoDone() {

                    // TODO This deferred isn't necessary, see below
                    var deferred = $q.defer();

                    var config = {
                        params: {
                            hashed_id: $scope.videoHash,
                            api_password: $scope.options.api_password
                        }
                    };

                    // TODO Why is this needed?
                    deferred.notify('About to call media');

                    // TODO $http.get returns a promise, so you don't need the deferred
                    // Read the Angular docs on the $http service
                    // I want you to merge this function with doPromise
                    $http.get('https://api.wistia.com/v1/medias.json', config)
                        .then(function (response) {
                            // TODO Why are you doing this, and what is it doing that Angular is not already doing?
                            // Explain to me why this is necessary
                            if (response && response.data && response.data[0]) {
                                var data = response.data[0];

                                if (!data) {
                                    deferred.reject(0);
                                }

                                if (data.status == 'ready') {
                                    deferred.resolve();
                                } else if (data.status != 'failed') {
                                    deferred.reject(1);
                                } else {
                                    deferred.reject(0);
                                }

                            }
                        }, function (response) {
                            deferred.reject(0);
                        });

                    return deferred.promise;
                }

                // TODO Never name functions like this
                // It tells me nothing about what the function does except that it returns some sort of promise
                function doPromise() {
                    var promise = isVideoDone();

                    promise.then(function () {
                        // TODO Never create global variables like this
                        // Also, what does the "wistiaEmbed" variable do? I don't see it used anywhere else
                        wistiaEmbed = window.Wistia.embed($scope.videoHash);
                        $scope.processingVideo = false;
                        $scope.btnDisabled = false;
                    }, function (reason) {
                        // TODO What is reason? What does reason == 1 mean?
                        if (reason == 1) {
                            $timeout(function () {
                                doPromise();
                            }, 5000);
                        } else {
                            $scope.msgFailure = 'Something went wrong.';
                            // TODO You should never manipulate elements in a controller
                            // Any element manipulation should take place in the link function
                            $scope.elMsgError.fadeIn();
                            $scope.processingVideo = false;
                            $scope.btnDisabled = false;
                        }
                    }, function (update) {
                        // TODO Why is this here? If your error handler does nothing, you don't need to define it
                        // Read the Angular $q docs
                    });
                }

                $scope.uploadOptions = {
                    add: function (e, data) {
                        var file = data.files[0];
                        $scope.elMsgError.fadeOut();

                        // TODO You should never use ==
                        // Always use === and !=== instead, they're less error prone (Google if you want to know why)
                        if (file.type.indexOf('video') == -1) {
                            $scope.elMsgError.fadeIn();
                            return;
                        }

                        $scope.btnDisabled = true;
                        data.submit();
                    },
                    done: function (e, data) {
                        if (data && data.result) {
                            $scope.videoHash = data.result.hashed_id;
                            doPromise();
                            $scope.processingVideo = true;

                        } else if (data.error) {
                            $scope.msgFailure = 'Something went wrong.';
                            $scope.elMsgError.fadeIn();
                        }
                    },
                    fail: function () {
                        $scope.btnDisabled = false;
                        $scope.msgFailure = 'Something went wrong.';
                        $scope.elMsgError.fadeIn();
                    },
                    url: 'https://upload.wistia.com',
                    type: 'POST',
                    formData: [
                        {
                            name: 'api_password',
                            value: $scope.options.api_password
                        }
                    ],
                    processQueue: [
                        {
                            action: 'validate',
                            always: true,
                            acceptFileTypes: '@'
                        }
                    ]
                }
            },
            link: function (scope, elem, attr, ngModel) {
                scope.elMsgError = elem.find('.alert-danger');
            }
        }
    }]);