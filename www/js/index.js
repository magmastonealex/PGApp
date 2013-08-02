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
 var formData=0;
 var formIDs=[];
 var formValues=[];
 var allForms=0;
 window.inter=5;
 window.currentFormID=0;

 function doGeoPush(){
    clearInterval(window.lastInterval);
    navigator.geolocation.getCurrentPosition(function(position){
        window.latitude=position.coords.latitude;
        window.longitude=position.coords.longitude;
        $("#geoSettingsData").html(position.coords.latitude+","+position.coords.longitude);
        $.ajax({
          type: "POST",
          url: "http://app.d2dpro.com/submit_location.php",
          async:true,
          data: { "deviceID":window.devid, "userID":window.userID,"interval":window.inter, "latitude":position.coords.latitude, "longitude":position.coords.longitude }
        });
    }, function(error){console.log('Error Capturing');});
    window.lastInterval = setInterval(doGeoPush, window.inter*1000);
 }


function loadForms(){
    $.ajaxSetup({async: true, error: function(error){alert("Error downloading");}});
    $.getJSON("http://app.d2dpro.com/get_form.php", {"userID":window.userID}).done(function(data){
                $('#linksForm').html("");
                allForms = data;
                console.log("GOT DATA" + data);
                for (var formNumber = 0; formNumber < data.length; formNumber++) {
                    formLinkOptions = '<li><a href="#form" class="formlink" formID="'+allForms[formNumber][0]+'" data-transition="pop">'+allForms[formNumber][1]+'</a></li>'
                    $('#linksForm').append(formLinkOptions);
                    $('#linksForm').trigger("create");
                    $('#linksForm').listview('refresh');
                }
                
                setupPageClickHandler();
            });
    $.ajaxSetup({async: true});
}


function setupPageClickHandler(){
    $('.formlink').on("tap",function(){
        $.ajaxSetup({async: false, error: function(error){alert("Error downloading");}});
                console.log("BEGIN DOWNLOAD: "+$(this).attr("formID"));
                window.currentFormID = $(this).attr("formID");
            $.getJSON("http://app.d2dpro.com/get_form_field.php",{'formID':$(this).attr("formID")}).done(function(data){
                formData = data;
                console.log("DONE DOWNLOAD");
                updateData();
            });      
    });
}


function formDetailHandle(){
    $('.detail_shower').on("tap",function(event){
        console.log($(this).attr("subID"));
        if($(event.target).html() != undefined){
        $("#entries_detail_header").html("<h1>"+$(this).html()+"</h1>");
        $("#entries_detail").trigger("create");
        $("#entries_detail_header").trigger("create");
    }
        
        $.ajaxSetup({async: false, error: function(error){alert("Error downloading Detail");}});
            
        $.getJSON("http://app.d2dpro.com/view_result.php", {"subID":$(this).attr("subID")}).done(function(data){
            
            console.log(JSON.stringify(data));
            $("#entries_detail_content").html("");
            for(var iter=0; iter<data.length;iter++){
                
                options ="";
                options += "<p>"+data[iter][0][0]+":</p>";
                 switch(data[iter][0][1]){
                    case "PictureCapture":
                        options += '<img class="retImage" src="http://app.d2dpro.com/upload_picture/'+data[iter][1]+'"></img>';
                        $("#entries_detail_content").append(options);
                        $("#entries_detail_content").trigger("create");
                        options ="";
                        break;
                    case "select":
                        options += "<b>"+data[iter][1]+"</b>";
                        $("#entries_detail_content").append(options);
                        $("#entries_detail_content").trigger("create");
                        options ="";
                        break;
                    case "MultipleChoice":
                        options += "<b>"+data[iter][1]+"</b>";
                        $("#entries_detail_content").append(options);
                        $("#entries_detail_content").trigger("create");
                        options ="";
                        break;
                    case "CheckBoxes":
                        splitChecks = data[iter][1].split(";");
                        for(var SPI=0;SPI<splitChecks.length;SPI++){
                            options += "<b>"+splitChecks[SPI]+"</b><br>";
                        }
                        $("#entries_detail_content").append(options);
                        $("#entries_detail_content").trigger("create");
                        options ="";
                        break;
                    case "ImageCapture":
                        options += "<b>"+data[iter][1]+"</b>";
                        $("#entries_detail_content").append(options);
                        $("#entries_detail_content").trigger("create");
                        options ="";
                        break;
                    case "VideoCapture":
                        options +='<video src="http://app.d2dpro.com/upload_video/'+data[iter][1]+'" width="320" height="240" controls>';
                        options +='Not supported here!';
                        options +='</video>';
                        $("#entries_detail_content").append(options);
                        $("#entries_detail_content").trigger("create");
                        options ="";
                        break;
                    case "AudioCapture":
                        options += '<audio src="http://app.d2dpro.com/upload_audio/'+data[iter][1]+'">';
                        options += 'Not supported!';
                        options += '</audio>';
                        $("#entries_detail_content").append(options);
                        $("#entries_detail_content").trigger("create");
                        options ="";
                        break;
                    case "Geolocation":
                        options += '<br><div id="geodiv"></div><br>';
                        $("#entries_detail_content").append(options);
                        $("#entries_detail_content").trigger("create");
                        pos_to_load=data[iter][1];
                        $('#geodiv').gmap({'disableDefaultUI':true}).bind('init',function(event,map){
                              $('#geodiv').gmap('addMarker', {'position': pos_to_load, 'bounds': true } );
                        });
                        options ="";
                        break;
                    default:
                        options += "<br>"
                        $("#entries_detail_content").append(options);
                        $("#entries_detail_content").trigger("create");
                        options ="";
                        break;
                }
                options += "<br><hr>"

            }
        $("#entries_detail").trigger("create");

        });
        console.log($("#entries_detail_content").html());
        $("#entries_detail").trigger("create");
    });
}


