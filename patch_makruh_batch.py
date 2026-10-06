with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = """        // Sunrise Reminder strictly on 'qurb_prayer_channel' (Default Tone, NO Azan)
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
        }
      }"""

new_block = """        // Sunrise Reminder
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
        }
        
        // Makruh Start Reminder
        var vMakruhStart = s.special ? s.special.makruhStart : 'beep';
        if (vMakruhStart !== false && vMakruhStart !== 'off') {
            try {
                var sTimes = exactSpecialTimes(targetDate);
                if (sTimes && sTimes.sunrise && sTimes.sunrise.start) {
                    if (sTimes.sunrise.start.getTime() > (now.getTime() + 10000)) {
                        var cIdStart = 'qurb_prayer_channel';
                        if (vMakruhStart === 'adhan') cIdStart = 'prayer_azan_channel';
                        else if (vMakruhStart === 'silent') cIdStart = 'prayer_silent_channel';
                        batch.push({
                            id: baseId+8,
                            title: en ? 'Makruh Time Start' : 'مکروہ وقت شروع',
                            body: en ? 'Morning Makruh period has begun.' : 'صبح کا مکروہ وقت شروع ہوگیا۔',
                            time: sTimes.sunrise.start.toISOString(),
                            channelId: cIdStart,
                            isPrayer: false
                        });
                    }
                }
            } catch(e) {}
        }

        // Makruh End Reminder
        var vMakruhEnd = s.special ? s.special.makruhEnd : 'beep';
        if (vMakruhEnd !== false && vMakruhEnd !== 'off') {
            try {
                var sTimesEnd = exactSpecialTimes(targetDate);
                if (sTimesEnd && sTimesEnd.sunrise && sTimesEnd.sunrise.end) {
                    if (sTimesEnd.sunrise.end.getTime() > (now.getTime() + 10000)) {
                        var cIdEnd = 'qurb_prayer_channel';
                        if (vMakruhEnd === 'adhan') cIdEnd = 'prayer_azan_channel';
                        else if (vMakruhEnd === 'silent') cIdEnd = 'prayer_silent_channel';
                        batch.push({
                            id: baseId+9,
                            title: en ? 'Makruh Time End' : 'مکروہ وقت ختم',
                            body: en ? 'Morning Makruh period has ended.' : 'صبح کا مکروہ وقت ختم ہوگیا۔',
                            time: sTimesEnd.sunrise.end.toISOString(),
                            channelId: cIdEnd,
                            isPrayer: false
                        });
                    }
                }
            } catch(e) {}
        }
      }"""

if old_block in content:
    content = content.replace(old_block, new_block)
    print("Block replaced successfully!")
else:
    print("Could not find old_block!")

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
