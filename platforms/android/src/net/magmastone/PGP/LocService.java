package net.magmastone.PGP;

import android.app.IntentService;
import android.content.Intent;
import android.util.Log;
import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;
import android.location.Location;
import android.location.LocationManager;
import android.location.LocationListener;
import java.util.List;
import java.util.ArrayList;
import java.lang.Exception;
import android.os.Bundle;

import org.apache.http.message.BasicNameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;

public class LocService extends IntentService{
	public static final String OURINTERVAL = "OURINT";
	public static final String DEVICEID = "OURDEVID";
	public static final String USERID = "OURUSERID";
	private boolean going = true;

	public LocService(){
		super("LocService");
	}

	private double[] getGPS() {
		LocationManager lm = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
		
		List<String> providers = lm.getProviders(true);
		Log.i("D2DPro:LocServiceGPS", "All providers:" +providers.toString());
		/* Loop over the array backwards, and if you get an accurate location, then break out the loop*/
		Location l = null;

		for (int i=providers.size()-1; i>=0; i--) {
			l = lm.getLastKnownLocation(providers.get(i));
			if (l != null){
				Log.i("D2DPro:LocServiceGPS","Not null!");
				break;
			};
		}

		double[] gps = new double[2];
		gps[0]=22.33333;
		gps[1]=33.22222;
		if (l != null) {
			gps[0] = l.getLatitude();
			gps[1] = l.getLongitude();
		}
		return gps;
	}

	@Override
	protected void onHandleIntent(Intent workIntent) {
        // Gets data from the incoming Intent
		String interval = workIntent.getStringExtra(OURINTERVAL);
		String userID = workIntent.getStringExtra(USERID);
		String deviceID = workIntent.getStringExtra(DEVICEID);
				LocationManager lm = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
		

LocationListener locationListener = new LocationListener() {
    public void onLocationChanged(Location location) {
    	Log.i("D2DPro:LocListener", "Got new location:"+Double.toString(location.getLatitude())+","+Double.toString(location.getLongitude()));
    }

    public void onStatusChanged(String provider, int status, Bundle extras) {}

    public void onProviderEnabled(String provider) {}

    public void onProviderDisabled(String provider) {}
  };
  		lm.requestLocationUpdates(lm.GPS_PROVIDER,30000,0,locationListener);

		Log.i("D2DPro:LocService", "STARTED, requested: " + interval);
		SystemClock.sleep(1000);
		while(going){
			double[] locData = getGPS();
			Log.i("D2DPro:LocService", "Location: " + Double.toString(locData[0])+","+Double.toString(locData[1]));
			Log.i("D2DPro:LocService", "Execd");
			try{
			HttpClient httpclient = new DefaultHttpClient();
  		    HttpPost d2dpost = new HttpPost("http://app.d2dpro.com/submit_location.php");

  		    List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(2);
   	        nameValuePairs.add(new BasicNameValuePair("deviceID", deviceID));
            nameValuePairs.add(new BasicNameValuePair("userID", userID));
            nameValuePairs.add(new BasicNameValuePair("interval", interval));
            nameValuePairs.add(new BasicNameValuePair("latitude", Double.toString(locData[0])));
            nameValuePairs.add(new BasicNameValuePair("longitude", Double.toString(locData[1])));
            d2dpost.setEntity(new UrlEncodedFormEntity(nameValuePairs));
			HttpResponse response = httpclient.execute(d2dpost);
			Log.i("D2DPro:LocService", "Submitted.");
			}catch(Exception e){
				Log.e("D2D:LocService", "ERROR SUBMITTING");
			}
			SystemClock.sleep(60000*Integer.parseInt(interval));
		}
	}
	
	@Override
	public void onDestroy(){
		Log.i("D2DPro:LocService", "Stopping service.");
		going = false;
	}

}