var parameters = {};

/**
* @param {number} howMany The quantity of numbers to generate
* @returns {number} 
 */
function generateNumber(howMany) {
    //Create an empty array to add numbers
    var numbers = "";
    //Create a loop to generate x numbers
    for (i = 0; i < howMany; i++) {
        //Put the number in the array
        numbers += Math.floor(Math.random() * 10);
    }
    return numbers;
}

/**
 * /
 * @param {string} word Word to randomically capitalize.
 * @returns {string} Word randomically capitalized. 
 */
function capitalizeOnRandom(word) {
    for (i = 0; i < word.length; i++) {
        if (Math.random() > 0.5)
            //In 50% of cases, randomically capitalize one letter
            word = word.substring(0, i) + word[i].toUpperCase() + word.substring(i + 1);
    }
    return word;
}

/**
 * /
 * @param {string} capitalizationOption How the word will be capitalized, upper, camelcase, random, or lower.
 * @param {string} word The word to capitalize
 * @returns {string} The word in the chosen capitalization
 */
function capitalize(capitalizationOption, word) {
    capitalizationOption = capitalizationOption.toLowerCase();
    word = word.toLowerCase();
    switch (capitalizationOption) {
        case "upper":
            return word.toUpperCase();
        case "camelcase":
            return word[0].toUpperCase() + word.substring(1);
        case "random":
            return capitalizeOnRandom(word);
        default:
            return word;
    }
}

/**
 * /
 * @param {Array} oldArray Array to shuffle
 * @returns {Array} Shuffled array
*/
function shuffleArray(oldArray) {
    //Create an array to store the values from the received array
    var newArray = [];
    for (i = 0; i < oldArray.length; i = 0) {
        //Get one position from 0 to array length
        var randomPosition = Math.floor(Math.random() * oldArray.length);
        //Put the element from random position in the new array
        newArray.push(oldArray[randomPosition]);
        //Remove the element from the old array
        oldArray.splice(randomPosition, 1);
    }
    return newArray;
}

function getParameters() {
    parameters = {};
    parameters.capitalizationOption = $("#capitalizationSelect").val();
    parameters.numbersQuantity = parseInt($("#addNumbersInput").val());
    parameters.symbolsToAdd = $("#addSymbolsInput").val().split(",");
    parameters.generateWithSymbols = $("#checkboxSymbol").is(":checked");
    parameters.generateWithNumbers = $("#checkboxNumbers").is(":checked");
    parameters.wordnikParameters = {
        hasDictionaryDef: "true",
        includePartOfSpeech: "noun",
        minLength: parseInt($("#lengthFrom")[0].value),
        maxLength: parseInt($("#lengthTo")[0].value),
        limit: parseInt($("#wordQuantity")[0].value),
        minCorpusCount: 1,
        maxCorpusCount: -1,
        minDictionaryCount: 1,
        maxDictionaryCount: -1,
        apiUrl: "http://api.wordnik.com:80/v4/words.json/randomWords",
        key: "a7ed8b27e3cc25fb5200c0bb50702461a1decb749750db2f0"
    };
}

/**
 * /
 * @param {Object} wordnikParameters Old wordnik parameters.
 * @returns {string} Wordnik URL
 */
function getWordnikUrl(wordnikParameters) {
    return wordnikParameters.apiUrl
        + "?hasDictionaryDef=" + wordnikParameters.hasDictionaryDef
        + "&includePartOfSpeech=" + wordnikParameters.includePartOfSpeech
        + "&minCorpusCount=" + wordnikParameters.minCorpusCount
        + "&maxCorpusCount=" + wordnikParameters.maxCorpusCount
        + "&minDictionaryCount=" + wordnikParameters.minDictionaryCount
        + "&maxDictionaryCount=" + wordnikParameters.maxDictionaryCount
        + "&minLength=" + wordnikParameters.minLength
        + "&maxLength=" + wordnikParameters.maxLength
        + "&limit=1" /*+ parameters.limit*/
        + "&api_key=" + wordnikParameters.key;
}

function generateWord(addSymbols) {
    //Mount the URL based on parameters
    var requestUrl = getWordnikUrl(parameters.wordnikParameters);
    $.ajax({
        url: requestUrl,
        cache: false,
        success: function (data) {
            if (data.length != 0) {
                //Put the word in the array
                generatedWords.push(capitalize(parameters.capitalizationOption, data[0].word));
                if (addSymbols) addSymbols();
            }
        }
    });
}

function addSymbols() {
    if (generatedWords.length == parameters.wordnikParameters.limit) {

        //Shuffle the symbols
        symbolsToAdd = shuffleArray(parameters.symbolsToAdd);
        //Create an array to store the words with symbols
        var wordsWithSymbols = "";
        if (parameters.generateWithSymbols == true) {
            if (generatedWords.length == 0) {
                for (i = 0; i < symbolsToAdd.length; i++) {
                    wordsWithSymbols += symbolsToAdd[i];
                }
            }
            var wordsBySymbols = Math.floor(generatedWords.length / symbolsToAdd.length);
            var symbolsByWords = Math.floor(symbolsToAdd.length / generatedWords.length);
            if (symbolsByWords > wordsBySymbols == true) {
                for (i = 0; i < generatedWords.length; i++) {
                    wordsWithSymbols += generatedWords[i];
                    for (j = 0; j < symbolsByWords; j++) {
                        wordsWithSymbols += symbolsToAdd[0];
                        symbolsToAdd.splice(0, 1);
                    }

                }
            }
            else if (wordsBySymbols == symbolsByWords) {
                for (i = 0; i < generatedWords.length; i++) {
                    wordsWithSymbols += generatedWords[i];
                    wordsWithSymbols += symbolsToAdd[i];
                }
            }
            else if (wordsBySymbols > symbolsByWords) {
                for (i = 0; i < generatedWords.length / wordsBySymbols; i++) {
                    for (j = 0; j < wordsBySymbols; j++) {
                        wordsWithSymbols += generatedWords[0];
                        generatedWords.splice(0, 1);
                    }
                    wordsWithSymbols += symbolsToAdd[i];

                }
            }
        }
        else {
            wordsWithSymbols += generatedWords;
        }

        if (parameters.generateWithNumbers == true) {
            wordsWithSymbols += generateNumber(parameters.numbersQuantity);
        }

        $("#generatedContent").html("<b>YOUR PASSWORD:</b><br>" + wordsWithSymbols);
        $("#generatedContent").show();
    }
}

function generatePassword() {
    $("#generatedContent").text("Generating password...");
    //Get how the password should be generated
    generatedWords = [];
    getParameters();
    //Generate words based on how many has been requested
    if (parameters.wordnikParameters.limit > 0) {
        for (i = 0; i < parameters.wordnikParameters.limit; i++) {
            generateWord(addSymbols);
        }
    }
    else {
        addSymbols();
    }
}

//#region Events
$(document).ready(function () {
    $("#checkboxSymbol").change(function () {
        var isChecked = $("#checkboxSymbol").is(":checked");
        $("#addSymbolsInput").prop("disabled", !isChecked);
        $("#addSymbolsInput").val(isChecked ? "@,!,-,_,$" : null);
    });
    $("#checkboxNumbers").change(function () {
        var isChecked = $("#checkboxNumbers").is(":checked");
        $("#addNumbersInput").prop("disabled", !isChecked);
        $("#addNumbersInput").val(isChecked ? "7" : null);
    });
})
//#endregion

