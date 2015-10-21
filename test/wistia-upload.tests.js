describe('wUploadApp.wistiaUpload', function() {

	var compile, scope, directiveElement;

	beforeEach(function(){
		module('wUploadApp');

		inject(function($compile, $rootScope){
			compile = $compile;
			scope = $rootScope.$new();
		});
		
		var element = angular.element('<div wistia-upload></div>');
		directiveElement = $(compile(element)(scope));
		scope.$digest();
	});

	it('should have a input file named file', function() {
    	expect(directiveElement.html()).toContain('<input type="file" name="file">');
	});

});