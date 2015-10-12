var app = angular.module('wUploadApp',['blueimp.fileupload']);

app.constant('wistiaConfig', {
    api_password: '2d3e652e8e6b6140270143ed0716e1b3a659d02b50cc201e57011b5eb3e28934',
    medias_url: 'https://api.wistia.com/v1/medias.json',
    upload_url: 'https://upload.wistia.com' 
});

app.directive('wistiaUpload', ['fileUpload', 'wistiaConfig', '$timeout', '$http',
    function(fileUpload, wistiaConfig, $timeout, $http) {
        return {
            restrict: 'AE',
            templateUrl: 'wistiaupload-template.html',
            // I used the scope to receive the api_password because I thought about the directive as a directive that could be 
            // used anywhere, with any api_password, so it would have to be passed as a parameter. 
            scope: {},
            controller: function($scope) {

                // I created the uploading variable, but I can't control the process bar and the upload
                // bar with just one variable, since when I open the page, 'isUploading' is false and so 
                // the process bar is visible. After the upload is complete, 'isUploding' is false again and using just it to 
                // control the process bar, it would be visible again.
                $scope.isUploading = false;
                $scope.isProcessing = false;

                var retrieveVideoWhenitsReady = function() {
                    var requestConfig = {
                        params: {
                            hashed_id: $scope.wistiaVideoHash,
                            api_password: wistiaConfig.api_password
                        }
                    };

                    $scope.isProcessing = true;

                    $http.get(wistiaConfig.medias_url, requestConfig)
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
                                        retrieveVideoWhenitsReady();
                                    }, 5000);
                                } else { // if the status is 'failed', stop the requests, something went wrong 
                                    $scope.msgFailure = 'Something went wrong while processing the video.';
                                    $scope.showErrorMsg();
                                    $scope.isProcessing = false;
                                }

                            } else {
                                // if response.data[0] is empty/undefined it means that the video has been deleted from Wistia for some reason
                                $scope.msgFailure = 'Something went wrong.';
                                $scope.showErrorMsg();
                                $scope.isProcessing = false;
                            }
                        }, function(response) {
                            $scope.msgFailure = 'Something went wrong.';
                            $scope.showErrorMsg();
                            $scope.isUploading = false;
                            $scope.isProcessing = false;
                        });
                }


                $scope.uploadOptions = {
                    url: wistiaConfig.upload_url,
                    type: 'POST',
                    formData: [{
                        name: 'api_password',
                        value: wistiaConfig.api_password
                    }],
                    processQueue: [{
                        action: 'validate',
                        always: true,
                        acceptFileTypes: '@'
                    }],
                    add: function(e, data) { // called when a file is picked
                       var file = data.files[0];
                        $scope.hideErrorMsg();

                        if (file.type.indexOf('video') === -1) {
                            $scope.showErrorMsg();
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
                            retrieveVideoWhenitsReady();

                        } else {
                            $scope.msgFailure = 'Something went wrong, we couldn\'t upload the video';
                            $scope.showErrorMsg();
                        }
                    },
                    fail: function() { // called when the uploading fails
                        $scope.isUploading = false;
                        $scope.msgFailure = 'Something went wrong.';
                        $scope.showErrorMsg();
                    }
                }
            },
            link: function(scope, elem, attr, ngModel) {
                var elMsgError = elem.find('.alert-danger');

                // I created these functions in the link to concentrate DOM manipulation here, 
                // but technically I'm still manipulating them in the controller, I couldn't find another 
                // way to do it. If you have a suggestion, I would be happy to hear it :)
                scope.showErrorMsg = function() {
                    elMsgError.fadeIn();
                }

                scope.hideErrorMsg = function() {
                    elMsgError.fadeOut();
                }
            }
        }
    }]);