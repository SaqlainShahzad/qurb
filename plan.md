### Implementation Plan

**1. NOTIFICATIONS (Enforcing ONE Authoritative Path)**
*   **File:** `assets/web/index.html`
    *   **Action:** Remove the `sendNotificationBridge('scheduleDailyPrayers', dailyPayload);` call inside `__syncNativePrayerNotifications`.
    *   **Expected Behavior:** JavaScript will now solely rely on `schedulePrayerBatch` to transmit the schedule, eliminating the duplicate scheduling trigger.
*   **File:** `lib/main.dart`
    *   **Action:** Rewrite `_schedulePrayerBatch` to calculate a perfectly deterministic ID for every event using the formula: `(Month * 1000) + (Day * 20) + PrayerTypeID` (where `Fajr=1`, `Dhuhr=2`, `Asr=3`, `Maghrib=4`, `Isha=5`, `Sunrise=6`, `MakruhStart=7`, `MakruhEnd=8`, `Tahajjud=9`, `Others=10-19`).
    *   **Action:** Explicitly invoke `await NotificationService.plugin.cancel(alarmId);` before scheduling the new slot to ensure idempotency.
    *   **Action:** Remove the fallback `hour*100+minute` logic and the `_scheduleDailyPrayers` handling to guarantee no conflicting notification paths.
    *   **Expected Behavior:** Batching is preserved for offline reliability, but every prayer event receives exactly one immutable ID. Duplicate overlapping alarms for the same prayer are impossible.

**2. PERFORMANCE (Frame-Pacing Optimization)**
*   **File:** `assets/web/index.html`
    *   **Action:** Refactor the `updateCountdown()` function. Instead of blindly executing `el.innerHTML = '<span class="cd-time">...</span>...'` every 1000ms, it will cache the `.cd-time` and `.cd-label` nodes and strictly update their `.textContent`.
    *   **Expected Behavior:** The visual countdown behaves identically, but the browser engine skips the expensive DOM parsing and reflow cycle, yielding smooth frame pacing without dropped Flutter render frames.

**3. QURAN FONT**
*   **File:** `assets/web/index.html`
    *   **Action:** Replace `font-family: 'Noto Kufi Arabic'` with `font-family: 'Al Mushaf'` exclusively within Quran-specific CSS classes (`.quran-bismillah`, `.quran-ayah-text`, `.quran-ayah-num`, `.quran-surah-ar`, `.quran-reader-title .ar`) and Quran inline spans.
    *   **Expected Behavior:** The authentic `Al Mushaf` font renders for all Arabic Quranic text, while the rest of the application's UI safely retains its intended `Noto Kufi Arabic` typography.

**4. INFO PAGE RELIABILITY**
*   **File:** `lib/features/quran/pages/main_page.dart`
    *   **Action:** Inject `if (!mounted) return;` lifecycle guards into `_showInfoScreen` and all adjacent 3-dots menu callback methods (`_openBookmarksPage`, etc.).
    *   **Expected Behavior:** The async `.then()` resolution of the `PopupMenuButton` will no longer crash the `Navigator` if the user navigates away or closes the view during the micro-gap. The Info page will open reliably.

I will now implement these changes, execute the build verification (`flutter analyze`, `flutter clean`, `flutter pub get`, `flutter build apk`), and report the final outcomes.
