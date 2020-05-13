/* CALL STARTUP FUNCTIONS
  window.addEventListener("load", myInit, true); function myInit(){
  };
*/

function uploadClick(){
  //displayViz(true);
  document.getElementById("uploadInput").click();
}

function about(){
  var display = document.getElementById('theImage').style.display;
  var imageExists = document.getElementById('theImage').src;
  if (imageExists){
    if (display === 'flex'){
      displayViz(false);
    } else if (display === 'none'){
      displayViz(true);
    }
  }
}

function displayViz(bool){
  if (bool){
    document.getElementById('theImage').style.display = 'flex';
    document.getElementById('color-buttons').style.display = 'flex';
    //document.getElementById('button-description').style.display = 'flex';
    document.getElementById('about').style.display = 'none';

  } else {
    document.getElementById('theImage').style.display = 'none';
    document.getElementById('color-buttons').style.display = 'none';
    document.getElementById('button-description').style.display = 'none';

    document.getElementById('about').style.display = 'block';
  }
}

function setColors(array, poles){
    document.getElementById('theImage').style.background = poles.darkest.hex;
    // document.getElementById('color-buttons').style.background = poles.brightest.hex;
    document.getElementById('color-buttons').style.background = poles.darkest.hex;
    document.getElementsByTagName('body')[0].style.background = poles.darkest.hex;
    /*document.getElementById('title').style.background = 'red';
    document.getElementById('upload-button-div').style.background = 'red';
    document.getElementById('content').style.background = 'red';
    document.getElementById('theImage').style.background = 'red';
    document.getElementById('theImage').style.background = 'red';
    document.getElementById('theImage').style.background = 'red';
    document.getElementById('theImage').style.background = 'red';
    document.getElementById('theImage').style.background = 'red';
    document.getElementById('theImage').style.background = 'red';*/
}

function previewFile(){
     var preview = $("#theImage")[0]; //selects the query named img
     var file    = document.querySelector('input[type=file]').files[0]; //sames as here
     var reader  = new FileReader();

     reader.onloadend = function () {
         preview.src = reader.result;
         makeImage(reader.result);
     }

     //remove previous buttons
     $('#color-buttons').empty();


     //create an info box that tells the user what clicking the tiles does
     var tempTarget = $('#color-buttons')[0];
     var infoBox = document.createElement("p1");
     infoBox.innerHTML = "Click on a color tile below to copy the hex code to your clipboard";
     //newButton.style.background = "#453a3a";
     infoBox.classList.add("info-box");
     tempTarget.appendChild(infoBox);

     if (file) {
         reader.readAsDataURL(file); //reads the data as a URL
     } else {
         preview.src = "";
     }
}

  function makeImage(url) {
    $('#theImage')[0].src = url;
    $('#theImage')[0].onload = function(){
      let colors = getImageColors(($('#theImage')[0]));
      let colorArray = createColorArray(colors.a);
      /* Button Color Display Order
      Running 'colorArray' second prompts sorting by huge,
      Running 'findPoles()' second prompts color sorting by brightness. */
      poles = findPoles(colorArray);
      colorArray = reorder(colorArray);
      buttonSet(colorArray, poles);
      setColors(colorArray, poles);
      displayViz(true);
    }
  }

  function getImageColors(image){
    var colorThief = new ColorThief();
    var colors = {};
    colors.a = colorThief.getPalette(image, 24);
    colors.b = colorThief.getColor(image);
    return colors;
  }


  function createColorArray(array){
    let colorArray = [];

    for (var i = 0; i < array.length; i++) {
      let c = array[i];
      let hsv = rgbToHsv(...c);
      let brightness = extractBrightness(...c);
      colorArray[i] = {
        r: c[0],
        g: c[1],
        b: c[2],
        h: hsv.h,
        s: hsv.s,
        v: hsv.v,
        brightness: brightness,
        hex: rgbToHex(...c)
      }
    }
    return colorArray;
  }

  function reorder(array){
    array.sort(function(a, b){return a.h - b.h});
    return array;
  }

  function findPoles(array){
    array.sort(function(a, b){return a.brightness - b.brightness});

    let poles = {
      darkest: array[0],
      brightest: array[array.length-1]
    };
    return poles;
  }

  function buttonSet(array, poles){
    for (var i = 0; i<array.length; i++){
      createButton(array[i].hex, poles.brightest);
    }
  }

  function createButton(hex, l, d){
    var target = $("#color-buttons")[0];
    var newButton = document.createElement("button");
    newButton.innerHTML = hex;
    newButton.style.background = hex;
    newButton.onclick = function(){ colorClipboard(hex) };
    newButton.classList.add("buttons");
    newButton.onmouseover = function(event) {
      let target = event.target;
      target.style.color = 'white';
      target.style.background = 'black';
    };
    newButton.onmouseout = function(event) {
    let target = event.target;
    target.style.color = '';
    target.style.background = hex;
  };
    target.appendChild(newButton);
  }

  //this is a mouse click event called by the colorButtons
  var colorClipboard = function(hex){
    var inp = document.createElement('input');
    document.body.appendChild(inp);
    var stuff = hex;
    inp.value = stuff;
    inp.select();
    document.execCommand('copy',false);
    inp.remove();
    };
