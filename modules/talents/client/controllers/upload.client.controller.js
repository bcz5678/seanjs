'use strict';


angular.module('talents').controller('uploadController', ['$scope', 'Upload', '$timeout', function($scope, Upload, $timeout) {
  $scope.log ="No Files Uploaded Yet";
  $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });

  $scope.$watch('file', function () {
        if ($scope.file != null) {
            $scope.files = [$scope.file]; 
        }
    });

	$scope.upload = function(files) {
        if (files && files.length) {

        	console.log("files length - " + files.length);

            for (var i = 0; i < files.length; i++) {
              var file = files[i];
              if (!file.$error) {
                Upload.upload({
                    url: '/api/user/profile/uploads',
                    arrayKey: '', // default is [i]
                    data: {
                      file: file  
                    }
                }).then(function (resp) {
                    $timeout(function() {
                        $scope.response = resp;
                        $scope.log = 'successfully uploaded\n' + $scope.log;
                        $scope.log = 'file: ' +
                        resp.config.data.file.name +
                        ', Response: ' + JSON.stringify(resp.data) +
                        '\n' + $scope.log;
                    });
                }, function(data, status, headers, config) {
                    if (status > 0)
                    $scope.errorMsg = status + ': ' + data;

                    $scope.log = "There was an error \n" + $scope.log;
                    console.log("There was an error");
                }, 
                    function (evt) {

                    var progressPercentage = parseInt(100.0 *
                    		evt.loaded / evt.total);

                    file.progress = progressPercentage;

                    console.log(file.progress);

                    $scope.log = 'progress: ' + progressPercentage + 
                    	'% ' + evt.config.data.file.name + '\n' + 
                      $scope.log;

                });
              }
            }
        }
    };

}]);