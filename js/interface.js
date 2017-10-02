isNumbersAppearing = true;
function showNumbersSpot(){
	$("#addNumbersLocation").show();
	isNumbersAppearing = true;
	$("#checkboxNumbers").bootstrapToggle("on");
	}

function hideNumberSpot(){
	$("#addNumbersLocation").hide();
	isNumbersAppearing = false;	
	$("#checkboxNumbers").bootstrapToggle("off");
}

$(document).ready(function() {
	$("#hidenSymbolsMenu").hide();
	//On checkbox click, in case of turning on, show the symbols menu.
	//In case of turning off, hide the symbols menu, and show the numbers option
	$("#checkboxSymbol").change(function () {
        var isChecked = $("#checkboxSymbol").is(":checked");
		if (isChecked){
			$("#hidenSymbolsMenu").show();
					}
		else{
			$("#hidenSymbolsMenu").hide();
			if (!isNumbersAppearing){
				showNumbersSpot();
			}
			}
        $("#radioSymbolUserDefined").prop("checked", true);

	});
	
	
    $("#checkboxNumbers").change(function () {
        $("#addNumbersInput").prop("disabled", !$("#checkboxNumbers").is(":checked"));
        //$("#addNumbersInput").val($("#checkboxNumbers").is(":checked") ? 2 : null)
	});	
	
    $("#radioSymbolUserDefined").change(function () {
		var isChecked = $("#radioSymbolUserDefined").is(":checked");
		if (isChecked){
			$("#addSymbolsInput").prop("disabled", false);
			showNumbersSpot();
			}
	});
	
	$("#radioSymbolSystemDefined").change(function () {
		var isChecked = $("#radioSymbolSystemDefined").is(":checked");
		if (isChecked){
			$("#addSymbolsInput").prop("disabled", true);
			hideNumberSpot();
		}
			
	});
	
});