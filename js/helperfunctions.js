/**
 * Modifies the regional information based on what is seen in the viewport
 * This should be called when the viewport changes or when initializing the map for the first time
 * @param  {[mybounds type]} mybounds [Is the bound that is seen in the view port ]
 * @return {[null]}          [Modifies appropriate HTML values]
 */

function getdisplayinfo(mybounds) {
  var totalout = {
    inschools: 0,
    outschools: 0,
    inclassrooms: 0,
    inteachers: 0,
    instudents: 0

  };
  for (var i = 0; i < maudata.length; i++) {
    for (var j = 0; j < maudata[i].length; j++) {

      if (maudata[i][j].lat && maudata[i][j].lon) {
        var latlng = L.latLng(maudata[i][j].lat, maudata[i][j].lon);
        if (mybounds.contains(latlng)) {
          totalout.inschools = totalout.inschools + 1;
          totalout.inclassrooms = totalout.inclassrooms + parseInt(maudata[i][j].classrooms);
          totalout.inteachers = totalout.inteachers + parseInt(maudata[i][j].teachers);
          totalout.instudents = totalout.instudents + parseInt(maudata[i][j].students);

        } else {
          totalout.outschools = totalout.outschools + 1;
        }

      }

    }

  }
  document.getElementById("nschools").innerHTML = totalout.inschools;
  document.getElementById("nclassrooms").innerHTML = totalout.inclassrooms;
  document.getElementById("nteachers").innerHTML = totalout.inteachers;
  document.getElementById("nstudents").innerHTML = totalout.instudents;
}

/**
 * Gets the values that are below and above the slider value
 * @param  {[int]} sliderval [The value of the slider ]
 * @return {[array with len 2]}           [Returns an array In the format: with arr[0] = those that are above the slider value arr[1]= those that are below the slider value ]
 */
function getdots(sliderval) {
  sliderval= parseInt(sliderval);
  var check= document.getElementById("myCheck").checked;
  var arrvals = [];
  for (var i = 0; i < maudata.length; i++) {
    arrvals[i] = maudata[i].length
  }
  if(check){
    if (sliderval == 0) {
      var returnvals = [arrvals[0], arrvals.slice(2).reduce((a, b) => a + b, 0), 0];
      return returnvals;
    } else {
      returnvals = [arrvals[0], arrvals.slice(sliderval+1).reduce((a, b) => a + b, 0), arrvals.slice(1, sliderval+1).reduce((a, b) => a + b, 0)];
      return returnvals;
    }
  }
  else{
    if (sliderval == 0) {
      var returnvals = [0,arrvals.reduce((a, b) => a + b, 0), 0];
      return returnvals;
    } else {
      returnvals = [0, arrvals.slice(sliderval+1).reduce((a, b) => a + b, 0), arrvals.slice(0, sliderval+1).reduce((a, b) => a + b, 0)];
      return returnvals;

    }

  }



}


/**
 * Thats the graph based on the slider value
 * @param  {[int]} sliderval [the value of teh slider ]
 * @param  {[chart.js chart ]} chart     [The chart to be modified ]
 * @return {[null]}           [Updates the chart ]
 */

function drawgraph(sliderval, chart) {
  sliderval= parseInt(sliderval);
  var newdata = getdots(sliderval);
  var check= document.getElementById("myCheck").checked;
  var zero = newdata[0];
  var pos = newdata[1];
  var neg = newdata[2];
  console.log(zero +" " + pos +" " + neg);

  if(check){
    removeAll(chart);
    addData(chart, "Zero Conn", zero, chartColors.zero);
    addData(chart, "Above Threshold", pos, chartColors.pos);
    addData(chart, "Below Threshold", neg, chartColors.neg);
    removeDatas(chart);
    chart.update(1000, false);

  }else{
    removeAll(chart);
    addData(chart, "Above Threshold", pos, chartColors.pos);
    addData(chart, "Below Threshold", neg, chartColors.neg);
    removeDatas(chart);
    chart.update(1000, false);

  }


}

// START Draw Graphs Helper Functions
function addData(chart, label, data, color) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
    dataset.backgroundColor.push(color);
  });
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
    dataset.backgroundColor.pop();
  });
}

function removeDatas(chart) {
  chart.data.labels.shift();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.shift();
    dataset.backgroundColor.shift();
  });
}

function removeAll(chart) {
  for (var i = 0; i < chart.data.labels.length; i++) {
    removeData(chart)
  }
}
// END Draw Graphs Helper Functions

/**
 * Initializes Map with all dots being blue
 * @return {[null]} [returns nothing, simply adds markers to every lat long location ]
 */
