<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">
  <link rel="icon" href="../../favicon.ico">

  <title>Alpha</title>
  <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />


  <!-- CSS -->
  <!-- Bootstrap core CSS -->
  <link href="../bootstrap4/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Leaflet CSS -->
  <link rel="stylesheet" href="../node_modules/leaflet/dist/leaflet.css" />
  <!-- Mapbox CSS -->
  <link href='https://api.mapbox.com/mapbox-gl-js/v0.38.0/mapbox-gl.css' rel='stylesheet' />
  <link rel='stylesheet' href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-compare/v0.1.0/mapbox-gl-compare.css' type='text/css' />
  <!-- Range Slider -->
  <link rel='stylesheet' href='../node_modules/rangeslider.js/dist/rangeslider.css' type='text/css' />
  <!-- Custom styles -->
  <link href="../css/starter-template.css" rel="stylesheet">
  <script src="https://use.fontawesome.com/5b36c1571c.js"></script>


  <!-- JS -->
  <!-- Leaflet JS -->
  <script src="../node_modules/leaflet/dist/leaflet.js"></script>
  <!-- Mapbox JS -->
  <script src='https://api.mapbox.com/mapbox-gl-js/v0.38.0/mapbox-gl.js'></script>
  <script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-compare/v0.1.0/mapbox-gl-compare.js'></script>
  <!-- D3 JS -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js" charset="utf-8"></script>
  <!-- Custom JS -->
  <script type="text/javascript" src="../data/maujson.js"></script>
  <script src="../js/helperfunctions.js"></script>




  <style>
    .map {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
    }
  </style>

</head>


