//linear interpolation with a lookup from x
function linearI(pointX, arrayX, arrayY){
  var maxX = Math.max(arrayX);
  var minX = Math.min(arrayX);
  var pointY = []; var coordY;

  if (pointX > maxX || pointX < minX) {
    console.log("Interpolation point out of range");
  }
  else {
    for (var i = 0; i < arrayX.length; i++) {
      if ((pointX <= arrayX[i] && pointX >= arrayX[i+1]) || (pointX >= arrayX[i] && pointX <= arrayX[i+1])) {
        coordY = arrayY[i]+(arrayY[i+1]-arrayY[i])*(pointX-arrayX[i])/(arrayX[i+1]-arrayX[i]);
        pointY.push(coordY);
      }
    }
    return pointY; // pointY is an array because there could be tow values for same Pu
  }

}
