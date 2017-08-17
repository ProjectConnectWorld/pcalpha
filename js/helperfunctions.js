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


function getstaticdisplayinfo(mybounds) {
  var totalout = {
    schools: 0,
    cschools: 0,
    classrooms: 0,
    teachers: 0,
    students: 0

  };

  for (var i = 0; i < maudata.length; i++) {
    for (var j = 0; j < maudata[i].length; j++) {
      if (maudata[i][j].lat && maudata[i][j].lon) {
        var latlng = L.latLng(maudata[i][j].lat, maudata[i][j].lon);
          totalout.schools = totalout.schools + 1;
          totalout.classrooms = totalout.classrooms + parseInt(maudata[i][j].classrooms);
          totalout.teachers = totalout.teachers + parseInt(maudata[i][j].teachers);
          totalout.students = totalout.students + parseInt(maudata[i][j].students);
      }
    }

  }
  totalout.cschools = totalout.schools - parseInt(maudata[0].length);
  document.getElementById("nschools").innerHTML = numberWithCommas(totalout.schools);
  document.getElementById("cschools").innerHTML = numberWithCommas(totalout.cschools);
  document.getElementById("nclassrooms").innerHTML = numberWithCommas(totalout.classrooms);
  document.getElementById("nteachers").innerHTML = numberWithCommas(totalout.teachers);
  document.getElementById("nstudents").innerHTML = numberWithCommas(totalout.students);
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

function drawgraph(sliderval, chart,dots) {
  sliderval= parseInt(sliderval);

  console.log(dots);
  //var newdata = getdots(sliderval);
  var check= document.getElementById("myCheck").checked;
  var zero = dots.greyschools;
  var pos = dots.inschoolsconn;
  var neg = dots.inschoolsnotconn;
  console.log(zero +" " + pos +" " + neg);

  if(check){
    removeAll(chart);
    addData(chart, "No Internet Data", zero, chartColors.zero);
    addData(chart, ">= n Mbps", pos, chartColors.pos);
    addData(chart, "< n Mbps", neg, chartColors.neg);
    removeDatas(chart);
    chart.update(1000, false);

  }else{
    removeAll(chart);
    addData(chart, ">= n Mbps", pos, chartColors.pos);
    addData(chart, "< n Mbps", neg, chartColors.neg);
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
  var check= document.getElementById("myCheck").checked;
  if (check) {
    for (var i = 0; i < maudata.length; i++) {
      if (maudata[i].length > 0) {
        for (var j = 0; j < maudata[i].length; j++) {
          if (isNumeric(maudata[i][j].lat) && isNumeric(maudata[i][j].lon)) {
            if (maudata[i][j].mbps == 0) {
              var school = L.circle([maudata[i][j].lat, maudata[i][j].lon], {
                color: '#F94B4B',
                fillColor: '#F94B4B',
                fillOpacity: .6,
                radius: 10

              }).bindPopup("Name: "+ maudata[i][j].name + "<br>" + "Conn: "+ maudata[i][j].mbps).addTo(allschools[0]);

            } else {
              var school = L.circle([maudata[i][j].lat, maudata[i][j].lon], {
                color: '#228B22',
                fillColor: '#228B22',
                fillOpacity: .6,
                radius: 10

              }).bindPopup("Name: "+ maudata[i][j].name + "<br>" + "Conn: "+ maudata[i][j].mbps).addTo(allschools[Math.ceil(maudata[i][j].mbps)]);
            }
          }
        }
      }
    }

  }
  else{
    for (var i = 0; i < maudata.length; i++) {
      if (maudata[i].length > 0) {
        for (var j = 0; j < maudata[i].length; j++) {
          if (isNumeric(maudata[i][j].lat) && isNumeric(maudata[i][j].lon)) {
            if (maudata[i][j].mbps == 0) {
              var school = L.circle([maudata[i][j].lat, maudata[i][j].lon], {
                color: '#228B22',
                fillColor: '#228B22',
                fillOpacity: .6,
                radius: 10

              }).bindPopup("Name: "+ maudata[i][j].name + "<br>" + "Conn: "+ maudata[i][j].mbps).addTo(allschools[0]);

            } else {
              var school = L.circle([maudata[i][j].lat, maudata[i][j].lon], {
                color: '#228B22',
                fillColor: '#228B22',
                fillOpacity: .6,
                radius: 10

              }).bindPopup("Name: "+ maudata[i][j].name + "<br>" + "Conn: "+ maudata[i][j].mbps).addTo(allschools[Math.ceil(maudata[i][j].mbps)]);
            }
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
              color: '#FFFF00',
              fillColor: '#FFFF00',
              fillOpacity: .6,
              radius: 10
            }).bindPopup("Name: "+ maudata[i][j].name + "<br>" + "Conn: "+ maudata[i][j].mbps).addTo(newlayer);
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
              color: '#228B22',
              fillColor: '#228B22',
              fillOpacity: .6,
              radius: 10
            }).bindPopup("Name: "+ maudata[i][j].name + "<br>" + "Conn: "+ maudata[i][j].mbps).addTo(newlayer);
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
  var mybounds = mymap.getBounds();
  var dots= getdisplaypie(mybounds,sliderval,checkbox.checked)
  drawgraph(sliderval, myPie,dots);
  var newlayer = L.layerGroup();
  if (mymap.hasLayer(allschools[0])) {
    mymap.removeLayer(allschools[0]);
  }
  if (checkbox.checked) {
    for (var j = 0; j < maudata[0].length; j++) {
      if (isNumeric(maudata[0][j].lat) && isNumeric(maudata[0][j].lon)) {
        var school = L.circle([maudata[0][j].lat, maudata[0][j].lon], {
          color: '#F94B4B',
          fillColor: '#F94B4B',
          fillOpacity: .6,
          radius: 10,
        }).bindPopup("Name: "+ maudata[0][j].name + "<br>" + "Conn: "+ maudata[0][j].mbps).addTo(newlayer);
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
            color: '#228B22',
            fillColor: '#228B22',
            fillOpacity: .6,
            radius: 10
          }).bindPopup("Name: "+ maudata[0][j].name + "<br>" + "Conn: "+ maudata[0][j].mbps).addTo(newlayer);
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
            color: '#FFFF00',
            fillColor: '#FFFF00',
            fillOpacity: .6,
            radius: 10
          }).bindPopup("Name: "+ maudata[0][j].name + "<br>" + "Conn: "+ maudata[0][j].mbps).addTo(newlayer);
        }
      }
      allschools[0] = newlayer;
      newlayer.addTo(mymap);

    }

  }
}


