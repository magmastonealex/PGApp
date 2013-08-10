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
import android.util.Log;
import android.app.Activity;

public class LocPlugin extends CordovaPlugin {
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
        }
        return false;
    }
}