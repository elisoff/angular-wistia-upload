describe('wUploadApp.wistiaUpload', function() {

	var compile, scope, directiveElement;

	beforeEach(function(){
		module('wUploadApp');

		inject(function($compile, $rootScope){
			compile = $compile;
			scope = $rootScope.$new();
		});
		
		var element = angular.element('<div wistia-upload></div>');
		directiveElement = compile(element)(scope);
		scope.$digest();
		
	});

	it('should have a input file', function() {
	
		var input = directiveElement.find('input[type=file]');

    	expect(input.length).toBe(1);
	});

});