function getdisplaypie(mybounds,sliderval,check) {
  sliderval= parseInt(sliderval);
  var totalout = {
    inschoolsconn: 0,
    inschoolsnotconn: 0,
    greyschools: 0
  };

  for (var i = 0; i < maudata.length; i++) {
    for (var j = 0; j < maudata[i].length; j++) {

      if (maudata[i][j].lat && maudata[i][j].lon) {
        var latlng = L.latLng(maudata[i][j].lat, maudata[i][j].lon);
        if (mybounds.contains(latlng)) {
          if(!check){
            if(parseFloat(maudata[i][j].mbps)>=sliderval){
              totalout.inschoolsconn = totalout.inschoolsconn + 1;
            }else{
              totalout.inschoolsnotconn = totalout.inschoolsnotconn + 1;
            }

          }else{
            if(i==0){
              totalout.greyschools= totalout.greyschools +1;
            }
            else if(parseFloat(maudata[i][j].mbps)>sliderval){
              totalout.inschoolsconn = totalout.inschoolsconn + 1;
            }else{
              totalout.inschoolsnotconn = totalout.inschoolsnotconn + 1;
            }

          }


        }

      }

    }

  }
  return totalout;
  console.log(totalout);

}



function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}





function addLayout(checkbox) {
  var country= "mauritania"
  if (checkbox.checked) {
    countryLayer=L.geoJson(allcountries,{
      filter: function (geoJsonFeature) {
        if(geoJsonFeature.properties.name.replace(/\s/g,'').toLowerCase()==country.replace(/\s/g,'').toLowerCase()){
          return true;
        }else{
          return false;
        }
      },
      style:function (geoJsonFeature) {
        return {fill:false ,color:"white"}
      }
    }).addTo(mymap);


  }
  else{
    if(mymap.hasLayer(countryLayer)){
      mymap.removeLayer(countryLayer);

    }

  }

}