function updateData(){
     conslole.log("GRABBING LOCATION JUST IN CASE");
     navigator.geolocation.getCurrentPosition(function(position){window.latitude = position.coords.latitude; window.longitude =position.coords.longitude;}, function(error){alert('Error Capturing Location');});
     console.log("PROCESSING");
            //Populate the form page with proper content here.
            $('#formContent').html("<br>");
            $('#FormName').html($(this).html());
            formIDs = [];
            for (var formPart = 0; formPart < formData.length; formPart++) {
                switch(formData[formPart][0]){
                    case "text":
                    console.log("Text");
                    $('#formContent').append("<p>"+formData[formPart][2][0]+"</p>");
                    formIDs.push(["text","text"]);
                    break;

                    case "select":
                    console.log("Select");
                    var options = "";
                    options += '<p>'+formData[formPart][1]+"</p>";
                    options +='<select name="select'+formPart+'" id="select'+formPart+'">';
                    for (var i = 0; i < formData[formPart][2].length; i++) {
                        options += '<option>'+formData[formPart][2][i]+'</option>';
                    }
                    options += '</select>';
                    formIDs.push(["select", "select"+formPart]);
                    $('#formContent').append(options);
                    console.log($('#formContent').html());
                    break;

                    case "MultipleChoice":
                    var options = "";
                    console.log("MC");
                    options += '<fieldset data-role="controlgroup"><legend>'+formData[formPart][1]+"</legend>";
                    for (var i = 0; i < formData[formPart][2].length; i++) {
                        options += '<input type="radio" name="rChoice-'+formPart+'" id="rChoice-'+formPart+'-'+i+'" value="'+formData[formPart][2][i]+'" />'
                        options += '<label for="rChoice-'+formPart+'-'+i+'">'+formData[formPart][2][i]+'</label>';
                    }
                    options += '</fieldset>'
                    formIDs.push(["MultipleChoice", "rChoice-"+formPart]);
                    $('#formContent').append(options);
                    break;

                    case "CheckBoxes":
                    var options = "";
                    console.log("CB");
                    options += '<fieldset data-role="controlgroup"><legend>'+formData[formPart][1]+"</legend>";
                    for (var i = 0; i < formData[formPart][2].length; i++) {
                        options += '<input type="checkbox" name="cChoice-'+formPart+'" id="cChoice-'+formPart+'-'+i+'" value="'+formData[formPart][2][i]+'" />'
                        options += '<label for="cChoice-'+formPart+'-'+i+'">'+formData[formPart][2][i]+'</label>';
                    }
                    options += '</fieldset>'
                    formIDs.push(["CheckBoxes", "cChoice-"+formPart]);
                    $('#formContent').append(options);
                    break;

                    case "ImageCapture":
                    var options = "";
                    console.log("IC");
                    options += '<p>'+formData[formPart][1]+'</p>';
                    options += '<a data-role="button" data-rel="dialog" formPart="'+formPart+'"id="Cap-'+formPart+'">Capture Barcode</a>';
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
                    options += '<p>'+formData[formPart][1]+'</p>'
                    options += '<a data-role="button" data-rel="dialog" formPart="'+formPart+'"id="VCap-'+formPart+'">Capture Video</a>'
                    options += '<p id="VCap-'+formPart+'-Data"></p>'
                    console.log(options);
                    formIDs.push(["VideoCapture", "ACap-"+formPart+"-Data"]);
                    $('#formContent').append(options);
                    $('#VCap-'+formPart).on("tap",function(event){
                    window.scannedformpart = $(this).attr("formPart");
                    navigator.device.capture.captureVideo(function(mediaFiles){
                       window.picpath = mediaFiles[0].fullPath;
                    window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, goMove, function(error){console.log("Could not get temp folder");});
                    function goMove(fileSys){
                        window.picRoot = fileSys.root;
                        window.resolveLocalFileSystemURI(window.picpath, renameFile,function(error){window.resolveLocalFileSystemURI("file://"+window.picpath, renameFile,function(error){alert("REALLY FAILED:" + "file://"+window.picpath);})});
                    }
                        function renameFile(fileentry){
                            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                               var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                                return v.toString(16);
                              });
                            console.log(guid);
                            fileentry.copyTo(window.picRoot, guid+fileentry.name, function(fe){console.log("MOVE SUCCESS: "+window.scannedformpart); $("#VCap-"+window.scannedformpart+"-Data").html(fe.fullPath);}, function(){console.log("MOVE FAILED!");});
                        }
                        
                    
                    }, function(error){alert('Error Capturing');}, {limit:1});
                    });
                    break;
                    case "AudioCapture":
                    console.log("AC");
                    options = "";
                    options += '<p>'+formData[formPart][1]+'</p>'
                    options += '<a data-role="button" data-rel="dialog" formPart="'+formPart+'"id="ACap-'+formPart+'">Capture Audio</a>'
                    options += '<p id="ACap-'+formPart+'-Data"></p>'
                    console.log(options);
                    formIDs.push(["AudioCapture", "ACap-"+formPart+"-Data"]);
                    $('#formContent').append(options);
                    $('#ACap-'+formPart).on("tap",function(event){
                    window.scannedformpart = $(this).attr("formPart");
                    navigator.device.capture.captureAudio(function(mediaFiles){
                        window.picpath = mediaFiles[0].fullPath;
                    window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, goMove, function(error){console.log("Could not get temp folder");});
                    function goMove(fileSys){
                        window.picRoot = fileSys.root;
                        window.resolveLocalFileSystemURI(window.picpath, renameFile,function(error){window.resolveLocalFileSystemURI("file://"+window.picpath, renameFile,function(error){alert("REALLY FAILED:" + "file://"+window.picpath);})});

                    }
                        function renameFile(fileentry){
                            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                               var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                                return v.toString(16);
                              });
                            console.log(guid);
                            fileentry.copyTo(window.picRoot, guid+fileentry.name, function(fe){console.log("MOVE SUCCESS: "+window.scannedformpart); $("#ACap-"+window.scannedformpart+"-Data").html(fe.fullPath);}, function(){console.log("MOVE FAILED!");});
                        }



                    }, function(error){alert('Error Capturing');}, {limit:1});
                    });
                    break;
                    case "PictureCapture":
                    console.log("PC");
                    options = "";
                    options += '<p>'+formData[formPart][1]+'</p>'
                    options += '<a data-role="button" data-rel="dialog" formPart="'+formPart+'"id="PCap-'+formPart+'">Capture Picture</a>'
                    options += '<p id="PCap-'+formPart+'-Data"></p>'
                    console.log(options);
                    formIDs.push(["PictureCapture", "PCap-"+formPart+"-Data"]);
                    $('#formContent').append(options);
                    $('#PCap-'+formPart).on("tap",function(event){
                    window.scannedformpart = $(this).attr("formPart");
                    navigator.device.capture.captureImage(function(mediaFiles){
                    window.picpath = mediaFiles[0].fullPath;
                    window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, goMove, function(error){alert("Could not get temp folder");});
                    function goMove(fileSys){
                        window.picRoot = fileSys.root;
                        window.resolveLocalFileSystemURI(window.picpath, renameFile,function(error){window.resolveLocalFileSystemURI("file://"+window.picpath, renameFile,function(error){alert("REALLY FAILED:" + "file://"+window.picpath);})});
                    }
                        function renameFile(fileentry){
                            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                               var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                                return v.toString(16);
                              });
                            console.log(guid);
                            fileentry.copyTo(window.picRoot, guid+fileentry.name, function(fe){console.log("MOVE SUCCESS: "+window.scannedformpart); $("#PCap-"+window.scannedformpart+"-Data").html(fe.fullPath);}, function(){alert("MOVE FAILED!");});
                        }



                    }, function(error){alert('Error Capturing');}, {limit:1});
                    });
                    break;
                    case "Geolocation":
                    console.log("GL");
                    options = "";
                    options += '<p>'+formData[formPart][1]+'</p>'
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
                if(formPart+1 != formData.length){
                    $('#formContent').append("<hr>");
                }

            }
    console.log("COMPLETE");
    $.mobile.changePage("#form","slide");
    $('#formContent').trigger("create");
}



 window.getData = function(){
    
    $.mobile.allowCrossDomainPages = true;
    $.mobile.showPageLoadingMsg("a", "Submitting");
    formValues=[];
    for (var formPart = 0; formPart < formIDs.length; formPart++) {
        switch(formIDs[formPart][0]){
            case "select":
            formValues.push([formData[formPart][1], $('#'+formIDs[formPart][1]).val()]);
            break;
            case "MultipleChoice":
            formValues.push([formData[formPart][1], $('input:radio[name="'+formIDs[formPart][1]+'"]:checked').val()]);
            break;
            case "CheckBoxes":
              var allVals = [];
             $(':checkbox[name="'+formIDs[formPart][1]+'"]:checked').each(function() {
                allVals.push($(this).val());
              });
            formValues.push([formData[formPart][1], allVals.join(";")]);
            break;
            case "ImageCapture":
            formValues.push([formData[formPart][1], $('#'+formIDs[formPart][1]).html()]);
            break;
            case "AudioCapture":
             var AudioPathComponents = $("#ACap-"+formPart+"-Data").html().split("/");
                var AP = $("#ACap-"+formPart+"-Data").html();

              var options = new FileUploadOptions();

               options.fileKey = "upFile";
               options.fileName = AudioPathComponents[AudioPathComponents.length-1];
                options.mimeType = "audio/amr";

             var filer = new FileTransfer();
            $.mobile.showPageLoadingMsg("a", "Uploading");
            console.log("Audio Upload path: " + AP);
            filer.upload(AP, encodeURI("http://app.d2dpro.com/upload_audio.php"), function(r){alert("Audio Upload complete");}, function(error){alert("Audio Upload Failed");},options);
            formValues.push([formData[formPart][1], AudioPathComponents[AudioPathComponents.length-1]]);
            break;
            case "VideoCapture":

            var AudioPathComponents = $("#VCap-"+formPart+"-Data").html().split("/");
                var AP = $("#VCap-"+formPart+"-Data").html();

              var options = new FileUploadOptions();

               options.fileKey = "upFile";
               options.fileName = AudioPathComponents[AudioPathComponents.length-1];
                options.mimeType = "video/3gpp";

             var filer = new FileTransfer();
             $.mobile.showPageLoadingMsg("a", "Uploading");
             console.log("Video Upload path: " + AP+" ");
             filer.upload(AP, encodeURI("http://app.d2dpro.com/upload_video.php"), function(r){alert("Video Upload complete");}, function(error){alert("Video Upload Failed");},options);

            formValues.push([formData[formPart][1], AudioPathComponents[AudioPathComponents.length-1]]);
            break;
            case "PictureCapture":
             var AudioPathComponents = $("#PCap-"+formPart+"-Data").html().split("/");
                var AP = $("#PCap-"+formPart+"-Data").html();

              var options = new FileUploadOptions();

               options.fileKey = "upFile";
               options.fileName = AudioPathComponents[AudioPathComponents.length-1];
                options.mimeType = "image/jpg";

             var filer = new FileTransfer();
            $.mobile.showPageLoadingMsg("a", "Uploading");
            window.ftAuuid="";
            console.log("Picture Upload path: " + AP);
            filer.upload(AP, encodeURI("http://app.d2dpro.com/upload_pic.php"), function(r){alert("Picture Upload complete");}, function(error){alert("Picture Upload Failed");},options);
            formValues.push([formData[formPart][1], AudioPathComponents[AudioPathComponents.length-1]]);
            break;
            case "Geolocation":
            formValues.push([formData[formPart][1], $('#'+formIDs[formPart][1]).html()]);
            default:
            break;
        }
    }
    $.mobile.hidePageLoadingMsg();
    console.log("FORMSUBMISSION="+JSON.stringify(formValues));
    $.ajaxSetup({async: false});
    $.post("http://app.d2dpro.com/submit_form.php", {"formsubmission":JSON.stringify(formValues),"formID":window.currentFormID,"deviceID":window.devid,"userID":window.userID, "latitude":window.latitude, "longitude":window.longitude;}).done(function(){$.mobile.changePage("#formSelect");$.mobile.hidePageLoadingMsg();});
    
}
 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        if(localStorage["deviceID"]){
            window.devid = localStorage["deviceID"];
            console.log("Loaded GUID: " +window.devid);
            $('#devIDP').html(window.devid);
        }else{
            console.log("Generating GUID: ");
            window.devid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                               var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                                return v.toString(16);
            });
            localStorage["deviceID"]=window.devid;
            console.log("Created GUID");
            $('#devIDP').html(window.devid);
        }
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
            $.mobile.allowCrossDomainPages = true;
            
            $('#locSettings').on('pagehide',function(event,ui){
               switch($('input:radio[name="geomin"]:checked').attr("content")){
                case "5":
                    inter = 5;
                    clearInterval(window.lastInterval);
                    doGeoPush();
                    break;
                case "10":
                    inter = 10;
                    clearInterval(window.lastInterval);
                    doGeoPush();
                    break;
                case "15":
                    inter = 15;
                    clearInterval(window.lastInterval);
                    doGeoPush();
                    break;
                case "never":
                    inter = 10000;
                    clearInterval(window.lastInterval);
               }
            });

            $('#formSelect').on('pageshow',function(event,ui){
                $.mobile.hidePageLoadingMsg();
            });
            
            $('#submitButton').on("tap", function(){
                navigator.geolocation.getCurrentPosition(function(position){window.latitude = position.coords.latitude; window.longitude =position.coords.longitude;}, function(error){alert('Error Capturing Location');});
                //console.log($('#formContent').serialize());
                getData();

            });

            $('#logi').on("tap",function(event){
                $.mobile.showPageLoadingMsg("a", "Logging In");
                $.ajax({
                  type: "POST",
                  url: "http://app.d2dpro.com/login.php",
                  data: {"userid":$('#userIDBox').val(), "password":$('#uPasswordBox').val()},
                  async: false,
                  cache: false,
                  dataType: "text",
                  success: function(data){
                    if(data == "SUCCESS"){
                        $.mobile.changePage("#formSelect");
                        window.userID = $('#userIDBox').val();
                        loadForms();
                        $.mobile.hidePageLoadingMsg();
                        $.post("http://app.d2dpro.com/checkin.php", {"deviceID":window.devid,"userID":window.userID});
                    }else{
                        alert(data);
                        $.mobile.hidePageLoadingMsg();
                        $('#userIDBox').removeAttr("disabled");
                        $('#uPasswordBox').removeAttr("disabled");
                    }
                },
                error: function(){
                    alert("Failed to login. Internet issues?");
                    $.mobile.hidePageLoadingMsg();
                    $('#userIDBox').removeAttr("disabled");
                    $('#uPasswordBox').removeAttr("disabled");
                }
                });
                
            });
                $('#entries').on('pagebeforeshow',function(event){
                    $("#entriesList").html("");
                  $.getJSON("http://app.d2dpro.com/get_form_data.php",{"userID":window.userID}).done(function(data){

                        for(var iter=0; iter<data.length;iter++){
                            options = '<li data-role="list-divider">'+data[iter][0]+'</li>'
                            for(var z=0; z<data[iter][2].length;z++){
                                options += '<li><a href="#entries_detail" class="detail_shower" subID="'+data[iter][2][z][1]+'">'+data[iter][2][z][0]+'</a></li>';
                            }
                            $('#entriesList').append(options);
                            $('#entriesList').trigger("create");
                            $('#entriesList').listview('refresh');
                        }
                        console.log($('#entriesList').html());
                        formDetailHandle();
                    });
            });
                $('#entries_detail').on('pagebeforeshow', function(event) {
                    $('#entries_detail_header').trigger("create");
                    $('#entries_detail_content').trigger("create");
                    $('#entries_detail').trigger("create");
                });
                $('#mapScreen').on('pageshow',function(event){
                    pos_to_load='43.7269293272409,-79.78293826776662';
                    $('#mapdiv').gmap({'disableDefaultUI':true}).bind('init',function(event,map){
                        $('#mapdiv').gmap('addMarker', {'position': pos_to_load, 'bounds': true } );
                    });

                    console.log("Map DONE");
                })
        });



app.receivedEvent('deviceready');
},
    // Update DOM on a Received Event
    receivedEvent: function(id) {


    }
};
