Technical details of D2DPro mobile app.
======

The application is powered by Apache Cordova, with a few native plugins.
JQuery/jQuery Mobile are the primary frameworks powering the app.
The native plugins are used to provide background location updates, as well as signature processing.

The code is entirely hosted on GitHub, at https://github.com/magmapus/PGApp. For that reason, be sure to change the passwords of the database access scripts before you go into production with it.

Another reccomendation I'd make before you move into production is adding SSL support to the server, and the client. Otherwise, passwords are sent over the clear, which is quite insecure.


Adding forms
-----

From PHPMyAdmin, go to the "forms" table, then insert a new row. Leave formID blank (mySQL uses it as a key and autoincrements it.)
Name the form, and leave status as any number (I'm not certain what this is used for, if forms with status x shouldn't be included in the list, or something simaler, it won't be difficult to add to the SQL statement).
Remember the formID value for the new form,

Now go to the form_fields table, and insert new rows. Each row is one form element. Set formID to the formID that you remembered.

FldType is one of

- text - Read-only text for annotations or information - fldName can be anything, it's not used, fieldOptions is the text's content.
- TextInput - Text box - fldName is the annotation, fieldOptions is not used.
- BarcodeCapture - fldName is the annotation, fieldOptions is not used.
- select - fldName is the annotation, fieldOptions are the possible values, all separated by a ;
- PictureCapture - fldName is the annotation, fieldOptions is not used.
- MultipleChoice - fldName is the annotation, fieldOptions are the possible values, all separated by a ;
- CheckBoxes - fldName is the annotation, fieldOptions are the possible values, all separated by a ;
- VideoCapture - fldName is the annotation, fieldOptions is not used.
- AudioCapture - fldName is the annotation, fieldOptions is not used.
- sign - This is a signature pad. Only one is possible per page.

fldOrder defines the order - lowest to highest
fldStatus IS USED to choose which field is used for the "name"

Once all elements have been added, go to users_forms, and add a row, leaving id blank, userID should be the userid of the user getting access, and formID is the ID of the form just added.


Adding Users
-----

From PMA, go to users_passwords, and insert a new row. Add the userID, and the password. Select SHA1 as the function, to hash the password properly.
Make sure to give the user permission to access forms! (Just so the app doesn't look so blank and empty).

Additional server-side requirements
------
In order to convert between the different formats of iOS and Android, FFMpeg is used to transcode video and audio to a format both platforms understand.
For this reason, FFMPeg, as well as cron, is required. The cron script is located on the server, called cron.sh.


Protocols
---------
Looking through the PHP files in the Web_HTML directory, you can see how the app communicates.

Virtually all communication is done using JSON, in varying formats.

On first sign-in, the app sends username, password, and deviceID to the server, as POST variables. This script does two things, both authentication, and logging the DeviceID, and userID correlation.
This allows some accountability, that users are using the same device.
Also, this script provides the application with a token, within a cookie. All other requests are authenticated using this cookie.

After successful sign-in, the list of forms is downloaded, get_form.php.
This returns a JSON array in the format:
```javascript
[
    [
        "3",
        "Product Scanner",
        [
            [
                "BarcodeCapture",
                "Scan a Barcode",
                [
                    "none",
                    "none"
                ]
            ],
            [
                "MultipleChoice",
                "Type of Product",
                [
                    "Magazine",
                    "Food",
                    "Gift Card"
                ]
            ],
            [
                "PictureCapture",
                "Take picture of item",
                [
                    "none",
                    "none"
                ]
            ],
            [
                "sign",
                "Signature",
                [
                    "none",
                    "none"
                ]
            ]
        ]
    ],
    [
        "2",
        "MySQL test form",
        [
            [
                "text",
                "Test again",
                [
                    "This is a test of mySQL."
                ]
            ],
            [
                "MultipleChoice",
                "Test of Multiple Choice",
                [
                    "MySQL option4",
                    "MySQL Option3"
                ]
            ],
            [
                "VideoCapture",
                "Take a Video",
                [
                    "none",
                    "none"
                ]
            ],
            [
                "TextInput",
                "Enter any text",
                [
                    "none",
                    "none"
                ]
            ],
            [
                "sign",
                "Sign Here",
                [
                    "none",
                    "none"
                ]
            ]
        ]
    ],
    [
        "5",
        "Test form for CB, select",
        [
            [
                "text",
                "text",
                [
                    "This is a test form for trying out select, audio capture, and checkboxes."
                ]
            ],
            [
                "select",
                "Select an Option",
                [
                    "Select 1",
                    "Select 2",
                    "Select 3",
                    "Select 4"
                ]
            ],
            [
                "CheckBoxes",
                "Select an Option",
                [
                    "CB1",
                    "CB2",
                    "CB3",
                    "Test Box"
                ]
            ],
            [
                "PictureCapture",
                "Test Picture Capture",
                [
                    "none",
                    "none3"
                ]
            ]
        ]
    ],
    [
        "6",
        "alexForm",
        [
            [
                "text",
                "text",
                [
                    "this is Ramo test form 1"
                ]
            ],
            [
                "select",
                "select at least one",
                [
                    "I love Alex",
                    "Alex is awesome",
                    "Alex rocks"
                ]
            ],
            [
                "CheckBoxes",
                "Wait, which Alex?",
                [
                    "Roth",
                    "Ramo"
                ]
            ],
            [
                "text",
                "text",
                [
                    "Okay lets test some more functionality"
                ]
            ],
            [
                "PictureCapture",
                "Please Take a Foto",
                [
                    "none",
                    "none"
                ]
            ],
            [
                "AudioCapture",
                "Lets also record confirmation",
                [
                    "none",
                    "none"
                ]
            ],
            [
                "Geolocation",
                "Geolocate",
                [
                    "none",
                    "none"
                ]
            ],
            [
                "MultipleChoice",
                "Was this form easy to fill?",
                [
                    "yes",
                    "no",
                    "indifferent",
                    "leave me alone"
                ]
            ]
        ]
    ]
]
```
where you can see an array of forms, with formID, name, as well as all of the form fields. This array is stored after downloading, for offline use.


Upon submission, submit_form is called, with various post variables.
formsubmission is the most important one, which is a JSON array, of form names, and their respective values. It does NOT include text reminders that are added to the form.

Location updates are done through submit_location, which uses POST variables again.

That is all of the major functionality, everything else is fairly straightforward, or can be found in the PHP scripts.


Database Layout/Schema
--------
The database layout is the same as specified in the spec, with a few changes. 
The schema can be used to recreate the database tables if needed, it's commented with more information:

```sql
CREATE TABLE IF NOT EXISTS `devices` (
  `deviceid` varchar(40) NOT NULL COMMENT 'Also serves as the index', --deviceID is generated by the application, it's a uuid4 token.
  `userid` varchar(40) NOT NULL, 
  `authtoken` varchar(40) NOT NULL, --This token is placed by login.php, it authenticates all requests after login.
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`deviceid`),
  UNIQUE KEY `deviceid_2` (`deviceid`),
  KEY `deviceid` (`deviceid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COMMENT='Stores data on devices that have logged into the system.';

CREATE TABLE IF NOT EXISTS `forms` (
  `formID` int(11) NOT NULL AUTO_INCREMENT,
  `frmName` text NOT NULL, --Name used by the app for the form
  `frmStatus` int(11) NOT NULL, --Not used
  PRIMARY KEY (`formID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

CREATE TABLE IF NOT EXISTS `form_fields` (
  `formFieldID` int(11) NOT NULL AUTO_INCREMENT,
  `formID` int(11) NOT NULL, --Needs to be the same as in `forms` table
  `fldType` varchar(40) NOT NULL, -- Possible options are listed above
  `fldName` varchar(40) NOT NULL, -- Name is used in the app as a label.
  `fieldOptions` text NOT NULL, -- Specified above
  `fldOrder` int(11) NOT NULL, -- This _has_ to be properly ordered, or lots of bugs pop up.
  `fldStatus` int(11) NOT NULL, -- 2 indicated that this field is used for the name of the form entry, anything else doesn't matter.
  PRIMARY KEY (`formFieldID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=26 ;


CREATE TABLE IF NOT EXISTS `submission` (
  `subID` varchar(40) NOT NULL, -- Used to correlate submissions with details.
  `timeStamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userID` varchar(40) NOT NULL, 
  `deviceID` varchar(40) NOT NULL,
  `formID` int(11) NOT NULL, --Same as in `form` table
  `latitude` varchar(20) NOT NULL, --Location of form submission.
  `longitude` varchar(20) NOT NULL,
  `Name` varchar(140) NOT NULL DEFAULT 'No Name',
  PRIMARY KEY (`subID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `submission_details` (
  `subDetailID` int(11) NOT NULL AUTO_INCREMENT, 
  `formFieldID` int(11) NOT NULL, -- Correlates with `form_fields`
  `submissionValue` text NOT NULL, 
  `subID` varchar(40) NOT NULL, -- Same as the corresponding entry in `submission`
  PRIMARY KEY (`subDetailID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=686 ;

CREATE TABLE IF NOT EXISTS `tracker_table` (
  `trackerID` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deviceID` varchar(40) NOT NULL,
  `userID` varchar(40) NOT NULL,
  `interval` varchar(3) NOT NULL, -- 5,10,15
  `latitude` varchar(40) NOT NULL,
  `longitude` varchar(40) NOT NULL,
  `status` varchar(5) NOT NULL, --Unused
  PRIMARY KEY (`deviceID`),
  UNIQUE KEY `deviceID` (`deviceID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `users_forms` ( --This table is used to give users permission to use forms
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` varchar(40) NOT NULL,
  `formID` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

CREATE TABLE IF NOT EXISTS `users_passwords` (
  `userID` varchar(40) NOT NULL,
  `password_hash` varchar(40) NOT NULL, --SHA1
  `logo` varchar(150) NOT NULL, --URL including http:// to a logo to use for the user.
  PRIMARY KEY (`userID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


```


Theming/Icons
------
The various icons in use by the app are stored in www/icons, the -dark set is used right now.
In www/themes, there is the CustTheme-nograd.css, which you can upload to http://jquerymobile.com/themeroller/index.php, to change colours around. Swatch A is the only one used.
In www/img/background.png, you find the background image the app uses.

All of these will need a recompile to update.



Contact
-------
If you need to get in contact with me outside of Freelancer.com for whatever reason, my email address is alex@magmastone.net.
