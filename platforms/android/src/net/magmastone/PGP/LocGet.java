package net.magmastone.PGP;
    import android.app.AlarmManager;
    import android.app.PendingIntent;
    import android.content.BroadcastReceiver;
    import android.content.Context;
    import android.content.Intent;
    import android.os.PowerManager;
    import android.util.Log;

public class LocGet extends BroadcastReceiver 
    {    
         @Override
         public void onReceive(Context context, Intent intent) 
         {   
             PowerManager powerm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);

             PowerManager.WakeLock wl = powerm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "");
             wl.acquire();
             Log.i("D2DPro:LocGet", "Would get Location");
             wl.release();
         }

     public void setupInterval(Context context, int interval)
     {
         AlarmManager am=(AlarmManager)context.getSystemService(Context.ALARM_SERVICE);
         Intent ourintent = new Intent(context, LocGet.class);
         PendingIntent pi = PendingIntent.getBroadcast(context, 0, ourintent, 0);
         am.setRepeating(AlarmManager.RTC_WAKEUP, System.currentTimeMillis(), 1000 * interval, pi); // Millisec * Second * Minute
         Log.i("D2DPro:LocGet", "Setup Interval");
     }

     public void cancelLocation(Context context)
     {
         Intent intent = new Intent(context, LocGet.class);
         PendingIntent sender = PendingIntent.getBroadcast(context, 0, intent, 0);
         AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
         alarmManager.cancel(sender);
     }
 }