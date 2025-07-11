package com.callapp;

import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class CallDetectionModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private TelephonyManager telephonyManager;
    private PhoneStateListener phoneStateListener;

    public CallDetectionModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "CallDetection";
    }

    @ReactMethod
    public void startForegroundService() {
        Intent serviceIntent = new Intent(reactContext, CallForegroundService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(serviceIntent);
        } else {
            reactContext.startService(serviceIntent);
        }
        Log.d("CallDetection", "Foreground service started");
    }

    @ReactMethod
    public void stopForegroundService() {
        Intent serviceIntent = new Intent(reactContext, CallForegroundService.class);
        reactContext.stopService(serviceIntent);
        Log.d("CallDetection", "Foreground service stopped");
    }

    @ReactMethod
    public void startListener() {
        telephonyManager = (TelephonyManager) reactContext.getSystemService(Context.TELEPHONY_SERVICE);
        phoneStateListener = new PhoneStateListener() {
            @Override
            public void onCallStateChanged(int state, String phoneNumber) {
                super.onCallStateChanged(state, phoneNumber);
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

                WritableMap params = Arguments.createMap();
                params.putString("state", callState);
                params.putString("phoneNumber", phoneNumber);
                sendEvent(params);

                Log.d("CallDetection", "Call State: " + callState + " | Number: " + phoneNumber);
            }
        };

        telephonyManager.listen(phoneStateListener, PhoneStateListener.LISTEN_CALL_STATE);
        Log.d("CallDetection", "Listener started");
    }

    @ReactMethod
    public void stopListener() {
        if (telephonyManager != null && phoneStateListener != null) {
            telephonyManager.listen(phoneStateListener, PhoneStateListener.LISTEN_NONE);
            Log.d("CallDetection", "Listener stopped");
        }
    }

    private void sendEvent(WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onCallStateChanged", params);
    }
}
