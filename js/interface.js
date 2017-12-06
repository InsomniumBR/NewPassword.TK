isNumbersAppearing = true;
function showNumbersSpot() {
    document.getElementById("addNumbersLocation").style.display = '';
    isNumbersAppearing = true;
    $("#checkboxNumbers").bootstrapToggle("on");
}

function hideNumberSpot() {
    document.getElementById("addNumbersLocation").style.display = 'none';
    isNumbersAppearing = false;
    $("#checkboxNumbers").bootstrapToggle("off");
}


function symbolChange() {
    var isChecked = document.getElementById("checkboxSymbol").checked;
    if (isChecked)
        document.getElementById("hidenSymbolsMenu").style.display = '';
    else {
        document.getElementById("hidenSymbolsMenu").style.display = 'none';
        if (!isNumbersAppearing)
            showNumbersSpot();
    }
    $("#radioSymbolUserDefined").prop("checked", true);
}
function radioChange() {
    var isChecked = $("#radioSymbolUserDefined").is(":checked");
    if (isChecked) {
        document.getElementById("addSymbolsInput").disabled = false;
        showNumbersSpot();
    }
    else {
        document.getElementById("addSymbolsInput").disabled = true;
        hideNumberSpot();
    }
}
function storeData() {
    localStorage.setItem('hasData', true);
    localStorage.setItem('capitalizationOption', document.getElementById('capitalizationSelect').value);
    localStorage.setItem('numbersQuantity', parseInt(document.getElementById("addNumbersInput").value));
    localStorage.setItem('generateWithSymbols', document.getElementById("checkboxSymbol").checked);
    localStorage.setItem('symbolsScheme', parameters.generateWithSymbols ? document.querySelector('input[name=radioSymbol]:checked').value : null);
    localStorage.setItem('symbolsToAdd', document.getElementById("addSymbolsInput").value);
    localStorage.setItem('generateWithNumbers', document.getElementById("checkboxNumbers").checked);
    localStorage.setItem('WN_minLength', parseInt(document.getElementById("lengthFrom").value));
    localStorage.setItem('WN_maxLength', parseInt(document.getElementById("lengthTo").value));
    localStorage.setItem('WN_limit', parseInt(document.getElementById("wordQuantity").value));
}

function retrieveData() {
    document.getElementById('capitalizationSelect').value = localStorage.getItem('capitalizationOption');
    document.getElementById('addNumbersInput').value = localStorage.getItem('numbersQuantity');
    localStorage.getItem('generateWithSymbols') === "true" ? $("#checkboxSymbol").bootstrapToggle("on") : $("#checkboxSymbol").bootstrapToggle("off");
    symbolChange();
    document.getElementById('addSymbolsInput').value = localStorage.getItem('symbolsToAdd');
    localStorage.getItem('generateWithNumbers') === "true" ? $("#checkboxNumbers").bootstrapToggle("on") : $("#checkboxNumbers").bootstrapToggle("off");
    document.getElementById('lengthFrom').value = localStorage.getItem('WN_minLength');
    document.getElementById('lengthTo').value = localStorage.getItem('WN_maxLength');
    document.getElementById('wordQuantity').value = localStorage.getItem('WN_limit');
    if (localStorage.getItem('symbolsScheme') === 'userDefined')
        document.getElementById('radioSymbolUserDefined').checked = true;
    else if (localStorage.getItem('symbolsScheme') === 'systemDefined')
        document.getElementById('radioSymbolSystemDefined').checked = true;
    radioChange();
}

$(document).ready(function () {
    document.getElementById("hidenSymbolsMenu").style.display = 'none';
    if (localStorage.getItem('hasData'))
        retrieveData();

    $("#checkboxSymbol").change(function () { symbolChange(); });

    $("#checkboxNumbers").change(function () { document.getElementById("addNumbersInput").disabled = !document.getElementById("checkboxNumbers").checked; });

    $("#radioSymbolUserDefined").change(function () { radioChange(); });
    $("#radioSymbolSystemDefined").change(function () { radioChange(); });

});