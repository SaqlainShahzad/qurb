# Flutter ProGuard Keep Rules
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }

# WebView Flutter Keep Rules
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class io.flutter.plugins.webviewflutter.** { *; }
-keep class android.webkit.** { *; }

# Flutter Local Notifications Keep Rules
-keep class com.dexterous.flutterlocalnotifications.** { *; }
-keep class androidx.core.app.NotificationCompat** { *; }
-dontwarn com.dexterous.flutterlocalnotifications.**

# Permission Handler Keep Rules
-keep class com.baseflow.permissionhandler.** { *; }

# Core Desugaring / Gson
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes EnclosingMethod
-dontwarn javax.annotation.**
-dontwarn java.time.**
