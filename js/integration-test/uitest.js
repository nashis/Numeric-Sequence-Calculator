phantom.casperTest = true;
var casper = require('casper').create();

casper.test.begin('uitest started:', function (test) {
    casper.start('../../index.html', function () {
        this.echo('\n');
        this.echo('Check all UI elements are initialized correctly');
        this.echo('-----------------------------------------------');
        // lightbox exists, and not visible
        test.assertExist('.lightbox .lightbox__container', 'lightbox container exists');
        test.assertNotVisible('.lightbox .lightbox__container', 'lightbox container not visible');

        // Instructions button exists, visible, and labled as "Instructions"
        test.assertExist('.nav__container .instructions', 'Instructions button exists');
        test.assertVisible('.nav__container .instructions', 'Instructions button visible');
        test.assertMatch(this.getHTML('.nav__container .instructions').toString(), /Instructions/g, 'Instructions button labled as Instructions');

        // Input textbox exists, and visible
        test.assertExist('.input__container #user__input', 'Input box exists');
        test.assertVisible('.input__container #user__input', 'Input box visible');

        // Generate sequence button exists, and visible
        test.assertExist('.input__container .btn-default', 'Generate button exists');
        test.assertVisible('.input__container .btn-default', 'Generate button visible');
        //test.assertMatch(this.getElementAttribute('.input__container .btn-default', 'disabled'), /disabled/, 'Generate button is disabled by default');

        // Loading container exists, and not visible
        test.assertExist('.status__container .loading__container', 'Loading conatiner exists');
        test.assertNotVisible('.status__container .loading__container', 'Loading conatiner not visible');

        // Error container exists, and not visible
        test.assertExist('.status__container .error__container', 'Error container exists');
        test.assertNotVisible('.status__container .error__container', 'Error container not visible');

        // Info container exists, and not visible
        test.assertExist('.status__container .info__container', 'Info container exists');
        test.assertNotVisible('.status__container .info__container', 'Info container not visible');

        // Results container exists, and visible
        test.assertExist('.output__container', 'Output box exists');
        test.assertNotVisible('.output__container', 'Output box not visible');
    });

    casper.then(function () {
        this.sendKeys('.input__container #user__input', '');
    });

    casper.thenClick('.input__container .btn-default', function () {
        this.echo('\n');
        this.echo('Check for error message on invalid input');
        this.echo('----------------------------------------');
        this.test.assertVisible('.error__container', 'Error message is displayed for invalid input');
    });

    casper.then(function () {
        this.sendKeys('.input__container #user__input', '100000');
    });

    casper.thenClick('.input__container .btn-default', function () {
        this.echo('\n');
        this.echo('Check output for numbers less than or equal 100000 i.e. no paging');
        this.echo('--------------------------------------------------------');
        this.test.assertNotVisible('.status__container .info__container', 'Info container not visible for input less than or equal to 100000');
        this.test.assertVisible('.output__container', 'Output container is visible for input less than or equal to 100000');
    });

    casper.then(function () {
        this.sendKeys('.input__container #user__input', '200001');
    });

    casper.thenClick('.input__container .btn-default', function () {
        this.echo('\n');
        this.echo('Check output for numbers greater than 100000 i.e. paginated result -- First Page');
        this.echo('------------------------------------------------------------------');
        //this.echo(this.getHTML('.status__container .info__container'));
        this.test.assertVisible('.status__container .info__container', 'Info container visible for input more than 100000');
        this.test.assertEquals(this.getElementAttribute('.nav-info .load__more--prev', 'disabled'), 'disabled', 'Load previous button is disabled for first page');
        this.test.assertNotEquals(this.getElementAttribute('.nav-info .load__more--next', 'disabled'), 'disabled', 'Load next button is not disabled for first page');
        this.test.assertVisible('.output__container', 'Output container is visible for input more than 100000');
    });

    casper.thenClick('.nav-info .load__more--next', function () {
        this.echo('\n');
        this.echo('Check output for numbers greater than 100000 i.e. paginated result -- Second Page');
        this.echo('------------------------------------------------------------------');
        this.test.assertVisible('.status__container .info__container', 'Info container visible for second page');
        this.test.assertNotEquals(this.getElementAttribute('.nav-info .load__more--prev', 'disabled'), 'disabled', 'Load previous button is not disabled for second page');
        this.test.assertNotEquals(this.getElementAttribute('.nav-info .load__more--next', 'disabled'), 'disabled', 'Load next button is not disabled for second page');
        this.test.assertVisible('.output__container', 'Output container is visible for second page');
    });

    casper.thenClick('.nav-info .load__more--next', function () {
        this.echo('\n');
        this.echo('Check output for numbers greater than 100000 i.e. paginated result -- Last Page');
        this.echo('------------------------------------------------------------------');
        this.test.assertVisible('.status__container .info__container', 'Info container visible for last page');
        this.test.assertNotEquals(this.getElementAttribute('.nav-info .load__more--prev', 'disabled'), 'disabled', 'Load previous button is not disabled for last page');
        //this.test.assertEquals(this.getElementAttribute('.nav-info .load__more--next', 'disabled'), 'disabled', 'Load next button is disabled for last page');
        this.test.assertVisible('.output__container', 'Output container is visible for last page');
    });

    // Test cases for "Instructions" functionality
    casper.thenClick('.nav__container .instructions', function () {
        this.echo('\n');
        this.echo('Test the functionalities around Instructions');
        this.echo('--------------------------------------------');
        this.test.assertVisible('.lightbox .lightbox__container', 'Clicking the Instructions button opens lightbox container.');
        this.test.assertMatch(this.getHTML('.lightbox .lightbox__container .lightbox__content h3'), /^Instructions$/g, 'The lightbox contains instructions on how to use the application.');
        this.test.assertVisible('.lightbox .lightbox__container .lightbox--close', 'The lightbox has a close button to close the instructions.');
        this.thenClick('.lightbox .lightbox__container .lightbox--close', function () {
            this.test.assertNotVisible('.lightbox .lightbox__container', 'Clicking the close button closes the lightbox container.');
        });
    });

    casper.run(function () {
        this.test.done();
        this.test.renderResults(true);
    });
});