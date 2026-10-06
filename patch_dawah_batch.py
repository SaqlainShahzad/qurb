with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = """            } catch(e) {}
        }
      }

      if(batch.length>0){"""

new_block = """            } catch(e) {}
        }
        
        var dMorn = s.dawah ? s.dawah.morning : false;
        if(dMorn) {
          var pFajrDate = new Date(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate(),prayers.fajr[0],prayers.fajr[1],0,0);
          if(pFajrDate.getTime() > now.getTime() + 10000) {
            batch.push({
              id: baseId+11,
              title: en ? 'A New Blessing' : 'آج کا دن ایک نیا موقع',
              body: en ? 'Today is a new blessing from Allah, and could be the last. Spend it in His obedience and pray on time.' : 'آج کا دن اللہ کا دیا نیا موقع ہے، شاید یہ زندگی کا آخری دن ہو۔ اپنا دن اللہ کی اطاعت اور نمازوں کی پابندی میں گزاریں۔',
              time: pFajrDate.toISOString(),
              channelId: 'qurb_adhkar_channel',
              isPrayer: false
            });
          }
        }
        
        var dMaghrib = s.dawah ? s.dawah.maghrib : false;
        if(dMaghrib) {
          var pMaghribDate = new Date(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate(),prayers.maghrib[0],prayers.maghrib[1],0,0);
          pMaghribDate = new Date(pMaghribDate.getTime() + 15 * 60000);
          if(pMaghribDate.getTime() > now.getTime() + 10000) {
            batch.push({
              id: baseId+12,
              title: en ? 'Daily Adhkar & Surahs' : 'درود شریف اور مسنون سورتیں',
              body: en ? 'Did you send Salawat today? Remember to recite Surah As-Sajdah, Surah Al-Waqi\'ah, and Surah Al-Mulk.' : 'کیا آج آپ نے درود شریف پڑھا ہے؟ سورۃ السجدہ، سورۃ الواقعہ اور سورۃ الملک پڑھنا نہ بھولیں۔',
              time: pMaghribDate.toISOString(),
              channelId: 'qurb_adhkar_channel',
              isPrayer: false
            });
          }
        }
        
        var dSleep = s.dawah ? s.dawah.sleep : false;
        if(dSleep) {
          var pIshaDate = new Date(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate(),prayers.isha[0],prayers.isha[1],0,0);
          pIshaDate = new Date(pIshaDate.getTime() + 60 * 60000);
          if(pIshaDate.getTime() > now.getTime() + 10000) {
            batch.push({
              id: baseId+13,
              title: en ? 'Sunnah of Early Sleep' : 'سنتِ نبوی پر عمل',
              body: en ? 'Complete your daily adhkar and sleep early. Sleeping early after Isha is a Sunnah.' : 'اپنے معمولات اور وظائف مکمل کر کے جلدی سو جائیں۔ عشاء کے بعد جلدی سونا سنت ہے۔',
              time: pIshaDate.toISOString(),
              channelId: 'qurb_adhkar_channel',
              isPrayer: false
            });
          }
        }
      }

      if(batch.length>0){"""

if old_block in content:
    content = content.replace(old_block, new_block)
    print("Batch patched successfully.")
else:
    print("Batch block not found!")

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
