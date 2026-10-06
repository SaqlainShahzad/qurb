with open('lib/main.dart', 'r') as f:
    content = f.read()

old_block = """        final isAzan = (channelId == 'prayer_azan_channel');
        final isSilent = (channelId == 'prayer_silent_channel');

        final androidDetails = AndroidNotificationDetails(
          channelId,
          isAzan ? 'Prayer Times & Azan' : (isSilent ? 'Silent Reminders' : 'Qurb Prayer Reminders'),
          channelDescription: isAzan
              ? 'Exact prayer times with full Azan audio notifications'
              : (isSilent ? 'Silent notifications for prayer times' : 'Daily Farz prayer, Sunrise, and Makruh time notifications for Qurb'),"""

new_block = """        final isAzan = (channelId == 'prayer_azan_channel');
        final isSilent = (channelId == 'prayer_silent_channel');
        final isAdhkar = (channelId == 'qurb_adhkar_channel');

        final androidDetails = AndroidNotificationDetails(
          channelId,
          isAzan ? 'Prayer Times & Azan' : (isSilent ? 'Silent Reminders' : (isAdhkar ? 'Qurb Daily Adhkar & Reminders' : 'Qurb Prayer Reminders')),
          channelDescription: isAzan
              ? 'Exact prayer times with full Azan audio notifications'
              : (isSilent ? 'Silent notifications for prayer times' : (isAdhkar ? 'Daily morning/evening adhkar and Jumuah reminders' : 'Daily Farz prayer, Sunrise, and Makruh time notifications for Qurb')),"""

if old_block in content:
    content = content.replace(old_block, new_block)
    print("Channel patched successfully.")
else:
    print("Block not found!")

with open('lib/main.dart', 'w') as f:
    f.write(content)
