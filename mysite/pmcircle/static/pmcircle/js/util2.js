function createLoadCase(){
  var existLoadCase = parseInt($("#userData tr:last-child td:first-child").text());
  var newLoadCase = existLoadCase + 1;
  var firstNode = "<td>" + newLoadCase + "</td>";
  var otherNode = '<td><input type="number" name="" value= "0.0" ></td>'+
                  '<td><input type="number" name="" value= "0.0" ></td>'+
                  '<td><a href="javascript:void(0);" title = "Remove Load Case" class="remove"><i class="fas fa-times d-print-none"></i></a></td>';
 var trHtml = firstNode + otherNode;
 var node = $("#userData").append('<tr></tr>');
 $("#userData tr:last-child").html(trHtml);
}

function removeLoadCase(){
  if ($("#userData tr").length>1) {
     var target = ("#userData tr:last-child");
    $(target).fadeOut(100, function(){$(target).remove();});
  }
}

//function to grab input and return reinforcement arrays for circular section
function reinfCirArray(){
  var BarArea = [0.11, 0.20, 0.31, 0.44, 0.60, 0.79, 1.0, 1.27, 1.56, 2.25, 4];
  var BarDia = [0.375, 0.5, 0.625, 0.75, 0.875, 1.0, 1.128, 1.27, 1.41, 1.693, 2.257];
  var dsArray = []; var AsArray = []; var nBarsArray = [];
  var clCover = parseFloat($("#rc").val());
  var tBarSize = parseInt(d3.select("#ts").node().value);
  var tBarDia = BarDia[tBarSize];
  var mBarSize = parseInt(d3.select("#bs").node().value);
  var mBarDia = BarDia[mBarSize];
  var mBarArea = BarArea[mBarSize];
  var rCover = clCover + tBarDia + 0.5*mBarDia;
  sDia = parseFloat($("#di").val()); //make global variable
  var inDia = sDia - 2*rCover;
  var nBars = parseFloat($("#nb").val());
  nLayers = Math.ceil(0.5*nBars); //make global variable
  var theta = 2*Math.PI/nBars;
  Ag = 0.25*Math.PI*sDia*sDia; //make global variable

  // generate no. of bars array and ds array
  if (nBars % 2 == 0) { // if even
    nBarsArray = [];
    dsArray = [];
    AsArray = [];
    for (var i = 0; i < nLayers; i++) {
      nBarsArray.push(2);
      dsArray.push(0.5*(sDia - inDia*Math.cos((i+0.5)*theta)));
      AsArray.push(2*mBarArea);
    }
  }
  else {
    nBarsArray = [1];
    dsArray = [rCover];
    AsArray = [mBarArea];
    for (var i = 0; i < (nLayers-1); i++) {
      nBarsArray.push(2);
      dsArray.push(0.5*(sDia - inDia*Math.cos((i+1)*theta)));
      AsArray.push(2*mBarArea);
    }
  }

  return [dsArray, AsArray];
}

reinfCirArray();

//function to create a single (P,M) point for a given value of z
function pmCirPoint(z){

  var FsArray = []; var MArray = [];
  var strain = [];
  var Ast, c_value, a_value, phi, phiPn, phiMn, Balance, fy, Ec, b;
  var rfArray = reinfCirArray();

  var fc = parseFloat($("#fc").val());
  Beta_1 = (fc > 4) ? (Math.max(0.85-(fc-4)*0.05, 0.65)) : (0.85); //globale variable
  // b = parseFloat($("#wt").val());
  fy = parseFloat($("#fy").val());
  Ec = parseFloat($("#E").val());
  var tReinf = parseInt(d3.select("#tie").node().value);
  var designCode = parseInt(d3.select("#code").node().value);
  Ast = rfArray[1].reduce((a, b) => a + b, 0); // summation & global

  var ds_max = Math.max.apply(Math, rfArray[0]);
  c_value = (0.003*ds_max)/(0.003-z*fy/Ec);
  a_value = Math.min(c_value*Beta_1,sDia);
  //angle subtended by compressive block chord
  var cTheta = Math.acos(1 - 2*a_value/sDia);
  var Ac = 0.25*sDia*sDia*(cTheta - Math.sin(cTheta)*Math.cos(cTheta));
  var AcY = Math.pow(sDia, 3)*Math.pow(Math.sin(cTheta),3)/12;

  for (var i = 0; i < nLayers; i++) {

    var TorC = (c_value > rfArray[0][i]) ? (-1):(1);
    var lessThanA = (rfArray[0][i] <= a_value) ? (1):(0);
    var epsilon = ((rfArray[0][i]/c_value)*TorC-TorC)*0.003;
    strain.push(epsilon);
    var fs = Math.min(60, epsilon*Ec)*TorC;
    var F_s = rfArray[1][i]*(fs + 0.85*fc*lessThanA);
    FsArray.push(F_s);
    var SteelMoment = F_s*(rfArray[0][i]-0.5*sDia)/12; // about center
    MArray.push(SteelMoment);
  }

   var Tension = FsArray.reduce((a, b) => a + b, 0); //sum of all
   var Compression = 0.85*fc*Ac;
   Balance = Tension-Compression;
   var tensileStrain = strain[rfArray[0].indexOf(ds_max)];

   if (tensileStrain <= 0.002069) {
     phi = (tReinf == 1 && designCode == 1) ? (0.65) : (0.75);
   }
   else if (tensileStrain >= 0.005) {
     phi = 0.90;
   }

   else {
     phi = (tReinf == 1 && designCode == 1) ? (0.65+0.25*(tensileStrain-0.002069)/0.003) : (0.75+0.15*(tensileStrain-0.002069)/0.003);
   }

   phiPn = -1*phi*Balance;
   var sumM = MArray.reduce((a, b) => a + b, 0);
   phiMn = phi*(sumM + 0.85*fc*AcY/12);

   var phiPn_zero = (tReinf == 1 && designCode == 1) ? (0.65*(0.85*fc*(Ag-Ast)+fy*Ast)) : (0.75*(0.85*fc*(Ag-Ast)+fy*Ast));
   phiPnMax = (tReinf == 1) ? (0.80*phiPn_zero):(0.85*phiPn_zero); //global

   return [phiMn, phiPn];
}

