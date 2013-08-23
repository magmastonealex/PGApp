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
 window.formsToSend=[];
 window.toupload=[];
window.intervalUpdate = function(str, callback) {
        cordova.exec(callback, callback, "LocPlugin", "intervalUpdate", [str,window.userID,window.devid]);
};

function geoManual(){
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
}

 function doGeoPush(){
    window.intervalUpdate(inter.toString(), function(e){console.log("Done!");});

 }


function loadForms(){
    $.ajaxSetup({async: true, error: function(error){
        alert("Using stored data, this might not be the most recent version.");
        window.allForms = $.parseJSON(localStorage["formList"]);
        for (var formNumber = 0; formNumber < window.allForms.length; formNumber++) {
                    formLinkOptions = '<li><a href="#form" class="formlink" formID="'+allForms[formNumber][0]+'" formNumber="'+formNumber+'" data-transition="pop">'+allForms[formNumber][1]+'</a></li>'
                    $('#linksForm').append(formLinkOptions);
        }
        setupPageClickHandler();
    }});
    $.getJSON("http://app.d2dpro.com/get_form.php", {"userID":window.userID}).done(function(data){
                $.get("http://app.d2dpro.com/get_form.php", {"userID":window.userID}).done(function(data){
                    localStorage["formList"] = data;
                });
                $('#linksForm').html("");
                allForms = data;
                console.log("GOT DATA" + data);
                for (var formNumber = 0; formNumber < data.length; formNumber++) {
                    formLinkOptions = '<li><a href="#form" class="formlink" formID="'+allForms[formNumber][0]+'" formNumber="'+formNumber+'" data-transition="pop">'+allForms[formNumber][1]+'</a></li>'
                    $('#linksForm').append(formLinkOptions);
                }
                
                setupPageClickHandler();
            });
    $.ajaxSetup({async: true,error: function(error){alert("Error downloading");}});
}

function loadCompanyImage(){
    //Data is link to logo.
    $.ajaxSetup({async: true, error: function(error){alert("Error downloading");}});
    $.post("http://app.d2dpro.com/get_logo.php", {'userID':window.userID}).done(function(data){
        $("#companylogo").attr("src", data);
    });
    
}


function setupPageClickHandler(){
    $('.formlink').on("tap",function(){
                console.log("Entering form");
                window.currentFormID = $(this).attr("formID");
                formData = window.allForms[$(this).attr("formNumber")][2];
                updateData($(this).html());
                console.log("Entering form Done");
    });
}

