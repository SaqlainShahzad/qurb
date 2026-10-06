import re

with open('lib/main.dart', 'r') as f:
    content = f.read()

old_schedule = """        final scheduledDate = tz.TZDateTime.from(localDt, tz.local);
        final isAzan = (channelId == 'prayer_azan_channel' || isPrayer);

        final androidDetails = AndroidNotificationDetails(
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
          playSound: true,
          enableVibration: true,
          fullScreenIntent: isAzan,
          visibility: NotificationVisibility.public,
          category: isAzan ? AndroidNotificationCategory.alarm : AndroidNotificationCategory.reminder,"""

new_schedule = """        final scheduledDate = tz.TZDateTime.from(localDt, tz.local);
        final isAzan = (channelId == 'prayer_azan_channel');
        final isSilent = (channelId == 'prayer_silent_channel');

        final androidDetails = AndroidNotificationDetails(
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
          playSound: !isSilent,
          enableVibration: !isSilent,
          fullScreenIntent: isAzan,
          visibility: NotificationVisibility.public,
          category: isAzan ? AndroidNotificationCategory.alarm : AndroidNotificationCategory.reminder,"""

content = content.replace(old_schedule, new_schedule)

with open('lib/main.dart', 'w') as f:
    f.write(content)
