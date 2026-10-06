with open('lib/main.dart', 'r') as f:
    content = f.read()

old_block = """              final isAzan = (channelId == 'prayer_azan_channel');
              await flutterLocalNotificationsPlugin.zonedSchedule(
                id,
                title,
                body,
                scheduledDate,
                NotificationDetails(
                  android: AndroidNotificationDetails(
                    isAzan ? 'prayer_azan_channel' : 'qurb_prayer_channel',
                    isAzan ? 'Prayer Times & Azan' : 'Qurb Prayer Reminders',
                    channelDescription: isAzan
                        ? 'Exact prayer times with full Azan audio notifications'
                        : 'Daily Farz prayer, Sunrise, and Makruh time notifications for Qurb',
                    importance: isAzan ? Importance.max : Importance.high,
                    priority: Priority.high,
                    ticker: isAzan ? 'Prayer Time Azan' : 'Qurb Reminder',
                    color: const Color(0xFFD4AF37),
                    icon: '@drawable/ic_notification',
                    sound: isAzan ? const RawResourceAndroidNotificationSound('azzanforapp') : null,
                    audioAttributesUsage: isAzan ? AudioAttributesUsage.alarm : AudioAttributesUsage.notification,
                    playSound: true,"""

new_block = """              final isAzan = (channelId == 'prayer_azan_channel');
              final isSilent = (channelId == 'prayer_silent_channel');
              await flutterLocalNotificationsPlugin.zonedSchedule(
                id,
                title,
                body,
                scheduledDate,
                NotificationDetails(
                  android: AndroidNotificationDetails(
                    channelId,
                    isAzan ? 'Prayer Times & Azan' : (isSilent ? 'Silent Reminders' : 'Qurb Prayer Reminders'),
                    channelDescription: isAzan
                        ? 'Exact prayer times with full Azan audio notifications'
                        : (isSilent ? 'Silent notifications for prayer times' : 'Daily Farz prayer, Sunrise, and Makruh time notifications for Qurb'),
                    importance: isSilent ? Importance.low : (isAzan ? Importance.max : Importance.high),
                    priority: isSilent ? Priority.low : Priority.high,
                    ticker: isAzan ? 'Prayer Time Azan' : 'Qurb Reminder',
                    color: const Color(0xFFD4AF37),
                    icon: '@drawable/ic_notification',
                    sound: isAzan ? const RawResourceAndroidNotificationSound('azzanforapp') : null,
                    audioAttributesUsage: isAzan ? AudioAttributesUsage.alarm : AudioAttributesUsage.notification,
                    playSound: !isSilent,"""

if old_block in content:
    content = content.replace(old_block, new_block)
    print("scheduleNotification patched!")
else:
    print("Could not find old_block in scheduleNotification")

with open('lib/main.dart', 'w') as f:
    f.write(content)