function populate_detail(subID){

    $.ajaxSetup({async: true, error: function(error){alert("Error downloading Detail");}});
            
        $.getJSON("http://app.d2dpro.com/view_result.php", {"subID":subID}).done(function(data){
            
            console.log(JSON.stringify(data));
            $("#entries_detail_content").html("");

            $("#entries_detail_content").trigger("create");
            options = "";
            for(var iter=0; iter<data.length;iter++){
                
                options +='<center><table style="width:100%"><tr><td style= "padding-bottom:0px;"><div data-role="header">';
                options += "<h1>"+data[iter][0][0]+"</h1 ></div></td></tr>";
                 switch(data[iter][0][1]){
                    case "PictureCapture":
                        options += '<tr><td class="ReviewText">'
                        options += '<div >'
                        options += '<img class="retImage" src="http://app.d2dpro.com/upload_picture/'+data[iter][1]+'"></img>';
                        options += '</div>'                       
                        options += '</td></tr></table></center>'
                        
                        break;
                    case "TextInput":
                        options += '<tr><td class="ReviewText">'
                        options += '<div >'
                        options += '<p><b>'+data[iter][1]+'</b></p>';
                        options += '</div>'
                        options += '</td></tr></table></center>'
                        
                        break;
                    case "select":
                        options += '<tr><td class="ReviewText">'
                        options += '<div >'
                        options += "<b>"+data[iter][1]+"</b>";
                        options += '</div>'
                        options += '</td></tr></table></center>'
                        
                        break;
                    case "MultipleChoice":
                        options += '<tr><td class="ReviewText">'
                        options += '<div >'
                        options += "<b>"+data[iter][1]+"</b>";
                        options += '</div>'
                        options += '</td></tr></table></center>'
                        
                        break;
                    case "CheckBoxes":
                        options += '<tr><td class="ReviewText">'
                        options += '<div >'
                        splitChecks = data[iter][1].split(";");
                        for(var SPI=0;SPI<splitChecks.length;SPI++){
                            options += "<b>"+splitChecks[SPI]+"</b><br>";
                        }
                        options += '</div>'
                        options += '</td></tr></table></center>'
                        
                        break;
                    case "BarcodeCapture":
                        options += '<tr><td class="ReviewText">'
                        options += '<div >'
                        options += "<b><p>"+data[iter][1]+"</p></b>";
                        options += '</div>'
                        options += '</td></tr></table></center>'
                        
                        break;
                    case "VideoCapture":
                        options += '<tr><td class="ReviewText">'
                        options += '<div >'
                        options +='<video src="http://app.d2dpro.com/upload_video/'+data[iter][1]+'" width="320" height="240" controls>';
                        options +='Not supported here!';
                        options +='</video>';
                        options += '</div>'
                        options += '</td></tr></table></center>'
                        
                        break;
                    case "AudioCapture":
                        options += '<tr><td class="ReviewText">'
                        options += '<div >'
                        options += '<audio controls>'
                        options += '<source src="http://app.d2dpro.com/upload_audio/'+data[iter][1]+'" type="audio/3gpp">';
                        options += 'Not supported!';
                        options += '</audio>';
                        options += '</div>'
                        options += '</td></tr></table></center>'
                        
                        break;
                    case "sign":
                        options += '<tr><td class="ReviewText">'
                        options += '<div>'
                        options +='<img src="'+data[iter][1]+'"></img>';
                        options += '</div>'
                        options += '</td></tr></table></center>'

                    default:
                        options += '<tr><td>'
                        break;
                }
                options += "<br>"
                

            }
            $("#entries_detail_content").append(options);
            $("#entries_detail").trigger("pagecreate");
            $("#entries_detail_content").trigger("create");

        });
        console.log($("#entries_detail_content").html());
        $("#entries_detail").trigger("create");
        window.hasinitteddetail = true;
}


function formDetailHandle(){
    $('.detail_shower').on("tap",function(event){
        console.log($(this).attr("subID"));
        if($(event.target).html() != undefined){
        $("#entries_detail_header").html('<h1>'+$(this).html()+"</h1>");
        $("#entries_detail").trigger("create");
        $("#entries_detail_header").trigger("create");
    }
        populate_detail($(this).attr("subID"));
        
    });
}


