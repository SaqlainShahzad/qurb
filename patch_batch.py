import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_batch_loop = r"""        var pKeys=\['fajr','dhuhr','asr','maghrib','isha'\];
        for\(var i=0; i<pKeys\.length; i\+\+\)\{
          var pKey=pKeys\[i\];
          if\(s\.prayers && s\.prayers\[pKey\]===false\) continue;

          var pHour=prayers\[pKey\]\[0\];
          var pMin=prayers\[pKey\]\[1\];
          var pDate=new Date\(targetDate\.getFullYear\(\),targetDate\.getMonth\(\),targetDate\.getDate\(\),pHour,pMin,0,0\);

          if\(pDate\.getTime\(\)<=\(now\.getTime\(\)\+10000\)\) continue;

          var pTitle=en\?\(prayerNamesEn\[pKey\]\+' Prayer Time'\):\('نمازِ '\+prayerNamesUr\[pKey\]\+' کا وقت'\);
          var pBody=en
            \?\(prayerNamesEn\[pKey\]\+' time has entered\. Prepare for prayer\.'\)
            :\(prayerNamesUr\[pKey\]\+' کا وقت داخل ہوگیا، نماز کی تیاری کرو، نماز سے آپ کے مسائل حل ہوں گے۔'\);

          batch\.push\(\{
            id: baseId\+\(i\+1\),
            title: pTitle,
            body: pBody,
            time: pDate\.toISOString\(\),
            channelId: 'prayer_azan_channel',
            isPrayer: true
          \}\);
        \}"""

new_batch_loop = """        var pKeys=['fajr','dhuhr','asr','maghrib','isha'];
        for(var i=0; i<pKeys.length; i++){
          var pKey=pKeys[i];
          var val = (s.prayers && s.prayers[pKey] !== undefined) ? s.prayers[pKey] : 'adhan';
          if(val === false || val === 'off') continue;

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
          else if(val === 'silent') cId = 'prayer_silent_channel';

          batch.push({
            id: baseId+(i+1),
            title: pTitle,
            body: pBody,
            time: pDate.toISOString(),
            channelId: cId,
            isPrayer: true
          });
        }"""
content = re.sub(old_batch_loop, new_batch_loop, content)

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
