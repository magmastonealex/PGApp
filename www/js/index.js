/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var formData=JSON.parse('{"form":[["text",["This is text data, as a test element."]],["select","Name",["Option 1","Option 2"]],["MultipleChoice","MC",["The Option 1","The Option 2","The Option 3"]],["CheckBoxes","CB",["CB1","CB2","CB3"]],["ImageCapture","CapIm"],["VideoCapture","VidCap"],["AudioCapture","AudCap"],["Geolocation","LocCap"],["text",["This is text data, just to test repeat elements."]]]}');
 var formIDs=[];
 var formValues=[]
 var inter=5
 window.doGeoPush = function(){
    alert("Geod");
    setInterval(doGeoPush, inter*1000);
 }
 window.getData = function(){
    for (var formPart = 0; formPart < formIDs.length; formPart++) {
        switch(formIDs[formPart][0]){
            case "select":
            formValues.push([formData["form"][formPart][1], $('#'+formIDs[formPart][1]).val()]);
            break;
            case "MultipleChoice":
            formValues.push([formData["form"][formPart][1], $('input:radio[name="'+formIDs[formPart][1]+'"]:checked').val()]);
            break;
            case "CheckBoxes":
              var allVals = [];
             $(':checkbox[name="'+formIDs[formPart][1]+'"]:checked').each(function() {
                console.log("check");
                allVals.push($(this).val());
              });
            formValues.push([formData["form"][formPart][1], allVals]);
            break;
            case "ImageCapture":
            formValues.push([formData["form"][formPart][1], $('#'+formIDs[formPart][1]).html()]);
            default:
            break;
        }
    }
    $.mobile.allowCrossDomainPages = true;
    $.post("http://fashify.net/offlineform/frmprc.php", "formsubmission="+JSON.stringify(formValues));
}
 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        $(document).ready(function(){

            $('#geo5min').on("tap",function(){inter=5;alert(5);});
            $('#geo10min').on("tap",function(){inter=10;window.doGeoPush();});
            $('#geo15min').on("tap",function(){inter=15;window.doGeoPush();});

            $('#submitButton').on("tap", function(){
                //console.log($('#formContent').serialize());
                getData();

            });

            $('#logi').on("tap",function(event){

                $.mobile.showPageLoadingMsg("a", "Logging In");
                $.mobile.changePage("#formSelect");
                $.mobile.hidePageLoadingMsg();
            });

            $('.formlink').on("tap",function(){
            //Populate the form page with proper content here.
            $('#formContent').html("<br>");
            console.log(this.id);
            $('#FormName').html($(this).html());
            for (var formPart = 0; formPart < formData["form"].length; formPart++) {
                switch(formData["form"][formPart][0]){
                    case "text":
                    console.log("Text");
                    $('#formContent').append("<p>"+formData["form"][formPart][1]+"</p>");
                    formIDs.push(["text","text"]);
                    break;

                    case "select":
                    console.log("Select");
                    var options = "";
                    options += '<p>'+formData["form"][formPart][1]+"</p>";
                    options +='<select name="select'+formPart+'" id="select'+formPart+'">';
                    for (var i = 0; i < formData["form"][formPart][2].length; i++) {
                        options += '<option>'+formData["form"][formPart][2][i]+'</option>';
                    }
                    options += '</select>';
                    formIDs.push(["select", "select"+formPart]);
                    $('#formContent').append(options);
                    console.log($('#formContent').html());
                    break;

                    case "MultipleChoice":
                    var options = "";
                    console.log("MC");
                    options += '<fieldset data-role="controlgroup"><legend>'+formData["form"][formPart][1]+"</legend>";
                    for (var i = 0; i < formData["form"][formPart][2].length; i++) {
                        options += '<input type="radio" name="rChoice-'+formPart+'" id="rChoice-'+formPart+'-'+i+'" value="'+formData["form"][formPart][2][i]+'" />'
                        options += '<label for="rChoice-'+formPart+'-'+i+'">'+formData["form"][formPart][2][i]+'</label>';
                    }
                    options += '</fieldset>'
                    formIDs.push(["MultipleChoice", "rChoice-"+formPart]);
                    $('#formContent').append(options);
                    break;

                    case "CheckBoxes":
                    var options = "";
                    console.log("CB");
                    options += '<fieldset data-role="controlgroup"><legend>'+formData["form"][formPart][1]+"</legend>";
                    for (var i = 0; i < formData["form"][formPart][2].length; i++) {
                        options += '<input type="checkbox" name="cChoice-'+formPart+'" id="cChoice-'+formPart+'-'+i+'" value="'+formData["form"][formPart][2][i]+'" />'
                        options += '<label for="cChoice-'+formPart+'-'+i+'">'+formData["form"][formPart][2][i]+'</label>';
                    }
                    options += '</fieldset>'
                    formIDs.push(["CheckBoxes", "cChoice-"+formPart]);
                    $('#formContent').append(options);
                    break;

                    case "ImageCapture":
                    var options = "";
                    console.log("IC");
                    options += '<p>'+formData["form"][formPart][1]+'</p>';
                    options += '<a data-role="button" data-rel="dialog" formPart="'+formPart+'"id="Cap-'+formPart+'">Capture Image</a>';
                    options += '<p id="Cap-'+formPart+'-Data"></p>';
                    options += '<p id="Cap-Data"></p>';
                    formIDs.push(["ImageCapture", "Cap-"+formPart+"-Data"]);
                    $('#formContent').append(options);
                    $('#Cap-'+formPart).on("tap",function(event){
                        window.scannedformpart = $(this).attr("formPart");
                        console.log("Form:" + $(this).attr("formPart"));
                     var scanner = cordova.require("cordova/plugin/BarcodeScanner");
                     scanner.scan(
                      function (result) {
                        var FP = window.scannedformpart;
                        $('#Cap-'+FP+'-Data').html(result.text);
                      }, 
                      function (error) {
                          alert("Scanning failed: " + error);
                      }
                      );
                    });
                    break;
                    case "VideoCapture":
                    console.log("VC");
                    options = "";
                    options += '<p>'+formData["form"][formPart][1]+'</p>'
                    options += '<a data-role="button" data-rel="dialog" formPart="'+formPart+'"id="VCap-'+formPart+'">Capture Video</a>'
                    options += '<p id="VCap-'+formPart+'-Data"></p>'
                    console.log(options);
                    $('#formContent').append(options);
                    $('#VCap-'+formPart).on("tap",function(event){
                    navigator.device.capture.captureVideo(function(mediaFiles){path = mediaFiles[0].fullPath;alert(path);}, function(error){alert('Error Capturing');}, {limit:1});
                    });
                    break;
                    case "AudioCapture":
                    console.log("AC");
                    options = "";
                    options += '<p>'+formData["form"][formPart][1]+'</p>'
                    options += '<a data-role="button" data-rel="dialog" formPart="'+formPart+'"id="ACap-'+formPart+'">Capture Audio</a>'
                    options += '<p id="ACap-'+formPart+'-Data"></p>'
                    console.log(options);
                    $('#formContent').append(options);
                    $('#ACap-'+formPart).on("tap",function(event){
                    navigator.device.capture.captureAudio(function(mediaFiles){path = mediaFiles[0].fullPath;alert(path);}, function(error){alert('Error Capturing');}, {limit:1});
                    });
                    break;
                    case "Geolocation":
                    console.log("GL");
                    options = "";
                    options += '<p>'+formData["form"][formPart][1]+'</p>'
                    options += '<a data-role="button" data-rel="dialog" formPart="'+formPart+'"id="LCap-'+formPart+'">Capture Location</a>'
                    options += '<p id="LCap-'+formPart+'-Data"></p>'
                    console.log(options);
                    formIDs.push(["Geolocation", "LCap-"+formPart+"-Data"]);
                    $('#formContent').append(options);
                    $('#LCap-'+formPart).on("tap",function(event){
                    window.scannedformpart = $(this).attr("formPart");
                    navigator.geolocation.getCurrentPosition(function(position){$("#LCap-"+window.scannedformpart+"-Data").html(position.coords.latitude+","+position.coords.longitude);}, function(error){alert('Error Capturing');});
                    });
                    break;
                    default:
                    console.log("Unknown... work to do");
                    break;
                }
                if(formPart+1 != formData["form"].length){
                    $('#formContent').append("<hr>");
                }
            }
        });
});
app.receivedEvent('deviceready');
},
    // Update DOM on a Received Event
    receivedEvent: function(id) {


    }
};
