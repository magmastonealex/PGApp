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
var formData=JSON.parse('{"form":[["text",["This is text data, as a test element."]],["select","Name",["Option 1","Option 2"]]]}');
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
        $('#logi').on("tap",function(event){

            $.mobile.showPageLoadingMsg("a", "Logging In");
            $.mobile.changePage("#formSelect");
            $.mobile.hidePageLoadingMsg();
        });

        $('.formlink').on("tap",function(){
            //Populate the form page with proper content here.
            $('#formContent').html("");
            console.log(this.id);
            $('#FormName').html($(this).html());
            for (var formPart = 0; formPart < formData["form"].length; formPart++) {
            switch(formData["form"][formPart][0]){
                case "text":
                    console.log("Text");
                    $('#formContent').append("<p>"+formData["form"][formPart][1]+"</p>");
                    break;
                case "select":
                    console.log("Select");
                    var options = "";
                    options += '<p>'+formData["form"][formPart][1]+"</p>";

                    options +='<select name="select1" id="select1">';
                    
                    for (var i = 0; i < formData["form"][formPart][2].length; i++) {
                        options += '<option>'+formData["form"][formPart][2][i]+'</option>';
                    }
                    options += '</select>';
                    $('#formContent').append(options);
                    console.log($('#formContent').html());
                    break;
                default:
                    console.log("Unknown... work to do");
                    break;
            }
            if(formPart+1 != formData["form"].length){
            $('#formContent').append("<hr>");
        }
        }
        $('#formContent').append('<a data-role="button" href="#formSelect" id="submitButton">Submit</a>')
        });
    });
   app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        
    }
};
