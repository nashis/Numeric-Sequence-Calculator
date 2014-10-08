require.config({
    'baseUrl': 'js/libs',
    'paths': {
        'app': '../app',
        'jasmine': 'jasmine/jasmine',
        'jasmineHtml': 'jasmine/jasmine-html'
    },
    shim: {
        'jasmineHtml': {
            deps: ['jasmine']
        }
    }
});

require([
    'jasmine',
    'jasmineHtml',
    'app/model/seqcalcmodel'
], function() {
    describe('Numeric Sequence Calculator', function() {
        /*
         * Test cases related to 'isPositiveInteger' method
         */
        it('isPositiveInteger method should be implemented', function() {
            expect(seqCalc.isPositiveInteger).toBeDefined();
        });

        it('isPositiveInteger method should return true for integer values', function() {
            expect(seqCalc.isPositiveInteger(5)).toBe(true);
        });

        it('isPositiveInteger method should return true for string values that converts to a valid integer', function() {
            expect(seqCalc.isPositiveInteger('123')).toBe(true);
        });

        it('isPositiveInteger method should return false for any other case', function() {
            expect(seqCalc.isPositiveInteger('a5')).toBe(false);
        });

        /*
         * Test cases related to 'generateSequence' method
         */
        var seqData = seqCalc.generateSequence(12, 21)
                , noOfSeq = 5
                , seqKeys = Object.keys(seqData)
                ;

        it('generateSequence method should be implemented', function() {
            expect(seqCalc.generateSequence).toBeDefined();
        });

        it('generateSequence method should return an object of arrays matching the number of sequences', function() {
            expect(seqData).toEqual(jasmine.any(Object));

            var len = seqKeys.length;
            expect(len).toEqual(noOfSeq);

            while (--len > 0) {
                if (seqData.hasOwnProperty(seqKeys[len])) {
                    expect(seqData[seqKeys[len]]).toEqual(jasmine.any(Array));
                }
            }
        });

        it('generateSequence method should return all numbers as the first sequence array', function() {
            expect(seqData[seqKeys[0]]).toEqual([12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);
        });

        it('generateSequence method should return all odd numbers as the second sequence array', function() {
            expect(seqData[seqKeys[1]]).toEqual([13, 15, 17, 19, 21]);
        });

        it('generateSequence method should return all even numbers as the third sequence array', function() {
            expect(seqData[seqKeys[2]]).toEqual([12, 14, 16, 18, 20]);
        });

        it('generateSequence method should return all custom numbers as the fourth sequence array', function() {
            expect(seqData[seqKeys[3]]).toEqual(['C', 13, 14, 'Z', 16, 17, 'C', 19, 'E', 'C']);
        });

        it('generateSequence method should return all fibonacci numbers as the fifth sequence array', function() {
            expect(seqData[seqKeys[4]]).toEqual([13, 21]);
        });
    });

    // load jasmine htmlReporter
    (function() {
        var env = jasmine.getEnv();
        env.addReporter(new jasmine.HtmlReporter());
        env.execute();
    }());

});