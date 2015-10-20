var app = angular.module('wUploadApp',['templates-main', 'blueimp.fileupload']);

app.constant('wistiaConfig', {
    apiPassword: '2d3e652e8e6b6140270143ed0716e1b3a659d02b50cc201e57011b5eb3e28934',
    mediasUrl: 'https://api.wistia.com/v1/medias.json',
    uploadUrl: 'https://upload.wistia.com' 
});

app.directive('wistiaUpload', ['fileUpload', 'wistiaConfig', '$timeout', '$http',
    function(fileUpload, wistiaConfig, $timeout, $http) {
        return {
            restrict: 'AE',
            templateUrl: '../wistia-upload.html', 
            scope: {},
            controller: function($scope) {
                $scope.isUploading = false;
                $scope.isProcessing = false;
                $scope.displayFailureMessage = false;

                var retrieveVideoHashWhenReady = function() {
                    var requestConfig = {
                        params: {
                            hashed_id: $scope.wistiaVideoHash,
                            api_password: wistiaConfig.apiPassword
                        }
                    };

                    $scope.isProcessing = true;

                    $http.get(wistiaConfig.mediasUrl, requestConfig)
                        .then(function(response) {
                            $scope.isUploading = false;

                            if (response.data && response.data[0]) {
                                var wistiaInfo = response.data[0];

                                // If the video is ready, I can show it.
                                if (wistiaInfo.status === 'ready') {

                                    window.Wistia.embed($scope.wistiaVideoHash);
                                    $scope.isProcessing = false;

                                } else if (wistiaInfo.status !== 'failed') { // the video can be "processing", "queued"
                                    $timeout(function () {
                                        retrieveVideoHashWhenReady();
                                    }, 5000);
                                } else { // if the status is 'failed', stop the requests, something went wrong 
                                    $scope.failureMessage = 'Something went wrong while processing the video.';
                                    $scope.displayFailureMessage = true;
                                    $scope.isProcessing = false;
                                }

                            } else {
                                // if response.data[0] is empty/undefined it means that the video has been deleted from Wistia for some reason
                                $scope.failureMessage = 'Something went wrong.';
                                $scope.displayFailureMessage = true;

                                $scope.isProcessing = false;
                            }
                        }, function(response) {
                            $scope.failureMessage = 'Something went wrong.';
                            $scope.displayFailureMessage = true;
                            $scope.isUploading = false;
                            $scope.isProcessing = false;
                        });
                };


                $scope.uploadOptions = {
                    url: wistiaConfig.uploadUrl,
                    type: 'POST',
                    formData: [{
                        name: 'api_password',
                        value: wistiaConfig.apiPassword
                    }],
                    processQueue: [{
                        action: 'validate',
                        always: true,
                        acceptFileTypes: '@'
                    }],
                    add: function(e, data) { // called when a file is picked
                       var file = data.files[0];
                        $scope.displayFailureMessage = false;

                        if (file.type.indexOf('video') === -1) {
                            $scope.displayFailureMessage = true;
                            return;
                        }

                        $scope.isUploading = true;
                        data.submit();
                    },
                    done: function(e, data) { // called when the uploading is done
                        $scope.isUploading = false;

                        if (data && data.result) {
                            $scope.wistiaVideoHash = data.result.hashed_id;
                            // retrive the video to show in the embed area
                            retrieveVideoHashWhenReady();

                        } else {
                            $scope.failureMessage = 'Something went wrong, we couldn\'t upload the video';
                            $scope.displayFailureMessage = true;
                        }
                    },
                    fail: function() { // called when the uploading fails
                        $scope.isUploading = false;
                        $scope.failureMessage = 'Something went wrong.';
                        $scope.displayFailureMessage = true;
                    }
                };
            }
        };
    }]);