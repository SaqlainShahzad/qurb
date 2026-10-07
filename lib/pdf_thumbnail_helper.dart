import 'dart:io';
import 'dart:typed_data';

import 'package:flutter/foundation.dart';
import 'package:pdfx/pdfx.dart';

class PdfThumbnailHelper {
  static final Map<String, File> _memoryCache = {};
  static final Map<String, Future<File?>> _inFlight = {};

  static Future<File?> getThumbnail(String pdfPath) {
    final cached = _memoryCache[pdfPath];

    if (cached != null && cached.existsSync()) {
      return Future<File?>.value(cached);
    }

    return _inFlight.putIfAbsent(
      pdfPath,
      () async {
        try {
          return await _generate(pdfPath);
        } finally {
          _inFlight.remove(pdfPath);
        }
      },
    );
  }

  static Future<File?> _generate(String pdfPath) async {
    try {
      final cached = _memoryCache[pdfPath];

      if (cached != null && await cached.exists()) {
        return cached;
      }

      final pdfFile = File(pdfPath);

      if (!await pdfFile.exists()) {
        debugPrint('PDF does not exist: $pdfPath');
        return null;
      }

      final thumbFile = File('$pdfPath.thumb.png');

      // Thumbnail already exists
      if (await thumbFile.exists()) {
        _memoryCache[pdfPath] = thumbFile;
        return thumbFile;
      }

      debugPrint('Generating thumbnail: $pdfPath');

      final document = await PdfDocument.openFile(pdfPath);

      if (document.pagesCount < 1) {
        document.close();
        return null;
      }

      final page = await document.getPage(1);

      const double targetWidth = 360.0;

      final double scale = targetWidth / page.width;

      // pdfx expects double values
      final double width = page.width * scale;
      final double height = page.height * scale;

      final PdfPageImage? pageImage = await page.render(
        width: width,
        height: height,
        format: PdfPageImageFormat.png,
        backgroundColor: '#FFFFFF',
      );

      if (pageImage == null) {
        debugPrint('PDF page rendering returned null.');

        page.close();
        document.close();

        return null;
      }

      final Uint8List bytes = pageImage.bytes;

      if (bytes.isEmpty) {
        debugPrint('Rendered PDF thumbnail is empty.');

        page.close();
        document.close();

        return null;
      }

      await thumbFile.writeAsBytes(
        bytes,
        flush: true,
      );

      _memoryCache[pdfPath] = thumbFile;

      debugPrint('Thumbnail created: ${thumbFile.path}');

      page.close();
      document.close();

      return thumbFile;
    } catch (e, stackTrace) {
      debugPrint('PDF thumbnail error: $e');
      debugPrint('$stackTrace');

      return null;
    }
  }

  static void clearCache() {
    _memoryCache.clear();
  }

  static void removeFromCache(String pdfPath) {
    _memoryCache.remove(pdfPath);
  }

  static Future<void> deleteThumbnail(String pdfPath) async {
    _memoryCache.remove(pdfPath);

    final thumbFile = File('$pdfPath.thumb.png');

    if (await thumbFile.exists()) {
      await thumbFile.delete();
    }
  }
}