function updateData(name){
     console.log("GRABBING LOCATION JUST IN CASE");
     navigator.geolocation.getCurrentPosition(function(position){window.latitude = position.coords.latitude; window.longitude =position.coords.longitude;}, function(error){alert('Error Capturing Location');});
     console.log("PROCESSING");
            //Populate the form page with proper content here.
            $('#formContent').html("<br>");
            $('#FormName').html(name);
            formIDs = [];
                    options = "";
                    options += '<form onSubmit="return false;">'
                    options += '<br>';
                    $('#formContent').append(options);
                    $('#formContent').append("<hr>");
            for (var formPart = 0; formPart < formData.length; formPart++) {
                switch(formData[formPart][0]){
                    case "text":
                    console.log("Text");
                    $('#formContent').append("<p>"+formData[formPart][2][0]+"</p>");
                    formIDs.push(["text","text"]);
                    break;
                    case "TextInput":
                    console.log("TextInput");
                    options = "";
                    options += '<p>'+formData[formPart][1]+'</p>'
                    options += '<input type="text" id="text-'+formPart+'"><br>';
                    $('#formContent').append(options);
                    formIDs.push(["TextInput", "text-"+formPart]);
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
                    case "sign":
                    var options = "";
                    console.log("Signature");
                    options += '<div><p>'+formData[formPart][1]+'</p><br><center><canvas id="signcanvas-'+formPart+'" class="signer" style="border-style:solid;border-width:2px;border-color:white"></canvas></center></div>';
                    formIDs.push(["sign", "signcanvas-"+formPart]);
                    $('#formContent').append(options);
                    sipad = new SignaturePad(document.getElementById("signcanvas-"+formPart));
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

                    case "BarcodeCapture":
                    var options = "";
                    console.log("IC");
                    options += '<p>'+formData[formPart][1]+'</p>';
                    options += '<a data-role="button" data-rel="dialog" formPart="'+formPart+'"id="Cap-'+formPart+'">Capture Barcode</a>';
                    options += '<p id="Cap-'+formPart+'-Data"></p>';
                    options += '<p id="Cap-Data"></p>';
                    formIDs.push(["BarcodeCapture", "Cap-"+formPart+"-Data"]);
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
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, goMove, function(error){console.log("Could not get temp folder");});
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
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, goMove, function(error){console.log("Could not get temp folder");});
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
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, goMove, function(error){alert("Could not get temp folder");});
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
    $('#formContent').append("</form>");
    console.log("COMPLETE");
    $.mobile.changePage("#form","slide");
    $('#formContent').trigger("create");
}


window.getData = function(){
    
    $.mobile.allowCrossDomainPages = true;
    $.blockUI({ message: '<p>Submitting Form</p>' });
    formValues=[];
    for (var formPart = 0; formPart < formIDs.length; formPart++) {
        switch(formIDs[formPart][0]){
            case "select":
            formValues.push([formData[formPart][1], $('#'+formIDs[formPart][1]).val()]);
            break;
            case "TextInput":
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
            case "BarcodeCapture":
            formValues.push([formData[formPart][1], $('#'+formIDs[formPart][1]).html()]);
            break;
            case "sign":
            signpad = new SignaturePad(document.getElementById("signcanvas-"+formPart));
            formValues.push([formData[formPart][1],signpad.toDataURL()]);
            break;
            case "AudioCapture":
             var AudioPathComponents = $("#ACap-"+formPart+"-Data").html().split("/");
                var AP = $("#ACap-"+formPart+"-Data").html();

              var options = new FileUploadOptions();

               options.fileKey = "upFile";
               options.fileName = AudioPathComponents[AudioPathComponents.length-1];
                options.mimeType = "audio/amr";

             var filer = new FileTransfer();
            
            console.log("Audio Upload path: " + AP);
            filer.upload(AP, encodeURI("http://app.d2dpro.com/upload_audio.php"), function(r){alert("Audio Upload complete");}, function(error){alert("Audio Upload Failed. Will upload on next launch"); window.toupload.push(["audio",AP]);localStorage["uploadnext"]=JSON.stringify(window.toupload)},options);
            formValues.push([formData[formPart][1], AudioPathComponents[AudioPathComponents.length-1]+".mp4"]);
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
             filer.upload(AP, encodeURI("http://app.d2dpro.com/upload_video.php"), function(r){alert("Video Upload complete");}, function(error){alert("Video Upload Failed. Will upload on next launch"); window.toupload.push(["video",AP]);localStorage["uploadnext"]=JSON.stringify(window.toupload)},options);

            formValues.push([formData[formPart][1], AudioPathComponents[AudioPathComponents.length-1]+".mp4"]);
            break;
            case "PictureCapture":
             var AudioPathComponents = $("#PCap-"+formPart+"-Data").html().split("/");
                var AP = $("#PCap-"+formPart+"-Data").html();

              var options = new FileUploadOptions();

               options.fileKey = "upFile";
               options.fileName = AudioPathComponents[AudioPathComponents.length-1];
                options.mimeType = "image/jpg";

             var filer = new FileTransfer();
            
            window.ftAuuid="";
            console.log("Picture Upload path: " + AP);
            filer.upload(AP, encodeURI("http://app.d2dpro.com/upload_pic.php"), function(r){alert("Picture Upload complete");}, function(error){alert("Picture Upload Failed. Will upload on next launch"); window.toupload.push(["picture",AP]);localStorage["uploadnext"]=JSON.stringify(window.toupload)},options);
            formValues.push([formData[formPart][1], AudioPathComponents[AudioPathComponents.length-1]]);
            break;
            case "Geolocation":
            formValues.push([formData[formPart][1], $('#'+formIDs[formPart][1]).html()]);
            default:
            break;
        }
    }
    
    console.log("FORMSUBMISSION="+JSON.stringify(formValues));
    $.ajaxSetup({async: true, error:function(error){
        alert("Not connected? Will submit form on next connected");
        window.formsToSend.push([window.currentFormID,window.longitude,window.latitude,$('#form-user-name').val(),JSON.stringify(formValues)]);
        localStorage["FTS"] = JSON.stringify(window.formsToSend);
        $.mobile.changePage("#formSelect");
        $.unblockUI();
        $.mobile.hidePageLoadingMsg();
    }});
    $.post("http://app.d2dpro.com/submit_form.php", {"formsubmission":JSON.stringify(formValues),"formID":window.currentFormID,"deviceID":window.devid,"userID":window.userID, "latitude":window.latitude, "longitude":window.longitude, "name":$('#form-user-name').val()}).done(function(){$.mobile.changePage("#formSelect");$.unblockUI();$.mobile.hidePageLoadingMsg();});
    
}

