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
 window.signatureMPad=0;
window.intervalUpdate = function(str, callback) {
        cordova.exec(callback, callback, "LocPlugin", "intervalUpdate", [str,window.userID,window.devid]);
};
window.openSigner=function(){
    cordova.exec(function(){alert("success")}, function(){alert("failed")}, "LocPlugin", "presentView", [window.devid]);
}
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

function updatedSig(data){
    //data = 'iVBORw0KGgoAAAANSUhEUgAAAhwAAAB4CAIAAAA2ZrxOAAAAHGlET1QAAAACAAAAAAAAADwAAAAoAAAAPAAAADwAAARKyVZ/CAAABBZJREFUeAHs2euOqyAUBtC+/0vP4aSJIait0q1yWfOLKm5hQf1i5/XnjwABAgQIBAm8guooQ4AAAQIE/oSKTUCAAAECYQJCJYxSIQIECBAQKvYAAQIECIQJCJUwSoUIECBAQKjYAwQIECAQJiBUwigVIkCAAAGhYg8QIECAQJiAUAmjVIgAAQIEhIo9QIAAAQJhAkIljFIhAgQIEBAq9gABAgQIhAkIlTBKhQgQIEBAqNgDBAgQIBAmIFTCKBUiQIAAAaFiDxAgQIBAmIBQCaNUiAABAgSEij1AgAABAmECQiWMUiECBAgQaDdUXlt/FowAAQIEWhboLFRS0LSsaWwECBCYXKDdZ/TWi8r/Y5MvmOkTIECgZYGmn9FypeWtY2wECBBYCwiVtYkjBAgQIFAp0HSopDltvqxUztVlBAgQIHCxQJeh4j8rF+8K5QkQIFApIFQq4VxGgAABAmuB1kMljXjzFzAvK+u1dIQAAQKPCwiVx5fAAAgQIDCOgFAZZy3NhAABAo8LdBwqfgF7fPcYAAECBAoBoVKA+EiAAAEC9QIdhEqa3N7/6r2s1K+8KwkQIHCBgFC5AFVJAgQIzCrQX6iklcpfXGZdOPMmQIBAiwLdh4pfwFrcVsZEgMCsAl2GSlosLyuz7ljzJkCgaQGh0vTyGBwBAgT6EhAqfa2X0RIgQKBpAaHS9PIYHAECBPoSGCFU/K++rz1ntAQIDCzQa6ikJfG/+oH3pakRINCpwCCh4mWl0/1n2AQIDCYgVAZbUNMhQIDAkwIdh0pi8wvYk3vHvQkQILASGCdU/AK2WlwHCBAgcLdA36GStLys3L1l3I8AAQL7AkOFipeV/YV2hgABAncI9BcqRXLkbyrFqTv83GMmAZttptU210qB7kMlzTv/qlcyuGxEgXxjVLTfJB8uHNHMnAj8KtBHqKRZ5t/tYtL5qdQuzvo4rUCxMcI/Tgtr4gQ+CHTzCM6fCOv5fD677u/IDAL5rriiPYOhORI4KzBgqKTHx1mFs/2veELlNc+OR/9NgZz0uvbmrR0kMK3A5c/fKNn8obCumZ9N7XWHH48U9e/5+OOYXV4IWLUCxEcCVwjEP3+vGGWqmT8RNm/xtcPmVV8P5mUfaX8doQ5fBR5ZuOWmX4enA4GRBMYMlfR9/n2RlodCI43fZzRJhevWKwEGFp9kOUxzNoGAh+89ZPmXee+OR/rsXZsfz+vstfP+ge292y3HA+81RqlFpq6RIxyvsFx1/JLjPZfiGgR6FBg2VNJ3uHo99r7/1QXPXrg3gOX42YJD9l80TjWOUBwvWFQ7fuGHnkVNHwn0JVD/5L1znh++gbGn3pNa17xzsvm91iN5H8n7TNLeozh4/LjSwYJ5t73ieZ/j7b1qjhPoQuAfAAAA///R8ZB9AAAKAElEQVTtXOEO5iYMu/d/6Y2JKfOSkKYUWuDz/QrBcRxDP6TT6f78tcOfP9/9WcEeO/0Kqt7RYGfPZJ5oU/xCpfK4FIwEuHs3FhIGdGBHB/4sLvruBzkJv4JLONoKeqZqwGEz8UAx2M6lRYCKBa/yshQAAzpwqgN8VOR7TwUf3gPU96GMd1rjsEE8Qwy2C/gRlokDKm7RgZMc2PJRuTwA9ZFf4itAVcXLJOdAGOoZSLsaFY6p4nekYtNMR8S7cYaEGDpwjANLPyruJ1qSGfexNoNHDNZexlg4NUYlUxt9Qo7TqfhlPdg90xrxrTjDQwwdOMOB1A/0V6M++URtbX4KW5vJ5Pn7kKihj2HNKpxLxZ8IRg15AVgVxHlCIunApg4s+qgEn2XZynuNPH1VlaHWIttlnG+XRGLHZMnKMBynFX+iH8XkBWBVJs4zE0kH9nLgxg/0m4PFn2VeieLJFxakqi1LKbdbQUaqHgbY4iHVCuU4joq/lYdiMkoQX+NaZfOYyTATQwd2dOC/H8ql1OPnV+KiDTN5qVhVebpr3XLFHy/zrV0kkruAXZI4iIpXGAElZfQgvsaqygIwo8Bc0oHdHTj8USnHgx+w+83HR5gst7AgE3d0dxWbi1k8qUbA5VLK88IQWeN4EIuXTFzIXTqwkQOLPirFQfnebHDL30/KbVM3kx8Ey/NViyBRvIoXUYgyUCHmbYzIGluMm7GFknHxTNKBjRw4/1GphyEf7a2PXw5SlZelbMWBLXQzt0hi8Dq77qQquY5aUYIKJakCxNRYAeKlLVeZuJy7dGBlB7I/jl/NoD62ux+wWz4vGbiUadoqV7Ut2Dp5Jdgu15FqlaBau1sziKlxCxnkLYlkgqpgS8pLEMC4RQemOrD65cPvRGLriGytGaDgjELElxhL1NZqS5TqxqsJtnpQtt2tmQymVWvzyKZiCw4yqrYsAzC36MAkBzqvnb2+826w7YVe2N0DMsGAuLVOfOn5OlIvleAsLhgBJXYxHUlFi8skG5bUOFlIGB0Y6EDnJ2Gvr2QGiqtUwvyDQXEApx7iLRK+Fg9R/g4JeuJ2vAS4Vfkk8qs4JlFgXMaF3KUDAx0Y/6jIVR6pUkjvBy0ZlqmFbOUtAzOxAy0nl8rjCEoYbtVYAYYsbReVibso8DydsQzu/qwDEx+VgbfZ/U5s8tYp2vKHgluEzFsHbp3Uy2BUq1rjVo0VYODS9pJMsovgJUgWEkYHnjjQ+ajUlnJZM8EjlWGDSczdtKFYbv7jQLe3LxSqE8KOuIX5qTE2VXHcV4FlGVdxlw48dGDM5y339TK4K/eSUAB3mREvJBggII6x6jfjwJ/AkKDqwy0lWJS08gKYGqjuuIz7IrLGMZ67dOChA2MelSrCXt8gk9QdMLhbSVoFc6lqUiHrMsB/u4VqXSUIuIxdhlbyCdtl7csAnFFau0nZfS1AGSp2NShMXbpIJunAEAdGPipVkHuJW8nLGeJCu3tJGAMs4SKZIvuWEouPB7/cvex+yVABMU+SZDZMiSztbGa2hha/UmKXbqGFlYyLZJIOPHRg/MVyr+9lsjXGZaELaLHFeZeqO9nq1U1YCwttB0NLTDKf6fg+VbJjHwxHLgy4LHEf58AqpQeXrS6IqXELyTwdeOLAxM/DXuIg05ohKOFWhwMtn+O8bVTxKh+TqF1V6y5VyZtLV09NvinjsldeZwt52YIAOnDLgYmPStXRuspuviXdBR+ZLA68M1fLaptXehAQbCEsjhWJXcblk3atDMlM6viEVrTZQNFeAhSeSzpw14HBj4q9sh0ZO0MHyaYldvaSmTeL204lVfdgV23dWqou7vIW4RCwlTGEdh6JFVwzqqOFKQCXdKDbgRUfFbnxMpVkSiBJDBDAuMMBNFPFyKa2yjLetfjLDBK24kuSUQArYBTzJB4rWGVqX5XE5SRhpP0dB/zf6O758XYOj/OqbOug1oJ/PINeKStwq8YIsLvdGaRtxd3ktwqx+63CD8Go2Y2rtmDrQ/FsvbsDOz0q8g1cmi5IG7RqLfLHM9UoNMG17hLgVuWTyK/iPEk3UnUsy26q9wut+HzmfbXseIwD33wk+cudQbYOI6htlYzNWwEtfotcM4P6rULcHR7bdpIZ3ksIpYUEsrVRIOJVICOofFnKFgM6cNeBL2+PvcoPM63hLW0LOSP/SXfb9IXMDPcUZzCFQj5ftno9Z/6EoTVOyVc9FvCJTjbd3YEvH5XWVbaXuzsTt3jn8Kz4d/pmulhtTzKZjqMwgc7ZLUbxf8IT+Ga3PlHIprs7cPijIt9JOSeJVfDOEX7S9O5oSmR+ebfRc/yltictYvInzOvUxjPi7jqaqWQLB75/VMQmvMfvxyJjUqAmmtRlLK3S3FqObXqLrSXJ5pO0ttDNJNlWhrlzxcmVx6G2dRxY6FGppsTXet7uC0eC4l9oN6oFynbjUY2e8LjC3GTcxZYIHrckuXuAQ13Guw9L/e84cOyjUuy7/EhcwDzfVbt5jYYzK+XucnjTDkJXmJu05C6sJAVpAbJ1QGCna2UOGJYjTHXgv29mapsO8tadTuaxY7IEYVg+MH6hxUC1QoWy87GUvx/kRQZIJdsiFeCApZ2xlTlgWI4wyYHlHhW8xGVmXPbFYtytcqkaGygNY8lfYFP6Hy5fEFxbdOhsaUOqFmb3PM7YinefkfrnObD6oyKTty53Mi88JUiWFBhWDYlV6yGcH5Kocd5Zds/7RJ40VSSSPzJQw9rlkVNzqIcOjP/dfCoIbi5SQfpRiJw1vqSzJU8y2O4Jz1K1ONRPxUudwiQxwYFO6kjarR3Y5lGpLgf3++6WOrZMuSrpW2KjPoYtqnDMg+MtzmKUSHuOo5jJc5IDyz0qSXPt/VaZwqMy7tK2c2GYtCW3MgOpbvVdCowmfBu7tuQlueVnJ9GcsyfldH0O7Pqo1Gnxfrfigmxtufkkc5/dSkw3yW8WuufVkbzrXtDiLhXxdOB4B/Z+VOR4gs9+0pa0TgaujGQtYUs5gEe5lDCKoQMrOHDIo1KtxK/9hThzfrGMDAMxdIAO0IGNHDjqUam+x7/j83bVqWcaqRIu6QAdoAO7O3DgoyJHkvlZF0ytkuXUQBQyoAN0gA4c5sDJj0o9quTz4J5rsjYJc1swSQfoAB04yQE+Kv++CHcPNfmQVNhdcuLpAB2gA5s6cP6jIgcTPwMC6wtc8j4qVtEBOkAH9nXghx6VfQ+JyukAHaADuzjAR2WXk6JOOkAH6MAGDvBR2eCQKJEO0AE6sIsDfFR2OSnqpAN0gA787z+dWtMOPiprngtV0QE6QAccB/DfBDnbC6T4qCxwCJRAB+gAHcg5wEcl5xNRdIAO0AE6kHCAj0rCJELoAB2gA3TgFAf411+nnCTnoAN0gA4s4AAflQUOgRLoAB2gA6c48Dfyk+iJ7El6OAAAAABJRU5ErkJggg==';
    console.log("Updated Signature "+data);
    window.signaturedata = data;
    $("#signatureImage").attr("src", "data:image/png;base64,"+data);
}
function loadForms(){
    $.ajaxSetup({async: true, error: function(error){
        alert("Using stored data, this might not be the most recent version.");
        window.allForms = $.parseJSON(localStorage["formList"]);
        for (var formNumber = 0; formNumber < window.allForms.length; formNumber++) {
                    formLinkOptions = '<li><a href="#form" class="formlink" formID="'+allForms[formNumber][0]+'" formNumber="'+formNumber+'" data-transition="slide">'+allForms[formNumber][1]+'</a></li>'
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
                    formLinkOptions = '<li><a href="#form" class="formlink" formID="'+allForms[formNumber][0]+'" formNumber="'+formNumber+'" data-transition="slide">'+allForms[formNumber][1]+'</a></li>'
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
        //alert("D:loaded_logo");
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
    //alert("D:popping");
    $.ajaxSetup({async: true, error: function(error){alert("Error downloading Detail");}});
            
        $.getJSON("http://app.d2dpro.com/view_result.php", {"subID":subID}).done(function(data){
            //alert("D:loaded");
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
        //alert("D:done");
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
                    options += '<input type="text" onSubmit="return false;" id="text-'+formPart+'"><br>';
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
                    options += '<div><p>'+formData[formPart][1]+'</p><br><center><a onclick="window.openSigner();" data-role="button">Sign</a><br><img id="signatureImage"src=""></img></center></div>';
                    formIDs.push(["sign", "know"]);
                    $('#formContent').append(options);
                    //$("#signcanvas-"+formPart).css("background", "#888");
                    //sipad = new SignaturePad(document.getElementById("signcanvas-"+formPart));
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
    console.log("COMPLETE");
    $.mobile.changePage("#form","slide");
    $('#formContent').trigger("create");
}


window.getData = function(){
    
    $.mobile.allowCrossDomainPages = true;
    $.blockUI({ message: '<p>Submitting Form</p>' });
    formValues=[];
    window.bailForm = false;
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
            //signpad = new SignaturePad(document.getElementById("signcanvas-"+formPart));
            formValues.push([formData[formPart][1],"data:image/png;base64,"+window.signaturedata]);
            break;
            case "AudioCapture":
             var AudioPathComponents = $("#ACap-"+formPart+"-Data").html().split("/");
                var AP = $("#ACap-"+formPart+"-Data").html();
                if($("#ACap-"+formPart+"-Data").html() ==""){
                    if(!confirm("Sure you don't want to add audio?")){
                        window.bailForm = true;
                    }
                }
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
                if($("#VCap-"+formPart+"-Data").html() ==""){
                    if(!confirm("Sure you don't want to add video?")){
                        window.bailForm = true;                    
                    }
                }
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
                if($("#PCap-"+formPart+"-Data").html() ==""){
                    if(!confirm("Sure you don't want to add a picture?")){
                        window.bailForm = true;
                    }
                }
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
    if(window.bailForm == false){
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
    } else{
        console.log("Did not submit form");
        $.unblockUI();
        $.mobile.hidePageLoadingMsg();
    }
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
function doDrawing() {

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
            //window.signatureMPad = new SignatureCapture("signaturecanvas");
            var wHeight = $(window).height();
            var d2dHeight = $("#d2dheight").height();
            var dashHeight=(wHeight-d2dHeight)*0.7;
            $("#dashGrid").css("height", dashHeight+"px");
            $("#mapdiv").css("height", wHeight*0.75);
            $.mobile.listview.prototype.options.headerTheme = "a";
            $.mobile.page.prototype.options.addBackBtn = true;
            if(localStorage["lastuser"]){
            console.log("Retreived" + localStorage["lastuser"]);
            $("#userIDBox").attr("value", localStorage["lastuser"]);
            $("#userIDBox").attr("placeholder", "");
            }
            $('#deviceident').html(window.devid);
            $.mobile.allowCrossDomainPages = true;

            $("#formContent").submit(function(){
                return false;
            });
            
            $('.changerbutton').on('tap', function(event){
                var togoto = $(event.target).attr("goto");
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
                $('#signhere').on('pagebeforeshow',function(event){
                    $("#signaturePage").height(300);
                    
                });
                $('#signhere').on('pageshow',function(event){
                    $("#signaturePage").jSignature();
                    $("#signaturePage").jSignature("reset");
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
