with open('lib/main.dart', 'r') as f:
    content = f.read()

old_channels = """        // Standard Farz prayer notification channel
        const AndroidNotificationChannel prayerChannel = AndroidNotificationChannel(
          'qurb_prayer_channel',
          'Qurb Prayer Reminders',
          description: 'Daily Farz prayer, Sunrise, and Makruh time notifications for Qurb',
          importance: Importance.max,
          playSound: true,
          enableVibration: true,
        );"""

new_channels = """        // Standard Farz prayer notification channel
        const AndroidNotificationChannel prayerChannel = AndroidNotificationChannel(
          'qurb_prayer_channel',
          'Qurb Prayer Reminders',
          description: 'Daily Farz prayer, Sunrise, and Makruh time notifications for Qurb',
          importance: Importance.max,
          playSound: true,
          enableVibration: true,
        );

        // Silent Farz prayer notification channel
        const AndroidNotificationChannel silentChannel = AndroidNotificationChannel(
          'prayer_silent_channel',
          'Silent Reminders',
          description: 'Silent notifications for prayer times',
          importance: Importance.low,
          playSound: false,
          enableVibration: false,
        );"""

content = content.replace(old_channels, new_channels)

# Also need to create the channel in androidPlugin
old_create = """        await androidPlugin.createNotificationChannel(azanChannel);
        await androidPlugin.createNotificationChannel(prayerChannel);
        await androidPlugin.createNotificationChannel(adhkarChannel);"""

new_create = """        await androidPlugin.createNotificationChannel(azanChannel);
        await androidPlugin.createNotificationChannel(prayerChannel);
        await androidPlugin.createNotificationChannel(silentChannel);
        await androidPlugin.createNotificationChannel(adhkarChannel);"""

content = content.replace(old_create, new_create)

with open('lib/main.dart', 'w') as f:
    f.write(content)
