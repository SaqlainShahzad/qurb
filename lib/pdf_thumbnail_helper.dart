import 'dart:io';
import 'package:pdf_render_maintained/pdf_render.dart';
import 'dart:ui' as ui;

class PdfThumbnailHelper {
  static final Map<String, File> _memoryCache = {};
  static final Map<String, Future<File?>> _inFlight = {};

  /// Returns the same Future for the same PDF, so FutureBuilders in build()
  /// never restart (or duplicate) thumbnail generation on rebuilds.
  static Future<File?> getThumbnail(String pdfPath) {
    final cached = _memoryCache[pdfPath];
    if (cached != null) return Future<File?>.value(cached);
    return _inFlight.putIfAbsent(pdfPath, () async {
      try {
        return await _generate(pdfPath);
      } finally {
        _inFlight.remove(pdfPath);
      }
    });
  }

  static Future<File?> _generate(String pdfPath) async {
    if (_memoryCache.containsKey(pdfPath)) {
      return _memoryCache[pdfPath];
    }

    final thumbPath = '$pdfPath.thumb.png';
    final thumbFile = File(thumbPath);

    if (await thumbFile.exists()) {
      _memoryCache[pdfPath] = thumbFile;
      return thumbFile;
    }

    try {
      final document = await PdfDocument.openFile(pdfPath);
      final page = await document.getPage(1);
      
      // Grid cards are ~160 px wide: render ~360 px wide (2x for density) instead of half the page size.
      final double scale = 360 / page.width;
      final pageImage = await page.render(
        width: (page.width * scale).round(),
        height: (page.height * scale).round(),
      );
      
      final img = await pageImage.createImageIfNotAvailable();
      final byteData = await img.toByteData(format: ui.ImageByteFormat.png);
      
      document.dispose();

      if (byteData != null) {
        await thumbFile.writeAsBytes(byteData.buffer.asUint8List());
        _memoryCache[pdfPath] = thumbFile;
        return thumbFile;
      }
    } catch (e) {
      print('Error generating thumbnail: $e');
    }
    return null;
  }
}
