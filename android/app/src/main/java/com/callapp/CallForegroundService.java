package com.callapp;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

public class CallForegroundService extends Service {

    private TelephonyManager telephonyManager;
    private PhoneStateListener callListener;

    @Override
    public void onCreate() {
        super.onCreate();

        // 🔔 Create notification channel (for Android 8+)
        createNotificationChannel();

        // 🟢 Start the service as a foreground service with a persistent notification
        Notification notification = new NotificationCompat.Builder(this, "CALL_CHANNEL")
            .setContentTitle("Call Listener Active")
            .setContentText("Listening for incoming calls...")
            .setSmallIcon(R.mipmap.ic_launcher) // ✅ Use your app launcher icon
            .build();

        startForeground(1, notification); // 🛡 Required to keep the service alive in background
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("CallForegroundService", "📱 Service started");

        // 🔄 Register the phone state listener only once
        if (telephonyManager == null) {
            telephonyManager = (TelephonyManager) getSystemService(TELEPHONY_SERVICE);

            callListener = new PhoneStateListener() {
                @Override
                public void onCallStateChanged(int state, String phoneNumber) {
                    String callState = "UNKNOWN";

                    switch (state) {
                        case TelephonyManager.CALL_STATE_RINGING:
                            callState = "INCOMING_CALL";
                            break;
                        case TelephonyManager.CALL_STATE_OFFHOOK:
                            callState = "CALL_ANSWERED";
                            break;
                        case TelephonyManager.CALL_STATE_IDLE:
                            callState = "CALL_ENDED";
                            break;
                    }

                    Log.d("CallForegroundService", "📞 " + callState + " | Number: " + phoneNumber);

                    // 📤 Optional: You can broadcast this to JS or send to server here
                }
            };

            telephonyManager.listen(callListener, PhoneStateListener.LISTEN_CALL_STATE);
        }

        // 🔁 Ensure the service restarts if killed (e.g. app swiped from recents)
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        // 🛑 Unregister listener to avoid memory leaks
        if (telephonyManager != null && callListener != null) {
            telephonyManager.listen(callListener, PhoneStateListener.LISTEN_NONE);
        }

        Log.d("CallForegroundService", "❌ Service stopped");
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        // ❌ Not a bound service
        return null;
    }

    private void createNotificationChannel() {
        // 📡 For Android O and above: register the notification channel
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                "CALL_CHANNEL", // ID
                "Call Listener Channel", // Name
                NotificationManager.IMPORTANCE_LOW // Priority
            );

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }
}
















// package com.callapp;

// import android.app.Service;
// import android.content.Intent;
// import android.os.IBinder;
// import android.telephony.PhoneStateListener;
// import android.telephony.TelephonyManager;
// import android.app.Notification;
// import android.app.NotificationChannel;
// import android.app.NotificationManager;
// import android.os.Build;
// import android.util.Log;

// import androidx.annotation.Nullable;
// import androidx.core.app.NotificationCompat;

// public class CallForegroundService extends Service {

//     private TelephonyManager telephonyManager;
//     private PhoneStateListener callListener;

//     @Override
//     public void onCreate() {
//         super.onCreate();

//         // 🔔 Create the notification channel for foreground service
//         createNotificationChannel();

//         // 🔔 Build and start the foreground notification
//         Notification notification = new NotificationCompat.Builder(this, "CALL_CHANNEL")
//             .setContentTitle("Call Listener Running")
//             .setContentText("Listening for incoming calls...")
//             .setSmallIcon(R.mipmap.ic_launcher) // ✅ Replace with your app icon
//             .setOngoing(true) // 📌 Important: Keeps service in foreground
//             .build();

//         // ✅ Start this as a foreground service
//         startForeground(1, notification);

//         // 📞 Set up call state listener
//         telephonyManager = (TelephonyManager) getSystemService(TELEPHONY_SERVICE);
//         callListener = new PhoneStateListener() {
//             @Override
//             public void onCallStateChanged(int state, String phoneNumber) {
//                 String callState = "UNKNOWN";

//                 switch (state) {
//                     case TelephonyManager.CALL_STATE_RINGING:
//                         callState = "INCOMING_CALL";
//                         break;
//                     case TelephonyManager.CALL_STATE_OFFHOOK:
//                         callState = "CALL_ANSWERED";
//                         break;
//                     case TelephonyManager.CALL_STATE_IDLE:
//                         callState = "CALL_ENDED";
//                         break;
//                 }

//                 // 🧠 Log the call state and number
//                 Log.d("CallForegroundService", "📞 " + callState + " " + phoneNumber);

//                 // 🔄 TODO: Broadcast or save data to JS/AsyncStorage/API here
//             }
//         };

//         // 🔁 Start listening to phone call state changes
//         telephonyManager.listen(callListener, PhoneStateListener.LISTEN_CALL_STATE);
//     }

//     @Override
//     public int onStartCommand(Intent intent, int flags, int startId) {
//         // 🔁 Ensures the service is restarted if Android kills it
//         return START_STICKY;
//     }

//     @Override
//     public void onDestroy() {
//         super.onDestroy();
//         // 🧹 Unregister call listener when service is stopped
//         telephonyManager.listen(callListener, PhoneStateListener.LISTEN_NONE);
//         Log.d("CallForegroundService", "🛑 Foreground service destroyed");
//     }

//     @Nullable
//     @Override
//     public IBinder onBind(Intent intent) {
//         return null; // ❌ Not a bound service
//     }

//     @Override
//     public void onTaskRemoved(Intent rootIntent) {
//         // 🔁 Restart service if user clears the app from recent tasks
//         Log.d("CallForegroundService", "⚠️ Task removed - restarting service");

//         Intent restartServiceIntent = new Intent(getApplicationContext(), CallForegroundService.class);
//         restartServiceIntent.setPackage(getPackageName());

//         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//             getApplicationContext().startForegroundService(restartServiceIntent);
//         } else {
//             getApplicationContext().startService(restartServiceIntent);
//         }

//         super.onTaskRemoved(rootIntent);
//     }

//     private void createNotificationChannel() {
//         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//             NotificationChannel channel = new NotificationChannel(
//                 "CALL_CHANNEL", // ✅ Channel ID
//                 "Call Listener Channel", // 📛 Channel Name
//                 NotificationManager.IMPORTANCE_LOW // 🔔 Notification importance
//             );
//             NotificationManager manager = getSystemService(NotificationManager.class);
//             if (manager != null) {
//                 manager.createNotificationChannel(channel);
//             }
//         }
//     }
// }
