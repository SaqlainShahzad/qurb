import re

with open('lib/main.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# First, inject _showNativeNotificationSettings inside _QurbWebViewScreenState
method_inject = """  void _showNativeNotificationSettings(BuildContext context, Map<String, dynamic> times) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF101820),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return NativeSettingsSheet(
          times: times,
          onSyncNeeded: (String jsonState) {
            _webViewController?.runJavaScript("localStorage.setItem('salah_prayer_notifications_v3', '" + jsonState + "'); if(window.syncNativeToWeb) window.syncNativeToWeb();");
          },
        );
      },
    );
  }
"""

if "_showNativeNotificationSettings" not in content:
    content = content.replace("Future<void> _handleBridgeMessage(String message) async {", method_inject + "\n  Future<void> _handleBridgeMessage(String message) async {")

class_inject = """
class NativeSettingsSheet extends StatefulWidget {
  final Map<String, dynamic> times;
  final Function(String) onSyncNeeded;

  const NativeSettingsSheet({
    Key? key,
    required this.times,
    required this.onSyncNeeded,
  }) : super(key: key);

  @override
  State<NativeSettingsSheet> createState() => _NativeSettingsSheetState();
}

class _NativeSettingsSheetState extends State<NativeSettingsSheet> {
  bool _isLoading = true;
  Map<String, dynamic> _state = {};

  final Map<String, String> _prayerNames = {
    'fajr': 'Fajr / فجر',
    'sunrise': 'Sunrise / طلوعِ آفتاب',
    'makruhStart': 'Makruh Start / مکروہ شروع',
    'makruhEnd': 'Makruh End / مکروہ ختم',
    'dhuhr': 'Dhuhr / ظہر',
    'asr': 'Asr / عصر',
    'maghrib': 'Maghrib / مغرب',
    'isha': 'Isha / عشاء',
  };

  @override
  void initState() {
    super.initState();
    _loadPrefs();
  }

  Future<void> _loadPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString('salah_prayer_notifications_v3');
    Map<String, dynamic> loadedState = {
      'enabled': false,
      'prayers': {'fajr': 'adhan', 'dhuhr': 'adhan', 'asr': 'adhan', 'maghrib': 'adhan', 'isha': 'adhan'},
      'special': {'sunrise': 'beep', 'makruhStart': 'beep', 'makruhEnd': 'beep'},
      'dawah': {'morning': false, 'maghrib': false, 'sleep': false},
    };
    if (jsonStr != null) {
      try {
        final parsed = jsonDecode(jsonStr) as Map<String, dynamic>;
        loadedState = parsed;
      } catch (e) {}
    }
    
    // Ensure nested objects exist
    loadedState['prayers'] ??= {};
    loadedState['special'] ??= {};
    loadedState['dawah'] ??= {};

    setState(() {
      _state = loadedState;
      _isLoading = false;
    });
  }

  Future<void> _saveAndSync() async {
    final jsonStr = jsonEncode(_state);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('salah_prayer_notifications_v3', jsonStr);
    
    // Also save boolean flags so native BootReceiver functions correctly
    await prefs.setBool('notifications_enabled', _state['enabled'] == true);
    
    final p = _state['prayers'];
    if(p != null) {
      await prefs.setBool('prayer_fajr_enabled', p['fajr'] != false && p['fajr'] != 'off');
      await prefs.setBool('prayer_dhuhr_enabled', p['dhuhr'] != false && p['dhuhr'] != 'off');
      await prefs.setBool('prayer_asr_enabled', p['asr'] != false && p['asr'] != 'off');
      await prefs.setBool('prayer_maghrib_enabled', p['maghrib'] != false && p['maghrib'] != 'off');
      await prefs.setBool('prayer_isha_enabled', p['isha'] != false && p['isha'] != 'off');
    }
    final s = _state['special'];
    if(s != null) {
      await prefs.setBool('special_sunrise_enabled', s['sunrise'] != false && s['sunrise'] != 'off');
      await prefs.setBool('special_makruh_start_enabled', s['makruhStart'] != false && s['makruhStart'] != 'off');
      await prefs.setBool('special_makruh_end_enabled', s['makruhEnd'] != false && s['makruhEnd'] != 'off');
    }
    final d = _state['dawah'];
    if(d != null) {
      await prefs.setBool('dawah_morning_enabled', d['morning'] == true);
      await prefs.setBool('dawah_maghrib_enabled', d['maghrib'] == true);
      await prefs.setBool('dawah_sleep_enabled', d['sleep'] == true);
    }
    
    widget.onSyncNeeded(jsonStr);
  }

  void _updatePrayer(String key, String val) {
    setState(() { _state['prayers'][key] = val; });
    _saveAndSync();
  }
  
  void _updateSpecial(String key, String val) {
    setState(() { _state['special'][key] = val; });
    _saveAndSync();
  }

  Widget _buildDropdown(String title, String time, String currentValue, Function(String) onChanged) {
    return ListTile(
      title: Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
      subtitle: Text(time, style: const TextStyle(color: Colors.white60)),
      trailing: DropdownButton<String>(
        value: (currentValue == 'true' ? 'adhan' : (currentValue == 'false' ? 'off' : currentValue)),
        dropdownColor: const Color(0xFF1E2A38),
        style: const TextStyle(color: Colors.white, fontSize: 13),
        underline: Container(),
        items: const [
          DropdownMenuItem(value: 'adhan', child: Text('Full Adhan')),
          DropdownMenuItem(value: 'beep', child: Text('Beep / Tone')),
          DropdownMenuItem(value: 'silent', child: Text('Silent')),
          DropdownMenuItem(value: 'off', child: Text('Disabled')),
        ],
        onChanged: (val) {
          if (val != null) onChanged(val);
        },
      ),
    );
  }

  Widget _buildSwitch(String title, String subtitle, bool currentValue, Function(bool) onChanged) {
    return SwitchListTile(
      title: Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
      subtitle: Text(subtitle, style: const TextStyle(color: Colors.white60)),
      value: currentValue,
      activeColor: const Color(0xFFD48A56),
      onChanged: (val) {
        onChanged(val);
        _saveAndSync();
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const SizedBox(height: 300, child: Center(child: CircularProgressIndicator()));
    }

    final p = _state['prayers'];
    final s = _state['special'];
    final d = _state['dawah'];

    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      padding: const EdgeInsets.only(top: 20),
      child: Column(
        children: [
          const Text("Native Notification Settings", style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFD48A56),
                minimumSize: const Size(double.infinity, 50),
              ),
              icon: const Icon(Icons.notifications_active, color: Colors.white),
              label: const Text("Allow / Request Notification Permission", style: TextStyle(color: Colors.white)),
              onPressed: () async {
                final plugin = FlutterLocalNotificationsPlugin();
                await plugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()?.requestNotificationsPermission();
              },
            ),
          ),
          SwitchListTile(
            title: const Text("Master Switch", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            subtitle: const Text("Enable or disable all background notifications natively.", style: TextStyle(color: Colors.white60)),
            value: _state['enabled'] == true,
            activeColor: const Color(0xFF4A90E2),
            onChanged: (val) {
              setState(() { _state['enabled'] = val; });
              _saveAndSync();
            },
          ),
          const Divider(color: Colors.white24),
          Expanded(
            child: ListView(
              children: [
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Text("Prayer & Event Alerts", style: TextStyle(color: Color(0xFFD48A56), fontWeight: FontWeight.bold, fontSize: 14)),
                ),
                _buildDropdown(_prayerNames['fajr']!, widget.times['fajr'] ?? '—', p['fajr'] ?? 'adhan', (v) => _updatePrayer('fajr', v)),
                _buildDropdown(_prayerNames['sunrise']!, widget.times['sunrise'] ?? '—', s['sunrise'] ?? 'beep', (v) => _updateSpecial('sunrise', v)),
                _buildDropdown(_prayerNames['makruhStart']!, widget.times['makruhStart'] ?? '—', s['makruhStart'] ?? 'beep', (v) => _updateSpecial('makruhStart', v)),
                _buildDropdown(_prayerNames['makruhEnd']!, widget.times['makruhEnd'] ?? '—', s['makruhEnd'] ?? 'beep', (v) => _updateSpecial('makruhEnd', v)),
                _buildDropdown(_prayerNames['dhuhr']!, widget.times['dhuhr'] ?? '—', p['dhuhr'] ?? 'adhan', (v) => _updatePrayer('dhuhr', v)),
                _buildDropdown(_prayerNames['asr']!, widget.times['asr'] ?? '—', p['asr'] ?? 'adhan', (v) => _updatePrayer('asr', v)),
                _buildDropdown(_prayerNames['maghrib']!, widget.times['maghrib'] ?? '—', p['maghrib'] ?? 'adhan', (v) => _updatePrayer('maghrib', v)),
                _buildDropdown(_prayerNames['isha']!, widget.times['isha'] ?? '—', p['isha'] ?? 'adhan', (v) => _updatePrayer('isha', v)),
                
                const Divider(color: Colors.white24),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Text("Da'wah & Motivation Reminders", style: TextStyle(color: Color(0xFFD48A56), fontWeight: FontWeight.bold, fontSize: 14)),
                ),
                _buildSwitch("Morning Motivation", "Spiritual reminder at Fajr time (05:30 AM).", d['morning'] == true, (v) { setState(() { d['morning'] = v; }); }),
                _buildSwitch("Post-Maghrib Adhkar", "Surah and Salawat reminder 15 mins after Maghrib.", d['maghrib'] == true, (v) { setState(() { d['maghrib'] = v; }); }),
                _buildSwitch("Sunnah Early Sleep", "Sleep reminder 60 mins after Isha.", d['sleep'] == true, (v) { setState(() { d['sleep'] = v; }); }),
                
                const SizedBox(height: 20),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2d73b9),
                      minimumSize: const Size(double.infinity, 50),
                    ),
                    onPressed: () async {
                      final plugin = FlutterLocalNotificationsPlugin();
                      await plugin.show(
                        99999,
                        'Qurb Prayer Notifications',
                        'Your notification channels are active and working!',
                        const NotificationDetails(
                          android: AndroidNotificationDetails(
                            'qurb_azan_channel',
                            'Prayer Times & Azan',
                            importance: Importance.max,
                            priority: Priority.high,
                            playSound: true,
                          ),
                        ),
                      );
                    },
                    child: const Text("🔔 Test Native Notification", style: TextStyle(color: Colors.white)),
                  ),
                ),
                const SizedBox(height: 40),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
"""

if "class NativeSettingsSheet" not in content:
    content += "\n" + class_inject
    with open('lib/main.dart', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected NativeSettingsSheet successfully.")
else:
    print("NativeSettingsSheet already exists.")
