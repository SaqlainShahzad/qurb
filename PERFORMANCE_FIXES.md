# Qurb — 60fps performance pass

## Root causes found and fixed
WebView (assets/web/index.html)
1. Active prayer card: 3 infinite animations driving left/top/box-shadow (layout+paint every frame) -> rewritten with transform/opacity only.
2. Non-passive document `touchmove` + `wheel` listeners (scroll waited on JS) -> removed; CSS `touch-action` used.
3. 20 `backdrop-filter` blurs -> removed (nav bar now opaque).
4. Progress bar animated `width` every second -> `scaleX` transform.
5. `content-visibility:auto` (late layout / scroll jumps) -> removed.
6. 1 Hz ticker: text written even when unchanged -> guarded writes.
7. Render-blocking Google Fonts stylesheet (Amiri, unused) -> removed.
8. Broken nested @font-face (Al Mushaf failed to load) -> fixed.
9. Dead Quran JS/CSS (QURAN_META, reader, card) -> removed.

Flutter
10. (WebView hybrid composition was tried and reverted: scrolling broke on the emulator.)
11. Qibla: sensors at gameInterval (was 200 ms) and only the compass subtree rebuilds (ValueListenableBuilder + RepaintBoundary).
12. PDF library: thumbnail Future memoized, thumbnails rendered ~360px, images decoded with cacheWidth.

## Quran removal
Deleted lib/features/quran, lib/features/quran_qurb, assets/quran, Quran-only fonts, quran_surahs.json,
`wakelock_plus` dependency and Quran entries in pubspec.yaml. `Al Mushaf` font kept (used by app theme + web CSS).

## Removed from the zip (bloat)
Qurb.apk, build_log.txt, "Quran Revision Companion v1.6.0/", scratch/, index.html.bak.performance, Noto_Kufi_Arabic.zip.

## Next steps on your machine
flutter clean && flutter pub get && flutter analyze
flutter run --profile   (verify scrolling on Home, tab switches, Qibla, PDF library)
