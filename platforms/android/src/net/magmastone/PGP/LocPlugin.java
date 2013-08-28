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
import android.widget.Toast;
import android.util.Log;
import android.app.Activity;

public class LocPlugin extends CordovaPlugin {
    public static final int SIGNATURE_ACTIVITY = 3;
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
        }
        return false;
    }
@Override
        public void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        switch(requestCode) {
        case SIGNATURE_ACTIVITY: 
                    Log.i("D2DPro:Sign", "Got signature back.");
                    Log.i("D2DPro:Sign", data.getExtras().getString("sigData"));
                    webView.sendJavascript("updatedSig('"+data.getExtras().getString("sigData")+"');");
            break;
        }
 
    }
}