function initializemap() {
  for (var i = 0; i < maudata.length; i++) {
    if (maudata[i].length > 0) {
      for (var j = 0; j < maudata[i].length; j++) {
        if (isNumeric(maudata[i][j].lat) && isNumeric(maudata[i][j].lon)) {
          if (maudata[i][j].mbps == 0) {
            var school = L.circle([maudata[i][j].lat, maudata[i][j].lon], {
              color: '#28C6C6',
              fillColor: '#28C6C6',
              fillOpacity: .6,
              radius: 10

            }).addTo(allschools[0]);

          } else {
            var school = L.circle([maudata[i][j].lat, maudata[i][j].lon], {
              color: '#28C6C6',
              fillColor: '#28C6C6',
              fillOpacity: .6,
              radius: 10

            }).addTo(allschools[Math.ceil(maudata[i][j].mbps)]);
          }
        }
      }
    }
  }

  for (var i = 0; i < allschools.length; i++) {
    allschools[i].addTo(mymap);
  }
}


/**
 * Redraws all the markers that need to be updated based on the change of tehe slider value
 * @param  {[int]} sliderval [value of the slider]
 * @param  {[leaflet map ]} mymap     [leaflet map]
 * @return {[null]}           [redraws map ]
 */
function redraw(sliderval, mymap) {
  var check= document.getElementById("myCheck").checked;
  var newlayer = L.layerGroup();


  if (currstate > prevstate) {
    for (var i = prevstate; i < currstate + 1; i++) {
      if(!(i==0 && check)){
        if (mymap.hasLayer(allschools[i])) {
          mymap.removeLayer(allschools[i]);
        }
        var newlayer = L.layerGroup();
        for (var j = 0; j < maudata[i].length; j++) {
          if (isNumeric(maudata[i][j].lat) && isNumeric(maudata[i][j].lon)) {
            var school = L.circle([maudata[i][j].lat, maudata[i][j].lon], {
              color: '#F94B4B',
              fillColor: '#F94B4B',
              fillOpacity: .6,
              radius: 10
            }).addTo(newlayer);
          }
        }
        allschools[i] = newlayer;
        newlayer.addTo(mymap);

      }



    }
  }

  if (currstate < prevstate) {


    for (var i = prevstate; i > currstate - 1; i--) {
      if(!(i==0 && check)){
        if (mymap.hasLayer(allschools[i])) {
          mymap.removeLayer(allschools[i]);
        }
        var newlayer = L.layerGroup();

        for (var j = 0; j < maudata[i].length; j++) {
          if (isNumeric(maudata[i][j].lat) && isNumeric(maudata[i][j].lon)) {
            var school = L.circle([maudata[i][j].lat, maudata[i][j].lon], {
              color: '#28C6C6',
              fillColor: '#28C6C6',
              fillOpacity: .6,
              radius: 10
            }).addTo(newlayer);
          }
        }
        allschools[i] = newlayer;
        newlayer.addTo(mymap);


      }




    }
  }

}

/**
 * Checks if a number is numeric
 * @param  {[number esc ]}  n [number esc type val ]
 * @return {Boolean}   [true is value is numeric, false otherwise]
 */
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


function checkAddress(checkbox) {
  var sliderval=$('input[type="range"]').val();
  sliderval= parseInt(sliderval);
  drawgraph(sliderval, myPie);
  var newlayer = L.layerGroup();
  if (mymap.hasLayer(allschools[0])) {
    mymap.removeLayer(allschools[0]);
  }
  if (checkbox.checked) {
    for (var j = 0; j < maudata[0].length; j++) {
      if (isNumeric(maudata[0][j].lat) && isNumeric(maudata[0][j].lon)) {
        var school = L.circle([maudata[0][j].lat, maudata[0][j].lon], {
          color: '#646464',
          fillColor: '#646464',
          fillOpacity: .6,
          radius: 10,
        }).addTo(newlayer);
      }
    }
    allschools[0] = newlayer;
    newlayer.addTo(mymap);

  } else {
    console.log("else");
    if (sliderval<1) {
      console.log("else <1");
      for (var j = 0; j < maudata[0].length; j++) {
        if (isNumeric(maudata[0][j].lat) && isNumeric(maudata[0][j].lon)) {
          var school = L.circle([maudata[0][j].lat, maudata[0][j].lon], {
            color: '#28C6C6',
            fillColor: '#28C6C6',
            fillOpacity: .6,
            radius: 10
          }).addTo(newlayer);
        }
      }
      allschools[0] = newlayer;
      newlayer.addTo(mymap);
    }
    else{
      console.log("else >1");
      for (var j = 0; j < maudata[0].length; j++) {
        if (isNumeric(maudata[0][j].lat) && isNumeric(maudata[0][j].lon)) {
          var school = L.circle([maudata[0][j].lat, maudata[0][j].lon], {
            color: '#F94B4B',
            fillColor: '#F94B4B',
            fillOpacity: .6,
            radius: 10
          }).addTo(newlayer);
        }
      }
      allschools[0] = newlayer;
      newlayer.addTo(mymap);

    }

  }
}