//function to get load case data and return into obeject of x and y arrays for plotly
function loadCaseCirData(){
  var Pu = []; var Mu = []; var textArray = [];
  var PuData, MuData, textData;

  for (var i = 0; i < $("#userData tr").length; i++) {

    var PuData = parseFloat($("#userData tr td:nth-child(2) input")[i].value);
    var MuData = parseFloat($("#userData tr td:nth-child(3) input")[i].value);
    var textData = parseInt($("#userData tr td:nth-child(1)").text()[i]);

    Pu.push(PuData);
    Mu.push(Math.abs(MuData));
    textArray.push(textData);
  }

  return {x: Mu, y: Pu, t: textArray};
}

//function to generate an array of (M,P) points for given z arrays
function genCirData (){

  var z_data = [1.0, 0.5, 0.25, 0.125, 0, -0.25, -0.5, -0.75, -1, -1.5, -2, -2.5, -3.25, -4, -6, -8, -10, -12, -16, -100000];
  var pmData = [];
  var usablePlotPx = []; // positive x

  for (var i = 0; i < z_data.length; i++) {
    var pmDataPoint = pmCirPoint(z_data[i]);
    pmData.push(pmDataPoint);
//create usable plot data for positive x axis
    if (pmDataPoint[1] <= phiPnMax && pmDataPoint[1] >= 0) {
      usablePlotPx.push(pmDataPoint);
    }
  }

  console.log(pmData);

  return {
    pmCurve: pmData,
    PnMax: phiPnMax,
    usePx: usablePlotPx,
        };

}

//function to fill up calculated parameters
function calcParam(){
  sDia = parseFloat($("#di").val()); //make global variable
  Ag = 0.25*Math.PI*sDia*sDia; //make global variable
  Ig = Math.PI*Math.pow(sDia, 4)/64;
  var BarArea = [0.11, 0.20, 0.31, 0.44, 0.60, 0.79, 1.0, 1.27, 1.56, 2.25, 4];
  var mBarSize = parseInt(d3.select("#bs").node().value);
  var mBarArea = BarArea[mBarSize];
  var nBars = parseFloat($("#nb").val());
  var As = nBars*mBarArea;

  $('#Ag span').text(Math.round(Ag*100)/100 + " sq.in");
  $('#Ig span').html(Math.round(Ig*10)/10 + " in" + ("4").sup());
  $('#As span').html(Math.round(As*100)/100 + " in" + ("2").sup());

  var fc = parseFloat($("#fc").val());
  Beta_1 = (fc > 4) ? (Math.max(0.85-(fc-4)*0.05, 0.65)) : (0.85); //globale variable
  $('#beta').text("\u03B2" + "1" + " = " + Math.round(Beta_1*100)/100);

}

//uppdate calculated parameters on the page
$(document).ready(function() {
  calcParam();

  $("#inputLoad").hide();

  $("#di,#fc,#nb,#bs").each(function(){
    $(this).change(function() {
      calcParam();
    });
});

    $('#calculate').click(function(){
        // $('#beta').text("\u03B2" + "1" + " = " + Math.round(Beta_1*100)/100);
        $("#inputLoad").show();
    });

});
