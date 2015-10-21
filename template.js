angular.module('templates-main', ['../wistia-upload.html']);

angular.module("../wistia-upload.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../wistia-upload.html",
    "<div class=\"container-fluid\">\n" +
    "	<form id=\"fileupload\" action=\"\" method=\"POST\" enctype=\"multipart/form-data\">\n" +
    "	<div class=\"row fileupload-buttonbar\">\n" +
    "		<div class=\"col-lg-12\">\n" +
    "			<div class=\"alert alert-danger alert-dismissible\" role=\"alert\" ng-show=\"displayFailureMessage\">\n" +
    "			  <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "			  <strong>Sorry!</strong> {{failureMessage ? failureMessage : 'You can only upload videos.'}}\n" +
    "			</div>\n" +
    "		    <div class=\"col-lg-2\">\n" +
    "		        <span class=\"btn btn-success fileinput-button\" ng-hide=\"isUploading || isProcessing\" ng-class=\"{disabled: btnDisabled}\">\n" +
    "		            <i class=\"glyphicon glyphicon-plus\"></i>\n" +
    "		            <span>Upload video</span>\n" +
    "		            <input type=\"file\" name=\"file\">\n" +
    "		        </span>\n" +
    "		    </div>\n" +
    "		    <div class=\"col-lg-10\">\n" +
    "		    	<div class=\"fade\" ng-class=\"{in: isUploading}\">\n" +
    "			        <div class=\"progress progress-striped active\">\n" +
    "			        	<div class=\"progress-bar progress-bar-success\" style=\"width: {{progressPercentual + '%'}}\"></div>\n" +
    "			        </div>\n" +
    "			        <div class=\"progress-extended\"></div>\n" +
    "			    </div>\n" +
    "		    </div>\n" +
    "		</div>\n" +
    "		<div class=\"col-lg-12\" ng-show=\"isProcessing\">\n" +
    "	       	<div class=\"progress\">\n" +
    "			  <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"45\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\">\n" +
    "			    <span>Wait, processing video...</span>\n" +
    "			  </div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	</form>\n" +
    "\n" +
    "	<div id=\"wistia_{{wistiaVideoHash}}\" class=\"wistia_embed\" style=\"width:640px;height:360px;\">&nbsp;</div>\n" +
    "</div>");
}]);
