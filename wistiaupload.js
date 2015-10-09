var app = angular.module('wUploadApp');

app.directive('wistiaUpload', ['fileUpload', '$timeout', '$http', '$q', 
	function(fileUpload, $timeout, $http, $q) {
	return {
        restrict: 'AE',
        templateUrl: 'upload-template.html',
        scope: {
        	options: '='
        },
        controller: function($scope) {

        	$scope.btnDisabled = false;
        	$scope.processingVideo = false;

        	function isVideoDone() {
				var deferred = $q.defer();

				var config = {
					params: {
						hashed_id: $scope.videoHash,
						api_password: $scope.options.api_password
					}
				}

				deferred.notify('About to call media');

				$http.get('https://api.wistia.com/v1/medias.json', config)
				.then(function(response) {
					if(response && response.data && response.data[0]) {
						var data = response.data[0];

						if(!data) {
							deferred.reject(0);
						}

						if(data.status == 'ready') {
							deferred.resolve();
						} else if(data.status != 'failed') {
							deferred.reject(1);
						} else {
							deferred.reject(0);
						}
						
					}
				}, function(response) {
					deferred.reject(0);
				});

			  return deferred.promise;
			}

			function doPromise() {
				var promise = isVideoDone();

				promise.then(function() {
				  wistiaEmbed = window.Wistia.embed($scope.videoHash);
				  $scope.processingVideo = false;
				  $scope.btnDisabled = false;
				}, function(reason) {
					if(reason == 1) {
						$timeout(function() {
							doPromise();
						}, 5000);
					} else {
						$scope.msgFailure = 'Something went wrong.';
						$scope.elMsgError.fadeIn();
						$scope.processingVideo = false;
						$scope.btnDisabled = false;
					}
				}, function(update) {
				  
				});
			}

        	$scope.uploadOptions = {
        		add: function(e, data) {
        			var file = data.files[0];
        			$scope.elMsgError.fadeOut();
        			
        			if(file.type.indexOf('video') == -1) {
	        			$scope.elMsgError.fadeIn();
        				return;
        			}

        			$scope.btnDisabled = true;
        			data.submit();
        		},
        		done: function(e, data) {
        			if(data && data.result) {
        				$scope.videoHash = data.result.hashed_id;
						doPromise();
						$scope.processingVideo = true;

        			} else if(data.error) {
        				$scope.msgFailure = 'Something went wrong.';
        				$scope.elMsgError.fadeIn();
        			}
        		},
        		fail: function() {
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
        link: function(scope, elem, attr, ngModel) {
        	scope.elMsgError = elem.find('.alert-danger');
        }
	}
}]);