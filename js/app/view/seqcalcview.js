require.config({
    'baseUrl': 'js/libs',
    'paths': {
        'app': '../app',
        'jquery': 'jquery/jquery',
        'mustache': 'mustache/mustache',
        'bootstrap': 'bootstrap/js/bootstrap'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        }
    }
});

require([
    'jquery',
    'mustache',
    'bootstrap',
    'app/model/seqcalcmodel'
], function (jQuery, Mustache, Bootstrap, seqCalcModel) {

// Define all global properties here
    var lightbox = null
            , processCnt = 100000
            , totalCnt = 0
            , globalCnt = 1
            , doc = $(document)
            ;

// This should be part of some global.js file, so that localization becomes eaiser
    var data = {
        instructions: '<div class="panel panel-default panel-primary">\
                        <div class="panel-heading"><h3 class="panel-title">Instructions</h3></div>\
                        <div class="panel-body">You could use this application to generate numeric sequences.</div>\
                        <div class="panel-body">To generate numeric sequences, enter a positive whole number in the text box provided and click on the <code>Generate</code> button or press enter.</div>\
                        <div class="panel-body">For larger numbers, result set is paged and you could navigate between pages using the buttons marked with <code><</code> and <code>></code></div>\
                        <div class="panel-body">You could collapse any sequence list by clicking on it\'s title.</div>\
                    </div>',
        templates: {
            fullResult: '<div class="panel panel-default panel-primary">\
                        <div class="panel-heading"><h3 class="panel-title">\
                            <a data-toggle="collapse" data-target="#collapse{{num}}" href="#collapse{{num}}">{{title}}</a>\
                        </div>\
                        <div id="collapse{{num}}" class="panel-collapse collapse in">\
                            <div class="panel-body result--group">{{content}}</div>\
                        </div>\
                    </div>',
            partialResult: '{{content}}'
        },
        errorMessages: {
            ipMissError: 'Please enter a number first.',
            ipOverflowError: 'The maximum allowable positive integer value is: ' + Number.MAX_SAFE_INTEGER,
            ipTypeError: 'Please enter a positive whole number, like 1, 2, 3, 4 etc.'
        }
    };


    /**
     * 
     * Define all private methods here
     * 
     */

    /**
     * Summary Check and hide lightbox on pressing ESC
     * @TODO This should work on lightbox alone and should not be attached to the document
     * 
     * @param {Event} keypress event object
     * @returns {undefined}
     */
    function _onKeyDown(e) {
        if (e.which === 27) {
            _hideLightbox();
        }
    }

    /**
     * Summary Show the instructions
     * 
     * @returns {undefined}
     */
    function __showInstructions() {
        _showLightbox(data.instructions);
    }

    /**
     * Summary Show the lightbox with the information passed
     * 
     * @param {String} markup
     * @returns {undefined}
     */
    function _showLightbox(markup) {
        if (lightbox) {
            if (lightbox.hasClass('hide')) {
                lightbox.removeClass('hide', 500);
            }

            $('.lightbox__content').html(markup);
            $("body").addClass("modal-open");
            lightbox.addClass('show', 1000);
        }
    }

    /**
     * Summary Hide the lightbox if it is displayed currently
     * 
     * @returns {undefined}
     */
    function _hideLightbox() {
        if (lightbox && lightbox.hasClass('show')) {
            lightbox.removeClass('show').addClass('hide', 500);
            $("body").removeClass("modal-open");
        }
    }

    /**
     * Summary Display error container with the error message passed
     * 
     * @param {String} errMsg
     * @returns {undefined}
     */
    function _showError(errMsg) {
        if (!userInput.hasClass('input--error') || errMsg !== errCont.text()) {
            userInput.addClass('input--error');
            errText.html(errMsg);
            errCont.removeClass('hide').addClass('show');
        }
    }

    /**
     * Summary Hide the error container if it is displayed currently
     * 
     * @returns {undefined}
     */
    function _hideError() {
        if (userInput.hasClass('input--error')) {
            userInput.removeClass('input--error');
            errText.html('');
            errCont.removeClass('show').addClass('hide');
        }
    }

    /**
     * Summary Show the information conatiner with the information message passed
     * 
     * @param {String} infoMsg
     * @returns {undefined}
     */
    function _showInfo(infoMsg) {
        if (!infoCont.hasClass('hide') || infoMsg !== infoCont.text()) {
            infoText.html(infoMsg);
            infoCont.removeClass('hide').addClass('show');
        }
    }

    /**
     * Summary Hide the information container if it is displayed currently
     * 
     * @returns {undefined}
     */
    function _hideInfo() {
        if (infoCont.hasClass('show')) {
            infoCont.removeClass('show').addClass('hide');
        }
    }

    /**
     * Summary Show the loading container when calculation is being performed
     * 
     * @returns {undefined}
     */
    function _showLoading() {
        loadCont.removeClass('hide').addClass('show');
    }

    /**
     * Summary Hide the loading container if it is displayed currently
     * 
     * @returns {undefined}
     */
    function _hideLoading() {
        loadCont.removeClass('show').addClass('hide');
    }

    /**
     * 
     * Define all public methods here
     * 
     */

    /**
     * Summary Check for user input and show error message if input is not correct
     * 
     * @param {Event} e
     * @returns {undefined}
     */
    function checkShowError(e) {
        var userVal = userInput.val().trim();

        if (userVal.length > 0) {
            if (!seqCalc.isPositiveInteger(userVal)) {
                genBttn.attr('disabled', 'disabled');
                return _showError(data.errorMessages.ipTypeError)
            } else if (!Number.isSafeInteger(parseInt(userVal))) {
                genBttn.attr('disabled', 'disabled');
                return _showError(data.errorMessages.ipOverflowError);
            }

            genBttn.removeAttr('disabled');
        } else {
            genBttn.attr('disabled', 'disabled');
        }

        if (e.which === 13) {
            if (userVal.length === '') {
                genBttn.attr('disabled', 'disabled');
                return _showError(data.errorMessages.ipMissError);
            }
            return generateSequences();
        }

        _hideError();
    }

    /**
     * Summary Load previous numeric sequences
     * 
     * @param {Event} e
     * @returns {undefined}
     */
    function loadPrevSequence(e) {
        loadMore.attr('disabled', 'disabled');
        e.preventDefault();
        globalCnt = globalCnt - (2 * processCnt);
        if (globalCnt < 1) {
            globalCnt = 1;
        }

        generateSequence(false);
    }

    /**
     * Summary Load previous numeric sequences
     * 
     * @param {Event} e
     * @returns {undefined}
     */
    function loadNextSequence(e) {
        loadMore.attr('disabled', 'disabled');
        e.preventDefault();
        generateSequence(false);
    }

    /**
     * Summary Responsible for initiating the generation of numeric sequences
     * 
     * @returns {undefined}
     */
    function generateSequences() {
        init();
        totalCnt = parseInt(userInput.val());
        _showLoading();
        generateSequence(true);
    }

    /**
     * Summary Actula logic that generates the following sequences
     *          01. All numbers including the number
     *          02. All odd numbers including the number
     *          03. All even numbers including the number
     *          04. All numbers, but "C", "E", "Z" for numbers divisible by 3, 5, and 15 respectively
     *          05. All fibonacci numbers up-to and ncluding the number
     * 
     * @returns {undefined}
     */
    function generateSequence(firstLoad) {
        var userVal = userInput.val().trim(),
                contentData = '',
                seqData = null
                ;

        if (seqCalc.isPositiveInteger(userVal)) {
            userVal = parseInt(userVal);
            seqData = seqCalc.generateSequence(globalCnt, ((totalCnt - globalCnt > processCnt) ? (globalCnt + processCnt - 1) : totalCnt));
            globalCnt += processCnt;

            // This is for large inputs, where we decide to break output based on value given
            // Give user some kind of informtaion so that he is not confused
            if (!(firstLoad && globalCnt > totalCnt)) {
                infoText.html('Showing numeric sequences between ' + (globalCnt - processCnt) + ' to ' + (globalCnt > totalCnt ? totalCnt : (globalCnt - 1)));
                if (infoCont.hasClass('hide')) {
                    infoCont.removeClass('hide').addClass('show');
                }
            } else {
                if (infoCont.hasClass('show')) {
                    infoCont.removeClass('show').addClass('hide');
                }
            }

            // Logic to generate the markup for the sequence that generates all numbers i.e. sequence 01
            //console.time('allNumberSequence');
            contentData = seqData.allNumbers.join(', ');
            if (firstLoad) {
                opCont.append(Mustache.to_html(data.templates.fullResult, {num: 1, title: 'Sequence 1: All Numbers', content: contentData}));
            } else {
                $('#collapse1 .panel-body').html(Mustache.to_html(data.templates.partialResult, {content: contentData}));
            }
            //console.timeEnd('allNumberSequence');

            // Logic to generate the markup for the sequence that generates all odd numbers i.e. sequence 02
            //console.time('oddNumberSequence');
            contentData = seqData.oddNumbers.join(', ');
            if (firstLoad) {
                opCont.append(Mustache.to_html(data.templates.fullResult, {num: 2, title: 'Sequence 2: Odd Numbers', content: contentData}));
            } else {
                $('#collapse2 .panel-body').html(Mustache.to_html(data.templates.partialResult, {content: contentData}));
            }
            //console.timeEnd('oddNumberSequence');

            // Logic to generate the markup for the sequence that generates all even numbers i.e. sequence 03
            //console.time('evenNumberSequence');
            contentData = seqData.evenNumbers.join(', ');
            if (firstLoad) {
                opCont.append(Mustache.to_html(data.templates.fullResult, {num: 3, title: 'Sequence 3: Even Numbers', content: contentData}));
            } else {
                $('#collapse3 .panel-body').html(Mustache.to_html(data.templates.partialResult, {content: contentData}));
            }
            //console.timeEnd('evenNumberSequence');

            // Logic to generate the markup for the sequence that generates custom numbers i.e. sequence 04
            //console.time('customNumberSequence');
            contentData = seqData.customNumbers.join(', ');
            if (firstLoad) {
                opCont.append(Mustache.to_html(data.templates.fullResult, {num: 4, title: 'Sequence 4: Custom Numbers', content: contentData}));
            } else {
                $('#collapse4 .panel-body').html(Mustache.to_html(data.templates.partialResult, {content: contentData}));
            }
            //console.timeEnd('customNumberSequence');

            // Logic to generate the markup for the sequence that generates all fibonacci numbers i.e. sequence 05
            //console.time('fibonacciNumberSequence');
            contentData = seqData.fibonacciNumbers.join(', ');
            if (firstLoad) {
                opCont.append(Mustache.to_html(data.templates.fullResult, {num: 5, title: 'Sequence 5: Fibonacci Numbers', content: contentData}));
            } else {
                $('#collapse5 .panel-body').html(Mustache.to_html(data.templates.partialResult, {content: contentData}));
            }
            //console.timeEnd('fibonacciNumberSequence');
        } else {
            _showError(data.errorMessages.ipTypeError);
        }

        loadMore.removeAttr('disabled');
        if (globalCnt > totalCnt) {
            loadNext.attr('disabled', 'disabled');
        } else if (globalCnt === processCnt + 1) {
            loadPrev.attr('disabled', 'disabled');
        }
        setTimeout(_hideLoading);
    }

    /**
     *
     *  Actual application logic goes here 
     *
     */

    /**
     * Summary Initialize all the properties required for the functioning of the module
     * 
     * @returns {undefined}
     */
    function init() {
        totalCnt = 0;
        globalCnt = 1;
        opCont.html('');
    }

    doc.ready(function () {
        // initialize all DOM objects to be manipulated
        ipCont = $('.input__container');
        opCont = $('.output__container');
        errCont = $('.error__container');
        errText = $('.error__text');
        infoCont = $('.info__container');
        infoText = $('.info__text');
        loadMore = $('.load__more');
        loadPrev = $('.load__more--prev');
        loadNext = $('.load__more--next');
        loadCont = $('.loading__container');
        userInput = $('#user__input');
        lightbox = $('.lightbox');
        genBttn = ipCont.find('button');

        // initialize all UI
        userInput.focus();
        //genBttn.attr('disabled', 'disabled');

        // register all events here
        loadPrev.on('click', loadPrevSequence);
        loadNext.on('click', loadNextSequence);
        $('.nav__container').on('click', '.instructions', __showInstructions);
        $('.lightbox--close').on('click', _hideLightbox);
        ipCont.on('keyup', 'input', checkShowError);
        ipCont.on('click', 'button', generateSequences);
    });
});