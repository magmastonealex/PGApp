Adding forms
-----

From PMA, go to the "forms" table, then insert a new row. Leave formID blank (mySQL uses it as a key and autoincrements.)
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

fldOrder defines the order - lowest to highest
fldStatus isn't used, but should be filled to prevent a mySQL error. (what should this be used for?)

Once all elements have been added, go to users_forms, and add a row, leaving id blank, userID should be the userid of the user getting access, and formID is the ID of the form just added.


Adding Users
-----

From PMA, go to users_passwords, and insert a new row. Add the userID, and the password. Select SHA1 as the function, to hash the password properly.
Make sure to give the user permission to access forms! (Just so the app doesn't look so blank and empty).