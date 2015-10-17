describe('wUploadApp.wistiaUpload', function() {

	var $rootScope, $compile, $httpBackend, directiveElement;

	beforeEach(module('wUploadApp'));

	beforeEach(inject(function($injector, _$compile_, _$rootScope_){
	    $compile = _$compile_;
	    $rootScope = _$rootScope_;

    	$httpBackend = $injector.get('$httpBackend');

	}));

	it('should have a input file', function() {

		$httpBackend.whenGET('wistia-upload.html').respond(200, '');

	    directiveElement = $compile('<div wistia-upload></div>')($rootScope);
    	$rootScope.$digest();

		console.log(directiveElement.html());

    	expect(directiveElement.html()).toContain("<input type=\"file\" name=\"file\">");
	});

});