package net.magmastone.PGP;
import org.apache.cordova.CordovaPlugin;
import android.app.IntentService;
import android.content.Intent;
import org.apache.cordova.PluginResult;
import android.content.Context;
import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.view.Gravity;
import java.util.List;
import java.util.ArrayList;
import android.location.Location;
import android.location.LocationManager;
import android.location.LocationListener;

import android.widget.Toast;
import android.util.Log;
import android.app.Activity;
import java.lang.Exception;

public class LocPlugin extends CordovaPlugin {
    public static final int SIGNATURE_ACTIVITY = 3;

private double[] getGPS() {
        LocationManager lm = (LocationManager) this.cordova.getActivity().getSystemService(Context.LOCATION_SERVICE);
        
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
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("intervalUpdate")) {
            String interval = args.getString(0);
            String userID = args.getString(1);
            String devID = args.getString(2);
                Intent stopIntent = new Intent(this.cordova.getActivity(), LocService.class);
                this.cordova.getActivity().stopService(stopIntent);
                Log.i("D2DPro:LocPlugin", "Stopped Service");
            if(interval.equals("10000")){
                
            } else{
                Log.i("D2DPro:LocPlugin", "Starting service at interval " + interval);
                Intent startIntent = new Intent(this.cordova.getActivity(), LocService.class);
                startIntent.putExtra(LocService.OURINTERVAL, interval);
                startIntent.putExtra(LocService.DEVICEID, devID);
                startIntent.putExtra(LocService.USERID, userID);
                this.cordova.getActivity().startService(startIntent);
            }
            
            return true;
        }else if(action.equals("presentView")){
                Intent intent = new Intent(this.cordova.getActivity(), CaptureSignature.class); 
                this.cordova.startActivityForResult(this,intent,SIGNATURE_ACTIVITY);
        }else if(action.equals("getLocation")){
                double[] locData = getGPS();
                webView.sendJavascript("globalLocUpdate('"+Double.toString(locData[0])+"','"+Double.toString(locData[1])+"')");
        }
        return false;
    }
@Override
        public void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        switch(requestCode) {
        case SIGNATURE_ACTIVITY:
                    try{
                    Log.i("D2DPro:Sign", "Got signature back.");
                    Log.i("D2DPro:Sign", data.getExtras().getString("sigData"));
                    webView.sendJavascript("updatedSig('"+data.getExtras().getString("sigData")+"');");
                } catch(Exception e){
                    Log.i("D2DPro:Sign", "Cancelled");
                }
            break;
        }
 
    }
}