function uploadSavedContent(){
    items = $.parseJSON(localStorage["uploadnext"]);
    for (var i = 0; i < items.length; i++) {
        switch(items[i][0]){
            case "audio":
             var AudioPathComponents = items[i][1].split("/");
                var AP = items[i][1].html();

              var options = new FileUploadOptions();

               options.fileKey = "upFile";
               options.fileName = AudioPathComponents[AudioPathComponents.length-1];
                options.mimeType = "audio/amr";

             var filer = new FileTransfer();
            
            console.log("Audio Upload path: " + AP);
            filer.upload(AP, encodeURI("http://app.d2dpro.com/upload_audio.php"), function(r){alert("Audio Upload complete");}, function(error){alert("Audio Upload Failed. Will upload on next launch"); window.toupload.push(["audio",$("#ACap-"+formPart+"-Data").html()]);localStorage["uploadnext"]=JSON.stringify(window.toupload)},options);
            break;
            case "video":

            var AudioPathComponents = items[i][1].split("/");
                var AP = items[i][1];

              var options = new FileUploadOptions();

               options.fileKey = "upFile";
               options.fileName = AudioPathComponents[AudioPathComponents.length-1];
                options.mimeType = "video/3gpp";

             var filer = new FileTransfer();
             $.mobile.showPageLoadingMsg("a", "Uploading");
             console.log("Video Upload path: " + AP+" ");
             filer.upload(AP, encodeURI("http://app.d2dpro.com/upload_video.php"), function(r){alert("Video Upload complete");}, function(error){alert("Video Upload Failed. Will upload on next launch"); window.toupload.push(["video",$("#VCap-"+formPart+"-Data").html()]);localStorage["uploadnext"]=JSON.stringify(window.toupload)},options);

            break;
            case "picture":
             var AudioPathComponents = items[i][1].split("/");
                var AP = items[i][1];

              var options = new FileUploadOptions();

               options.fileKey = "upFile";
               options.fileName = AudioPathComponents[AudioPathComponents.length-1];
                options.mimeType = "image/jpg";

             var filer = new FileTransfer();
            
            window.ftAuuid="";
            console.log("Picture Upload path: " + AP);
            filer.upload(AP, encodeURI("http://app.d2dpro.com/upload_pic.php"), function(r){alert("Picture Upload complete");}, function(error){alert("Picture Upload Failed. Will upload on next launch"); window.toupload.push(["picture",$("#PCap-"+formPart+"-Data").html()]);localStorage["uploadnext"]=JSON.stringify(window.toupload)},options);
            break;
        }
    }
    localStorage["uploadnext"] = "";
    $.mobile.hidePageLoadingMsg();
}
function uploadSavedForms(){
    items = $.parseJSON(localStorage["FTS"]);
    for (var i = 0; i < items.length; i++){
        $.post("http://app.d2dpro.com/submit_form.php", {"formsubmission":items[i][4],
            "formID":items[i][0],
            "deviceID":window.devid,
            "userID":window.userID,
            "latitude":items[i][2],
            "longitude":items[i][1],
            "name":items[i][3]});
    }
    localStorage["FTS"] = "";
    $.mobile.hidePageLoadingMsg();
}
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();

        

        if(localStorage["deviceID"]){
            window.devid = localStorage["deviceID"];
            console.log("Loaded GUID: " +window.devid);
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
        $(document).bind('mobileinit',function(){
            $.mobile.selectmenu.prototype.options.nativeMenu = false;
            $.mobile.listview.prototype.options.headerTheme = "a";
            $.mobile.page.prototype.options.addBackBtn = true;
        });
        $(document).ready(function(){

            var wHeight = $(window).height();
            var d2dHeight = $("#d2dheight").height();
            var dashHeight=(wHeight-d2dHeight)*0.7;
            $("#dashGrid").css("height", dashHeight+"px");
            $("#mapdiv").css("height", wHeight*0.75);
            $(".signer").css("height", "300px");
            $(".signer").css("width", $(window).width()*0.80+"px");
            $.mobile.listview.prototype.options.headerTheme = "a";
            $.mobile.page.prototype.options.addBackBtn = true;
            if(localStorage["lastuser"]){
            console.log("Retreived" + localStorage["lastuser"]);
            $("#userIDBox").attr("value", localStorage["lastuser"]);
            $("#userIDBox").attr("placeholder", "");
            }
            $('#deviceident').html(window.devid);
            $.mobile.allowCrossDomainPages = true;
            
            $('.changerbutton').on('tap', function(event){
                var togoto = $(event.target).attr("goto");
                console.log(event.target);
                console.log(togoto);
                console.log(event.target.id);
                $.mobile.changePage(togoto);
            });



            $('#locSettings').on('pagehide',function(event,ui){
               switch($('input:radio[name="geomin"]:checked').attr("content")){
                case "5":
                    inter = 5;
                    localStorage["intervalGeo"]=inter;
                    clearInterval(window.lastInterval);
                    doGeoPush();
                    break;
                case "10":
                    inter = 10;
                    localStorage["intervalGeo"]=inter;
                    clearInterval(window.lastInterval);
                    doGeoPush();
                    break;
                case "15":
                    inter = 15;
                    localStorage["intervalGeo"]=inter;
                    clearInterval(window.lastInterval);
                    doGeoPush();
                    break;
                case "never":
                    inter = 10000;
                    localStorage["intervalGeo"]=inter;
                    clearInterval(window.lastInterval);
                    doGeoPush();
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
                  data: {"userid":$('#userIDBox').val(), "password":$('#uPasswordBox').val(), "deviceID":window.devid},
                  async: true,
                  cache: false,
                  dataType: "text",
                  success: function(data){
                    if(data == "SUCCESS"){
                        $.mobile.changePage("#dashboard");
                        window.userID = $('#userIDBox').val();
                        loadCompanyImage();
                        loadForms();
                        $.mobile.hidePageLoadingMsg();
                        localStorage["lastuser"] = window.userID;
                        uploadSavedForms();
                        uploadSavedContent();
                        if(localStorage["intervalGeo"] != 0 && localStorage["intervalGeo"] != undefined){
                            window.inter = localStorage["intervalGeo"];
                            doGeoPush();
                        }else{
                            window.inter = 10;
                            doGeoPush();
                        }
                    }else{
                        alert(data);
                        $.mobile.hidePageLoadingMsg();
                        $('#userIDBox').removeAttr("disabled");
                        $('#uPasswordBox').removeAttr("disabled");
                    }
                },
                error: function(){
                    if(localStorage["lastuser"] != undefined){
                    
                    alert("Logging in using stored name: " + localStorage["lastuser"]);
                    
                    $.mobile.hidePageLoadingMsg();
                    $('#userIDBox').removeAttr("disabled");
                    $('#uPasswordBox').removeAttr("disabled");
                    $.mobile.changePage("#dashboard");
                    window.userID=localStorage["lastuser"];
                    loadForms();

                } else{
                    alert("Failed to login. Internet issues?");
                    $.mobile.hidePageLoadingMsg();
                    $('#userIDBox').removeAttr("disabled");
                    $('#uPasswordBox').removeAttr("disabled");
                }
                }
                });
                
            });
                $('#entries').on('pagebeforeshow',function(event){
                  $("#entriesList").html("");
                  $.getJSON("http://app.d2dpro.com/get_form_data.php",{"userID":window.userID}).done(function(data){
                    options = "";
                    for(var iter=0; iter<data.length;iter++){
                            options += '<li><div>'+data[iter][0]+'</div><ul data-theme="a" data-filter="true">'
                            for(var z=0; z<data[iter][2].length;z++){
                                options += '<li><a href="#entries_detail" class="detail_shower" subID="'+data[iter][2][z][1]+'">'+data[iter][2][z][0]+'</a></li>';
                            }
                            options += '</ul></li>';
                    }

                        console.log("Called pagebeforeshow");
                        $('#entriesList').append(options);
                        $('#entriesList').trigger("create");
                        $('#entriesList').listview("refresh"); 
                        formDetailHandle();
                    });
                });
                
                $('#entries_detail').on('pagebeforeshow', function(event) {
                    $('#entries_detail_header').trigger("create");
                    $('#entries_detail_content').trigger("create");
                    $('#entries_detail').trigger("create");
                });
                $('#entries_detail').on('pageaftershow', function(event){
                    $('#entries_detail_header').trigger("create");
                })
                $('#formSelect').on('pagebeforeshow',function(event){
                    $('#linksForm').trigger("create");
                    $('#linksForm').listview('refresh');
                });
                $('#dashboard').on('pageshow',function(event){
                    var divHeight=$("#ic1").height();
                    var divWidth=$("#ic1").width();
                    $(".innercenter").css("margin-top", "-"+divHeight/2+"px");
                    $(".innercenter").css("margin-left", "-"+divWidth/2+"px");
                    
                    if($("#ic1").height() > $("#cfs").height()){
                        var scalefactor = Math.floor(($("#cfs").height()/$("#ic1").height())*100);
                        $(".windowscale_height").css("width", scalefactor-5+"%");
                    }
                });
                $('#mapScreen').on('pageshow',function(event){
                    $('#mapdiv').gmap({'disableDefaultUI':true}).bind('init',function(event,map){
                        $.getJSON( 'http://app.d2dpro.com/get_locations.php',{"userID":window.userID}).done(function(data) {
                            console.log("Map START");
                            for (var dataiter=0; dataiter < data.length; dataiter++){
                            var position = data[dataiter][0]+","+data[dataiter][1];
                            var ourdata=data[dataiter][2];
                            var addmarkertoeval = "$('#mapdiv').gmap('addMarker', {'position': '"+position+"', 'bounds':true}).click(function(){var thisdata = '"+ourdata+"';populate_detail(thisdata);$('#mapdiv').gmap('openInfoWindow', {'content':'<a href=\"#entries_detail\" data-role=\"button\">"+data[dataiter][3]+"</a>'}, this);});"
                            console.log(addmarkertoeval);
                            eval(addmarkertoeval);
                            }
                            $('#mapdiv').gmap('refresh');
                            console.log("Map DONE");
                        });
                        });
                });
        
        });



app.receivedEvent('deviceready');
},
    // Update DOM on a Received Event
    receivedEvent: function(id) {


    }
};