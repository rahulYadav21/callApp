package com.callapp;

import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.content.Context;
import android.util.Log; // ✅ Required for Log.d

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class CallDetectionModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

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
    public void startListener() {
        TelephonyManager telephonyManager = (TelephonyManager) reactContext.getSystemService(Context.TELEPHONY_SERVICE);
        telephonyManager.listen(new PhoneStateListener() {
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
            }
        }, PhoneStateListener.LISTEN_CALL_STATE);
    }

    private void sendEvent(WritableMap params) {
        Log.d("CallDetection", "Emitting event: " + params.toString()); // ✅ Logging event
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onCallStateChanged", params);
    }
}
