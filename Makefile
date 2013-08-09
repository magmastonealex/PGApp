testflight_android:
	read note
	echo http://testflightapp.com/api/builds.json -F file=@platforms/android/bin/D2DPro-debug.apk -F api_token='e14c1dd5f7824c490e499d10df67ccc2_MTE1MjA1OTIwMTMtMDctMDUgMTk6Mzg6NDEuNzI3NDk1' -F team_token='e42d2f84d72cccd5104ec1acef60c2f2_MjU0NTU4MjAxMy0wOC0wMiAxNDowMTo1Mi4wNzQ4MDQ' -F notes=$note -F notify=True 

