function drawCircle(nBar){

 var outerDia = 30;
 var cover = 3;
 var inRadius = 0.5*(outerDia-2*cover)-0.75;
 var xCenter = 0.5*outerDia;
 var yCenter = 0.5*outerDia;
 // var nBar = 6;
 var theta = 2*Math.PI/nBar;
 var xCord = [];
 var yCord = [];

 for (var i = 0; i < nBar; i++) {
   xCord.push(xCenter + inRadius*Math.cos(i*theta));
   yCord.push(yCenter + inRadius*Math.sin(i*theta));
 }

 var trace1 = {
   x: xCord,
   y: yCord,
   mode: 'markers',
   marker:{
     color:'rgba(2, 155, 2, 1)',
     size:10,
     line: {
      color: 'rgb(2, 2, 2)',
      width: 1
    },
   }

 };

 var data = [trace1];

 layout = { // make global
    xaxis: {
      autorange: true,
      showgrid: false,
      zeroline: false,
      showline: false,
      ticks: '',
      showticklabels: false
     },
    yaxis: {
      autorange: true,
      showgrid: false,
      zeroline: false,
      showline: false,
      ticks: '',
      showticklabels: false
    },
    showlegend: false,
    margin: {
     l: 10,
     r: 10,
     b: 10,
     t: 10,
     pad: 0
   },
    width:275,
    height:275,
    paper_bgcolor:'#e2d3e8',
    plot_bgcolor:'#e2d3e8',
    shapes: [

    // Filled Circle
    {
      type: 'circle',
      xref: 'x',
      yref: 'y',
      fillcolor: 'rgba(198, 209, 141, 0.7)',
      x0: 0,
      y0: 0,
      x1: outerDia,
      y1: outerDia,
      line: {
        color: 'rgba(2, 2, 2, 1)'
      }
    },
    // Unfilled circle
    {
      type: 'circle',
      xref: 'x',
      yref: 'y',
      x0: cover,
      y0: cover,
      x1: outerDia-cover,
      y1: outerDia-cover,
      line: {
        color: 'rgba(113, 34, 34, 1)'
      }
    },
  ]
 };

 Plotly.newPlot('xSection', data, layout,
 {
   displayModeBar: false,
   staticPlot: true
 });

}

$(document).ready(function() {

  drawCircle(6);

    $('#addLayer').click(function(){
      drawCircle();
    });

    $( "#nb" ).change(function() {
      drawCircle(this.value);
 });

});

tippy('[title]',{
  arrow: true,
});