<body>

  <!-- Navigation Bar -->
  <nav class="navbar ">
    <img class="navbar-brand" style="max-height: 60px" src="../data/pclogo.svg" alt="">

  </nav>

  <!-- Left Module  -->
  <div class="left-mod">
    <div class="label">
      Country Attributes
        <!-- <button type="button" class="btn" data-container="body" data-toggle="popover" data-placement="right" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."><i class="fa fa-info-circle fa-inverse " aria-hidden="true" ></i></button> -->
        <i class="fa fa-info-circle fa-inverse " aria-hidden="true" data-trigger="hover" data-container="body" data-toggle="popover" data-placement="right"
        data-content="This gives general information about schools in the entire country. "></i>
        <!-- <button type="button" name="button" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?"><i class="fa fa-info-circle fa-inverse " aria-hidden="true" ></i></button> -->
    </div>
    <div class="dynamic">


      <div class="content">
        <!-- Schools -->
        <div class="schools eld">
          <p class="contentval" id="nschools">1234087</p>
          <p class="contentlabel">SCHOOLS</p>
        </div>
        <!-- Connected Schools -->
        <div class="schools eld">
          <p class="contentval" id="cschools">1234087</p>
          <p class="contentlabel">CONN SCHOOLS</p>
        </div>
          <!-- Classrooms -->
        <div class="classrooms eld">
          <p class="contentval" id="nclassrooms">38000</p>
          <p class="contentlabel">CLASSROOMS</p>
          <!-- Teachers -->
        </div>
        <div class="teachers eld">
          <p class="contentval" id="nteachers">3455</p>
          <p class="contentlabel">TEACHERS</p>
          <!-- Students -->
        </div>
        <div class="students eld">
          <p class="contentval" id="nstudents">38000</p>
          <p class="contentlabel">STUDENTS</p>
        </div>
      </div>
    </div>

    <!-- Pie Chart Left Mod Section -->
    <div class="piechart  " id="piechart">
      <div class="dist">Connectivity
          <i class="fa fa-info-circle fa-inverse pull-right infoc2" aria-hidden="true" data-trigger="hover" data-container="body" data-toggle="popover" data-placement="right"
          data-content="This shows the percentage of schools in the window, based on the threshold speed chosen in the slider. For instance, if you are zoomed in and only looking at schools in Nouakchott, and you have the slider set at 6 Mpbs, it will show you the percentage of schools connected with a speed over 6 Mpbs, under 6 Mpbs, and those schools with 0 connection in Nouakchott."></i>
      </div>

      <canvas id="chart" style: "padding: 10px"/>

    </div>
  </div>

  <!-- Right Module -->
  <div class="right-mod">
    <div class="slidercontainer">
      <i class="fa fa-info-circle fa-inverse pull-left infoc3" aria-hidden="true" data-trigger="hover" data-container="body" data-toggle="popover" data-placement="left"
      data-content="This slider shows threshold internet speed. For instance, if you only want to see schools that have a connectivity speed of over 4 Mpbs, put the slider on 4 and the schools below this speed will turn red. Uncheck the box to make all schools that are not connected, regarless of the threshhold, gray. "></i>
      <div class="slider">
        <input type="range" min="0" max="8" value="0" data-rangeslider data-orientation="vertical">
        <output></output>
        <div class="mbps">
          Mbps
        </div>
      </div>

    </div>


    <div class="toggles ">
      <label><input type="checkbox" name="optradio" id="myCheck"  checked="checked"  onclick="checkAddress(this)"> Show 0-Conn</label>
    </div>
    <div class="disclaimer">
      <p>Connectivity data is randomly generated</p>
    </div>
  </div>


  <!-- Leaflet Map -->
  <div class="map" id="mapid"></div>

  <!-- JQUERY -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script>
    window.jQuery || document.write('<script src="../../assets/js/vendor/jquery.min.js"><\/script>')
  </script>

  <!-- Tether( Needed For Bootstrap) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
  <script type="text/javascript" src="../node_modules/popper.js/dist/popper.min.js"></script>
  <!-- Bootstrap JS -->
  <script src="../bootstrap4/dist/js/bootstrap.min.js"></script>
  <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
  <script src="../bootstrap4/docs/assets/js/ie10-viewport-bug-workaround.js"></script>
  <!-- Range Slider JS-->
  <script src="../node_modules/rangeslider.js/dist/rangeslider.min.js"></script>
  <!-- Chart JS -->
  <script src="../node_modules/chart.js/dist/Chart.bundle.min.js"></script>
  <!-- Chart Color JS -->
  <script src="../node_modules/chart.js/samples/utils.js"></script>






  <script type="text/javascript">
  $(function () {
  $('[data-toggle="popover"]').popover()
});
    // MAP Creation
    var mymap = L.map('mapid', {
      zoomControl: false
    }).setView([18.0079, -10.9408], 7);
    var mybounds = mymap.getBounds();
    //getdisplayinfo(mybounds);
    getstaticdisplayinfo(mybounds)


    L.control.zoom({
      position: 'bottomleft'
    }).addTo(mymap);

    var streetlayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: ' Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 20,
      minZoom: 3,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiYXlhbmV6IiwiYSI6ImNqNHloOXAweTFveWwzM3A4M3FkOWUzM2UifQ.GfClkT4QxlFDC_xiI37x3Q'
    });

    var darklayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 20,
      minZoom: 3,
      id: 'mapbox.dark',
      accessToken: 'pk.eyJ1IjoiYXlhbmV6IiwiYSI6ImNqNHloOXAweTFveWwzM3A4M3FkOWUzM2UifQ.GfClkT4QxlFDC_xiI37x3Q'
    });

    var satillitelayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 20,
      minZoom: 3,
      id: 'mapbox.satellite',
      accessToken: 'pk.eyJ1IjoiYXlhbmV6IiwiYSI6ImNqNHloOXAweTFveWwzM3A4M3FkOWUzM2UifQ.GfClkT4QxlFDC_xiI37x3Q'
    });
    var terminalLayer = L.tileLayer('https://api.mapbox.com/styles/v1/ayanez/cj653uorm5vw72ro58jxbzkj3/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
      maxZoom: 20,
      minZoom: 3,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      accessToken: 'pk.eyJ1IjoiYXlhbmV6IiwiYSI6ImNqNHloOXAweTFveWwzM3A4M3FkOWUzM2UifQ.GfClkT4QxlFDC_xiI37x3Q'
    });

    darklayer.addTo(mymap);

    var baseLayers = {
      "Dark Layer": darklayer,
      "Street Layer": streetlayer,
      "Satellite Layer": satillitelayer,
      "Terminal Layer": terminalLayer
    };

    control = L.control.layers(baseLayers, null, {
      position: 'bottomright'
    }).addTo(mymap);

    // Create array of layers for all Mbps partitions
    var allschools = []
    for (var i = 0; i < 9; i++) {
      allschools.push(L.layerGroup());
    }

    //Creates Logic to refresh viewport Info
    mymap.on('moveend', function(e) {
      var mybounds = mymap.getBounds();
      var check= document.getElementById("myCheck").checked;
      var sliderval=$('input[type="range"]').val();
      var dots= getdisplaypie(mybounds,sliderval,check)
      //getdisplayinfo(mybounds);
      getstaticdisplayinfo(mybounds)
      drawgraph(sliderval, myPie,dots)

    });

    // Config for Pie Chart
    var config = {
      type: 'pie',
      data: {
        datasets: [{
          data: [
            1,
            0,

          ],
          backgroundColor: [
            window.chartColors.pos,
            window.chartColors.neg,

          ],
          label: 'Dataset 1'
        }],
        labels: [
          "Above Threshold",
          "Below Threshold",

        ]
      },
      options: {
        responsive: true,
        legend: {
          display: true,
          position: 'bottom'

        }
      }
    };




    window.onload = function() {
      var ctx = document.getElementById("chart").getContext("2d");
      window.myPie = new Chart(ctx, config);
      var mybounds = mymap.getBounds();
      var check= document.getElementById("myCheck").checked;
      var dots= getdisplaypie(mybounds,0,check)
      drawgraph(0, myPie,dots);

    };



    // Slider Logic && Creations
    var $element = $('input[type="range"]');
    var $output = $('output');

    function updateOutput(el, val) {
      el.textContent = val;
    }
    var prevstate = 0;
    var currstate = 0;
    $element
      .rangeslider({
        polyfill: false,
        onInit: function() {
          updateOutput($output[0], this.value);
          var prevstate = 0;
          var currstate = 0;
        },
        onSlide: function(position, value) {
          prevstate = currstate;
          currstate = value;
          // drawgraph(value, myPie)
          redraw(value, mymap);
          var mybounds = mymap.getBounds();
          var check= document.getElementById("myCheck").checked;
          var dots= getdisplaypie(mybounds,value,check)
          drawgraph(value, myPie,dots)

        }
      })
      .on('input', function() {
        updateOutput($output[0], this.value);
      });


    //Initialize all map values to Blue
    initializemap();
  </script>

</body>

</html>
