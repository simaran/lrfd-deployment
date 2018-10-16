function plotCirPM(){

 var getData = genCirData();
 var getData1 = getData.pmCurve;
 var getData2 = getData.PnMax;
 var getData3 = getData.usePx;
 // console.log(getData2);

 // unpacking data into individual arrays
 a=[]; b=[];

 for(i=0;i<getData1.length;i++) {

    a.push(getData1[i][0]);

    b.push(getData1[i][1]);
  }

var pnMaxPlot = linearI(getData2, b, a); //function as variable, returns array of two
var pnZeroPlot = linearI(0, b, a); // returns array of two
var usablePlotM = [0, pnMaxPlot[0]];
var usablePlotP = [getData2, getData2];

for (var i = 0; i < getData3.length; i++) {
  usablePlotM.push(getData3[i][0]);
  usablePlotP.push(getData3[i][1]);
}

usablePlotM.push(pnZeroPlot[0]);
usablePlotP.push(0);
usablePlotM.push(pnZeroPlot[1]);
usablePlotP.push(0);

 trace1 = { //make global
   x: a,
   y: b,
   mode: 'lines+markers',
   hoverinfo:"x+y",
   cliponaxis: false,
   line: {
   dash: 'dot',
   width: 2,
   color: 'rgb(173, 0, 0)'
 },
 marker:{size:4}
 };

 trace2 = { //make global
   x: usablePlotM,
   y: usablePlotP,
   mode: 'lines+markers',
   fill: 'tozeroy',
   hoverinfo:"x+y",
   line: {
    color: 'rgb(55, 128, 191)'
  },
  marker:{size:4}
 };

 var data = [trace1, trace2];

 layout = { // make global
    title: 'P-M Interaction Curve',
    xaxis: {
      hoverformat: '.2f',
      title: "\u03D5" + "Mn" + " (k-ft)",
      titlefont: {size:18},
      zerolinewidth: 1.25
     },
    yaxis: {
      hoverformat: '.2f',
      title: "\u03D5" + "Pn" + " (kips)",
      titlefont: {size:18},
      zerolinewidth: 1.25
    },
    showlegend: false,
    hovermode:'closest',
    margin: {r: 50,  pad: 4},
    width:500,
    height:600,
    annotations: [
    {
      xref: 'paper',
      yref: 'paper',
      x: 0.66,
      xanchor: 'right',
      y: 0.5,
      yanchor: 'bottom',
      text: 'Acceptable Region',
      showarrow: false,
      arrowhead: 7,
      font: {
       family: 'sans serif',
       size: 18,
       color: 'rgb(102, 0, 0)'
     },
    }
  ]
  };

  Plotly.newPlot('chart-area', data, layout,
  {
    displayModeBar: true,
    displaylogo: false,
    showLink: false
  });

}

//to plot load case data into the p-m curve chart
function plotLoadCase(){
  var loadData = loadCaseCirData();

 trace3 = {
   x: loadData.x,
   y: loadData.y,
   mode: 'markers+text',
   text: loadData.t,
   textposition: 'top',
   hoverinfo:"x+y",
   marker:{color:'rgba(200, 50, 100, .8)', size:6}
 };

 var data = [trace1, trace2, trace3];

  Plotly.newPlot('chart-area', data, layout);
}

//scroll to bottom
$(document).ready(function() {

    $('.scrollBot').click(function(){
        $('html, body').animate({scrollTop:$(document).height()}, 'slow');
        return false;
    });

});
