var seqCalc = (function(mod) {

    /**
     * Summary check if given value is in positive integer format or not
     * 
     * @returns {unresolved}
     */
    mod.isPositiveInteger = function(valToCheck) {
        var retVal = false;
        switch (typeof valToCheck) {
            case 'number':
                retVal = (valToCheck === parseInt(valToCheck)) && (valToCheck > 0);
                break;
                
            case 'string':
                retVal = (valToCheck.match(/^[1-9]\d*$/) !== null);
                break;
                
            default :
                // Do nothing
                break;
        }
        
        return retVal;
    }

    /**
     * Summary Generates following numeric sequences, between a start number and end number
     *          01. All numbers including the end number
     *          02. All odd numbers including the end number
     *          03. All even numbers including the end number
     *          04. All numbers, but "C", "E", "Z" for numbers divisible by 3, 5, and 15 respectively
     *          05. All fibonacci numbers up-to and including the end number
     * 
     * @param {Number} startIdx
     * @param {Number} endIdx
     * @returns {Object} object with array elements for each sequence
     */
    mod.generateSequence = function(startIdx, endIdx) {
        //console.time('processLoop');
        var tempFibonacciNum = 0
                , calcFibonacci = true
                , lastFibonacciNum = 0
                , currFibonacciNum = 1
                , allNumbers = []
                , oddNumbers = []
                , evenNumbers = []
                , customNumbers = []
                , fibonacciNumbers = []
                ;
        ;

        // It makes more sense to load all the data in single iteration
        // This makes more sense than having five different methods for five sequences
        // As performance would be an issue when we have to traverse and work with larger array objects
        for (var cnt = startIdx; cnt <= endIdx; cnt++) {
            allNumbers.push(cnt);
            if (cnt % 2 === 0) {
                evenNumbers.push(cnt);
            } else {
                oddNumbers.push(cnt);
            }

            if (cnt % 15 === 0) {
                customNumbers.push('Z');
            } else if (cnt % 5 === 0) {
                customNumbers.push('E');
            } else if (cnt % 3 === 0) {
                customNumbers.push('C');
            } else {
                customNumbers.push(cnt);
            }

            tempFibonacciNum = lastFibonacciNum + currFibonacciNum;
            if (calcFibonacci) {
                while (tempFibonacciNum < startIdx) {
                    lastFibonacciNum = currFibonacciNum;
                    currFibonacciNum = tempFibonacciNum;
                    tempFibonacciNum = lastFibonacciNum + currFibonacciNum;
                }

                calcFibonacci = false;
            }

            if (tempFibonacciNum <= endIdx) {
                fibonacciNumbers.push(tempFibonacciNum);
                lastFibonacciNum = currFibonacciNum;
                currFibonacciNum = tempFibonacciNum;
            }
        }
        //console.timeEnd('processLoop');

        return {allNumbers: allNumbers, oddNumbers: oddNumbers, evenNumbers: evenNumbers, customNumbers: customNumbers, fibonacciNumbers: fibonacciNumbers};
    }

    return mod;

}(seqCalc || {}));