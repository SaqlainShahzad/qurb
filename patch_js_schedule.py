import re

with open('assets/web/index.html', 'r') as f:
    content = f.read()

def patch_js(match):
    return """
        var pKeys=['fajr','dhuhr','asr','maghrib','isha'];
        for(var i=0; i<pKeys.length; i++){
          var pKey=pKeys[i];
          var val = (s.prayers && s.prayers[pKey] !== undefined) ? s.prayers[pKey] : 'adhan';
          if(val === false || val === 'off' || val === 'mute') continue;

          var pHour=prayers[pKey][0];
          var pMin=prayers[pKey][1];
          var pDate=new Date(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate(),pHour,pMin,0,0);

          if(pDate.getTime()<=(now.getTime()+10000)) continue;

          var pTitle=en?(prayerNamesEn[pKey]+' Prayer Time'):('نمازِ '+prayerNamesUr[pKey]+' کا وقت');
          var pBody=en
            ?(prayerNamesEn[pKey]+' time has entered. Prepare for prayer.')
            :(prayerNamesUr[pKey]+' کا وقت داخل ہوگیا، نماز کی تیاری کرو، نماز سے آپ کے مسائل حل ہوں گے۔');

          var cId = 'prayer_azan_channel';
          if(val === 'beep') cId = 'qurb_prayer_channel';
          else if(val === 'silent' || val === 'mute') cId = 'prayer_silent_channel';
          else if(val === 'takbeer') cId = 'prayer_takbeer_channel';
          else if(val === 'vibrate') cId = 'prayer_vibrate_channel';

          batch.push({
            id: baseId + i,
            title: pTitle,
            body: pBody,
            time: pDate.toISOString(),
            channelId: cId,
            isPrayer: true
          });

          // PRE-ADHAN REMINDER
          if(s.special && s.special.preAdhanMinutes && s.special.preAdhanMinutes > 0) {
            var preTime = new Date(pDate.getTime() - s.special.preAdhanMinutes * 60000);
            if(preTime.getTime() > now.getTime() + 10000) {
              batch.push({
                id: baseId + 100 + i,
                title: en ? ('Upcoming: ' + prayerNamesEn[pKey]) : ('نمازِ ' + prayerNamesUr[pKey] + ' قریب ہے'),
                body: en ? ('Prayer starts in ' + s.special.preAdhanMinutes + ' minutes.') : (s.special.preAdhanMinutes + ' منٹ بعد نماز کا وقت شروع ہوگا۔'),
                time: preTime.toISOString(),
                channelId: 'qurb_prayer_channel',
                isPrayer: false
              });
            }
          }
        }
        
        // JUMMAH ALERT
        if (targetDate.getDay() === 5 && s.special && s.special.jummahAlert) { // Friday
           var dhuhrH = prayers['dhuhr'][0];
           var dhuhrM = prayers['dhuhr'][1];
           var jummahTime = new Date(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate(),dhuhrH,dhuhrM,0,0);
           // Friday alert 30 mins before Dhuhr time
           var alertTime = new Date(jummahTime.getTime() - 30 * 60000);
           if (alertTime.getTime() > now.getTime() + 10000) {
              batch.push({
                id: baseId + 200,
                title: en ? 'Jummah Mubarak' : 'جمعہ مبارک',
                body: en ? 'Prepare for Friday Prayer. Recite Surah Al-Kahf.' : 'جمعہ کی تیاری کریں۔ سورۃ الکہف کی تلاوت کریں۔',
                time: alertTime.toISOString(),
                channelId: 'qurb_adhkar_channel',
                isPrayer: false
              });
           }
        }
"""

content = re.sub(
    r"var pKeys=\['fajr','dhuhr','asr','maghrib','isha'\];[\s\S]*?batch\.push\(\{\s+id: baseId\+i,\s+title: pTitle,\s+body: pBody,\s+time: pDate\.toISOString\(\),\s+channelId: cId,\s+isPrayer: true\s+\}\);",
    patch_js,
    content
)

# And expand the loop to 30 days to ensure enough future alarms are queued
content = content.replace("for(var dayOffset=0; dayOffset<7; dayOffset++){", "for(var dayOffset=0; dayOffset<30; dayOffset++){")

with open('assets/web/index.html', 'w') as f:
    f.write(content)
