var parameters = {};

/**
 * /
 * @param {string} word Word to randomically capitalize.
 * @returns {string} Word randomically capitalized. 
 */
 //#region randomize
function randomizeCapitalization(word) {
    for (i = 0; i < word.length; i++) {
        if (Math.random() > 0.5)
            //In 50% of cases, randomically capitalize one letter
            word = word.substring(0, i) + word[i].toUpperCase() + word.substring(i + 1);
    }
    return word;
}

/**
 * /
 * @param {Array} oldArray Array to shuffle
 * @returns {Array} Shuffled array
*/
function randomizeArray(oldArray) {
    var newArray = [];
    for (i = 0; i < oldArray.length; i = 0) {
        var randomPosition = Math.floor(Math.random() * oldArray.length);
        newArray.push(oldArray[randomPosition]);
        oldArray.splice(randomPosition, 1);
    }
    return newArray;
}

//#endregion
//#region getData
function getParameters() {
    parameters = {};
    parameters.capitalizationOption = $("#capitalizationSelect").val();
    parameters.numbersQuantity = parseInt($("#addNumbersInput").val());
    parameters.generateWithSymbols = $("#checkboxSymbol").is(":checked");
	parameters.symbolsScheme = parameters.generateWithSymbols ? $('input[name=radioSymbol]:checked').val() : null;
    parameters.symbolsToAdd = parameters.symbolsScheme === "userDefined" ? $("#addSymbolsInput").val().split(",") : null;
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
        apiUrl: "https://api.wordnik.com/v4/words.json/randomWords",
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
//#endregion

//#region generate
function generateWord(generateAddSymbols) {
    //Mount the URL based on parameters
    var requestUrl = getWordnikUrl(parameters.wordnikParameters);
    $.ajax({
        url: requestUrl,
        cache: false,
        success: function (data) {
            if (data.length !== 0) {
                generatedWords.push(generateCapitalization(parameters.capitalizationOption, data[0].word));
				currentPassword === undefined ? currentPassword = generatedWords[generatedWords.length - 1] : currentPassword+=generatedWords[generatedWords.length - 1];
                if (generateAddSymbols)
					generateAddSymbols();
            }
        }
    });
}

function generateAddSymbols(){
	if (parameters.symbolsScheme === "userDefined" || !parameters.generateWithSymbols)
		symbolsUserDefined();
	else if (parameters.symbolsScheme === "systemDefined"){
		symbolsSystemDefined();		
		}
}

/**
 * /
 * @param {string} capitalizationOption How the word will be capitalized, upper, camelcase, random, or lower.
 * @param {string} word The word to capitalize
 * @returns {string} The word in the chosen capitalization
 */
function generateCapitalization(capitalizationOption, word) {
    capitalizationOption = capitalizationOption.toLowerCase();
    word = word.toLowerCase();
    switch (capitalizationOption) {
        case "upper":
            return word.toUpperCase();
        case "camelcase":
            return word[0].toUpperCase() + word.substring(1);
        case "random":
            return randomizeCapitalization(word);
        default:
            return word;
    }
}

/**
* @param {number} howMany The quantity of numbers to generate
* @returns {number} The randomized number
 */
function generateNumber(howMany) {
    var numbers = "";
    for (i = 0; i < howMany; i++) {
        numbers += Math.floor(Math.random() * 10);
    }
    return numbers;
}

function generatePassword() {
    currentPassword = "";
    $("#generatedContent").text("Generating password...");
    generatedWords = [];
    getParameters();
    if (parameters.wordnikParameters.limit > 0) {
        for (i = 0; i < parameters.wordnikParameters.limit; i++) {
            generateWord(generateAddSymbols);
        }
    }
    else {
        generateAddSymbols();
    }
}

//#endregion

//#region symbols
function symbolsUserDefined() {
	var symbolsToAdd = [];
    if (generatedWords.length === parameters.wordnikParameters.limit) {

        //Shuffle the symbols
		if (parameters.symbolsToAdd !== null)
			symbolsToAdd = randomizeArray(parameters.symbolsToAdd);
        var wordsWithSymbols = "";
        if (parameters.generateWithSymbols === true) {
            //If there is no words, set password as the symbols array
            if (generatedWords.length === 0) {
                for (i = 0; i < symbolsToAdd.length; i++) {
                    wordsWithSymbols += symbolsToAdd[i];
                    currentPassword = wordsWithSymbols;
                }
            }
            //Get the proportion of words to symbol
            var wordsBySymbols = Math.floor(generatedWords.length / symbolsToAdd.length);
            var symbolsByWords = Math.floor(symbolsToAdd.length / generatedWords.length);
            if (symbolsByWords > wordsBySymbols === true) {
                for (i = 0; i < generatedWords.length; i++) {
                    wordsWithSymbols += generatedWords[i];
                    for (j = 0; j < symbolsByWords; j++) {
                        wordsWithSymbols += symbolsToAdd[0];
                        currentPassword = wordsWithSymbols;
                        symbolsToAdd.splice(0, 1);
                    }

                }
            }
            else if (wordsBySymbols === symbolsByWords) {
                for (i = 0; i < generatedWords.length; i++) {
                    wordsWithSymbols += generatedWords[i];
                    wordsWithSymbols += symbolsToAdd[i];
                    currentPassword = wordsWithSymbols;
                }
            }
            else if (wordsBySymbols > symbolsByWords) {
                for (i = 0; i < generatedWords.length / wordsBySymbols; i++) {
                    for (j = 0; j < wordsBySymbols; j++) {
                        wordsWithSymbols += generatedWords[0];
                        currentPassword = wordsWithSymbols;
                        generatedWords.splice(0, 1);
                    }
                    wordsWithSymbols += symbolsToAdd[i];

                }
            }
        }
        else {
			for (i=0; i<generatedWords.length; i++)
            wordsWithSymbols += generatedWords[i];
            currentPassword = wordsWithSymbols;
        }

        if (parameters.generateWithNumbers === true) {
            wordsWithSymbols += generateNumber(parameters.numbersQuantity);
            currentPassword = wordsWithSymbols;
        }

        $("#generatedContent").html("<b>YOUR PASSWORD:</b><br>" + wordsWithSymbols);
        $("#generatedContent").show();
    }
}

function symbolsSystemDefined() {	
	
	if (generatedWords.length === parameters.wordnikParameters.limit) {
		var wordsWithSymbols = "";
	var keyMap0 = ["a", "A", "E", "o", "O", "l"];
	var keyMap1 = ["@", "4", "3", "0", "0","1"];
	for (j=0; j<generatedWords.length; j++){
		var word = generatedWords[j];
		for (i=0; i<word.length; i++){
			var index = keyMap0.indexOf(word[i]);
			if (index >= 0 && Math.random() >= 0.5){
				wordsWithSymbols += keyMap1[index];
                currentPassword = wordsWithSymbols;
			}
			else{
				wordsWithSymbols+= word[i];
                currentPassword = wordsWithSymbols;
				}
			}
		}

    $("#generatedContent").html("<b>YOUR PASSWORD:</b><br>" + wordsWithSymbols);
    $("#generatedContent").show();
	}
}
//#endregion