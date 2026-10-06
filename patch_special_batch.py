with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_sunrise = """        // Sunrise Reminder strictly on 'qurb_prayer_channel' (Default Tone, NO Azan)
        if(s.special && s.special.sunrise!==false){
          var sHour=row[2];
          var sMin=row[3];
          var sDate=new Date(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate(),sHour,sMin,0,0);
          if(sDate.getTime()>(now.getTime()+10000)){
            batch.push({
              id: baseId+7,
              title: en?'Sunrise':'طلوعِ شمس',
              body: en?'The sun has risen. Fajr prayer time has ended.':'سورج طلوع ہوگیا، نمازِ فجر کا وقت ختم ہوا۔',
              time: sDate.toISOString(),
              channelId: 'qurb_prayer_channel',
              isPrayer: false
            });
          }
        }"""

new_sunrise = """        // Sunrise Reminder
        var vSun = s.special ? s.special.sunrise : 'beep';
        if(vSun !== false && vSun !== 'off'){
          var sHour=row[2];
          var sMin=row[3];
          var sDate=new Date(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate(),sHour,sMin,0,0);
          if(sDate.getTime()>(now.getTime()+10000)){
            var cId = 'qurb_prayer_channel';
            if(vSun === 'adhan') cId = 'prayer_azan_channel';
            else if(vSun === 'silent') cId = 'prayer_silent_channel';
            batch.push({
              id: baseId+7,
              title: en?'Sunrise':'طلوعِ شمس',
              body: en?'The sun has risen. Fajr prayer time has ended.':'سورج طلوع ہوگیا، نمازِ فجر کا وقت ختم ہوا۔',
              time: sDate.toISOString(),
              channelId: cId,
              isPrayer: false
            });
          }
        }"""

if old_sunrise in content:
    content = content.replace(old_sunrise, new_sunrise)
    print("Sunrise patched!")

old_makruh = """        if(s.special && s.special.makruhStart!==false){"""
# Wait, let me check the actual code for makruh Start/End
