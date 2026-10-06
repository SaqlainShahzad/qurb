import 'dart:io';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';

enum AppleBooksTheme {
  warm,  // Paper / Warm (Default iOS Books style: #F8F5EE)
  white, // Pure White: #FFFFFF
  sepia, // Sepia: #EED9A6 / #F4ECD8
  night, // Night / OLED Dark: #121212
}

class PdfViewerScreen extends StatefulWidget {
  final String title;
  final String filePath;
  final int initialPage;
  final String bookId;

  const PdfViewerScreen({
    super.key,
    required this.title,
    required this.filePath,
    this.initialPage = 0,
    required this.bookId,
  });

  @override
  State<PdfViewerScreen> createState() => _PdfViewerScreenState();
}

class _PdfViewerScreenState extends State<PdfViewerScreen> with SingleTickerProviderStateMixin {
  late PdfViewerController _pdfViewerController;
  int _currentPage = 1;
  int _pageCount = 0;
  AppleBooksTheme _theme = AppleBooksTheme.warm;
  bool _isVertical = true;
  bool _isDocumentLoading = true;
  bool _showControls = true;
  bool _isBookmarked = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _pdfViewerController = PdfViewerController();
    _currentPage = widget.initialPage > 0 ? widget.initialPage + 1 : 1;
    _validateAndInit();
  }

  void _validateAndInit() {
    if (widget.filePath.isEmpty) {
      setState(() {
        _isDocumentLoading = false;
        _errorMessage = 'Invalid or empty document path.';
      });
      return;
    }

    final file = File(widget.filePath);
    if (!file.existsSync()) {
      setState(() {
        _isDocumentLoading = false;
        _errorMessage = 'Document not found on storage.\n${widget.filePath}';
      });
      return;
    }

    _loadSettings();
  }

  Future<void> _loadSettings() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final themeIndex = prefs.getInt('apple_books_theme') ?? 0; // Default warm
      final isVert = prefs.getBool('apple_books_vertical') ?? true;
      final bookmarked = prefs.getBool('pdf_fav_${widget.bookId}') ?? false;
      if (mounted) {
        setState(() {
          _theme = AppleBooksTheme.values[themeIndex.clamp(0, AppleBooksTheme.values.length - 1)];
          _isVertical = isVert;
          _isBookmarked = bookmarked;
        });
      }
    } catch (e) {
      debugPrint('Error loading viewer settings: $e');
    }
  }

  Future<void> _saveSettings() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt('apple_books_theme', _theme.index);
      await prefs.setBool('apple_books_vertical', _isVertical);
    } catch (e) {
      debugPrint('Error saving viewer settings: $e');
    }
  }

  Future<void> _saveBookmark(int page) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt('pdf_bookmark_${widget.bookId}', page - 1);
      if (_pageCount > 0) {
        await prefs.setInt('pdf_total_pages_${widget.bookId}', _pageCount);
      }
    } catch (e) {
      debugPrint('Error saving PDF progress: $e');
    }
  }

  Future<void> _toggleFavorite() async {
    setState(() {
      _isBookmarked = !_isBookmarked;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('pdf_fav_${widget.bookId}', _isBookmarked);
    } catch (e) {
      debugPrint('Error saving favorite: $e');
    }
  }

  Color _getBackgroundColor() {
    switch (_theme) {
      case AppleBooksTheme.warm:
        return const Color(0xFFF8F5EE);
      case AppleBooksTheme.white:
        return const Color(0xFFFFFFFF);
      case AppleBooksTheme.sepia:
        return const Color(0xFFEED9A6);
      case AppleBooksTheme.night:
        return const Color(0xFF121212);
    }
  }

  Color _getChromeBarColor() {
    switch (_theme) {
      case AppleBooksTheme.warm:
        return const Color(0xFFF8F5EE).withOpacity(0.92);
      case AppleBooksTheme.white:
        return Colors.white.withOpacity(0.94);
      case AppleBooksTheme.sepia:
        return const Color(0xFFEED9A6).withOpacity(0.92);
      case AppleBooksTheme.night:
        return const Color(0xFF1E1E1E).withOpacity(0.92);
    }
  }

  Color _getTextColor() {
    switch (_theme) {
      case AppleBooksTheme.warm:
        return const Color(0xFF2C1810);
      case AppleBooksTheme.white:
        return const Color(0xFF1A1C1E);
      case AppleBooksTheme.sepia:
        return const Color(0xFF4A3423);
      case AppleBooksTheme.night:
        return const Color(0xFFEEEEEE);
    }
  }

  ColorFilter _getColorFilter() {
    switch (_theme) {
      case AppleBooksTheme.white:
        return const ColorFilter.mode(Colors.transparent, BlendMode.dst);
      case AppleBooksTheme.warm:
        return const ColorFilter.matrix(<double>[
          0.97, 0, 0, 0, 10,
          0, 0.95, 0, 0, 8,
          0, 0, 0.90, 0, 0,
          0, 0, 0, 1, 0,
        ]);
      case AppleBooksTheme.sepia:
        return const ColorFilter.matrix(<double>[
          0.90, 0, 0, 0, 32,
          0, 0.84, 0, 0, 20,
          0, 0, 0.70, 0, 0,
          0, 0, 0, 1, 0,
        ]);
      case AppleBooksTheme.night:
        return const ColorFilter.matrix(<double>[
          -1, 0, 0, 0, 255,
          0, -1, 0, 0, 255,
          0, 0, -1, 0, 255,
          0, 0, 0, 1, 0,
        ]);
    }
  }

  void _showAppearanceSheet() {
    final chromeColor = _getChromeBarColor();
    final textColor = _getTextColor();

    showModalBottomSheet(
      context: context,
      backgroundColor: chromeColor,
      elevation: 10,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Handle bar
                    Container(
                      width: 36,
                      height: 4,
                      decoration: BoxDecoration(
                        color: textColor.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                    const SizedBox(height: 18),
                    Text(
                      'Themes & Layout',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: textColor,
                        fontFamily: 'Al Mushaf',
                      ),
                    ),
                    const SizedBox(height: 20),

                    // 4 Apple Books Themes selector
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _buildThemeOption(
                          theme: AppleBooksTheme.warm,
                          label: 'Paper',
                          color: const Color(0xFFF8F5EE),
                          border: const Color(0xFFD6C7B2),
                          onTap: () {
                            setState(() => _theme = AppleBooksTheme.warm);
                            setSheetState(() {});
                            _saveSettings();
                          },
                        ),
                        _buildThemeOption(
                          theme: AppleBooksTheme.white,
                          label: 'White',
                          color: const Color(0xFFFFFFFF),
                          border: const Color(0xFFE2E8F0),
                          onTap: () {
                            setState(() => _theme = AppleBooksTheme.white);
                            setSheetState(() {});
                            _saveSettings();
                          },
                        ),
                        _buildThemeOption(
                          theme: AppleBooksTheme.sepia,
                          label: 'Sepia',
                          color: const Color(0xFFEED9A6),
                          border: const Color(0xFFCBB280),
                          onTap: () {
                            setState(() => _theme = AppleBooksTheme.sepia);
                            setSheetState(() {});
                            _saveSettings();
                          },
                        ),
                        _buildThemeOption(
                          theme: AppleBooksTheme.night,
                          label: 'Night',
                          color: const Color(0xFF121212),
                          border: const Color(0xFF333333),
                          onTap: () {
                            setState(() => _theme = AppleBooksTheme.night);
                            setSheetState(() {});
                            _saveSettings();
                          },
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),
                    const Divider(height: 1, color: Colors.black12),
                    const SizedBox(height: 16),

                    // Scroll Direction Toggle (Continuous vs Slide)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Continuous Vertical Scroll',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: textColor),
                        ),
                        Switch.adaptive(
                          value: _isVertical,
                          activeColor: const Color(0xFF0F4C81),
                          onChanged: (val) {
                            setState(() {
                              _isVertical = val;
                            });
                            setSheetState(() {});
                            _saveSettings();
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildThemeOption({
    required AppleBooksTheme theme,
    required String label,
    required Color color,
    required Color border,
    required VoidCallback onTap,
  }) {
    final isSelected = _theme == theme;
    final textColor = _getTextColor();

    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
              border: Border.all(
                color: isSelected ? const Color(0xFF0F4C81) : border,
                width: isSelected ? 3 : 1.5,
              ),
              boxShadow: [
                if (isSelected)
                  BoxShadow(
                    color: const Color(0xFF0F4C81).withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
              ],
            ),
            child: isSelected
                ? Icon(
                    Icons.check_rounded,
                    size: 22,
                    color: theme == AppleBooksTheme.night ? Colors.white : const Color(0xFF0F4C81),
                  )
                : null,
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }

  void _showJumpToPageDialog() {
    final textController = TextEditingController(text: '$_currentPage');
    final textColor = _getTextColor();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: _getChromeBarColor(),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Text(
            'Jump to Page',
            style: TextStyle(color: textColor, fontSize: 17, fontWeight: FontWeight.bold),
          ),
          content: TextField(
            controller: textController,
            keyboardType: TextInputType.number,
            autofocus: true,
            style: TextStyle(color: textColor, fontWeight: FontWeight.bold),
            decoration: InputDecoration(
              hintText: 'Page (1 - $_pageCount)',
              hintStyle: TextStyle(color: textColor.withOpacity(0.4)),
              filled: true,
              fillColor: Colors.black.withOpacity(0.05),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('Cancel', style: TextStyle(color: textColor.withOpacity(0.7))),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0F4C81),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () {
                final pageNum = int.tryParse(textController.text);
                if (pageNum != null && pageNum >= 1 && pageNum <= _pageCount) {
                  _pdfViewerController.jumpToPage(pageNum);
                  Navigator.pop(context);
                }
              },
              child: const Text('Go', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final bgColor = _getBackgroundColor();
    final chromeColor = _getChromeBarColor();
    final textColor = _getTextColor();
    final remainingPages = _pageCount > _currentPage ? _pageCount - _currentPage : 0;

    return Scaffold(
      backgroundColor: bgColor,
      body: _errorMessage != null
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 16),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.error_outline_rounded, color: Colors.redAccent, size: 48),
                      const SizedBox(height: 16),
                      Text(
                        'Failed to Open Document',
                        style: TextStyle(
                          color: textColor,
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _errorMessage!,
                        textAlign: TextAlign.center,
                        style: TextStyle(color: textColor.withOpacity(0.7), fontSize: 13),
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0F4C81),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        icon: const Icon(Icons.arrow_back),
                        label: const Text('Return to Library'),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                ),
              ),
            )
          : GestureDetector(
              onTap: () {
                setState(() {
                  _showControls = !_showControls;
                });
              },
              child: Stack(
                children: [
                  // PDF Viewer Content Area
                  Positioned.fill(
                    child: ColorFiltered(
                      colorFilter: _getColorFilter(),
                      child: SfPdfViewer.file(
                        File(widget.filePath),
                        controller: _pdfViewerController,
                        pageLayoutMode: _isVertical
                            ? PdfPageLayoutMode.continuous
                            : PdfPageLayoutMode.single,
                        scrollDirection: _isVertical
                            ? PdfScrollDirection.vertical
                            : PdfScrollDirection.horizontal,
                        enableDoubleTapZooming: true,
                        enableTextSelection: true,
                        canShowScrollHead: false,
                        canShowScrollStatus: false,
                        canShowPaginationDialog: false,
                        onTap: (PdfGestureDetails details) {
                          setState(() {
                            _showControls = !_showControls;
                          });
                        },
                        onDocumentLoaded: (PdfDocumentLoadedDetails details) {
                          setState(() {
                            _pageCount = details.document.pages.count;
                            _isDocumentLoading = false;
                            _errorMessage = null;
                          });
                          if (_currentPage > 1) {
                            _pdfViewerController.jumpToPage(_currentPage);
                          }
                          _saveBookmark(_currentPage);
                        },
                        onDocumentLoadFailed: (PdfDocumentLoadFailedDetails details) {
                          setState(() {
                            _isDocumentLoading = false;
                            _errorMessage = 'PDF Engine Error: ${details.description}';
                          });
                        },
                        onPageChanged: (PdfPageChangedDetails details) {
                          setState(() {
                            _currentPage = details.newPageNumber;
                          });
                          _saveBookmark(details.newPageNumber);
                        },
                      ),
                    ),
                  ),

                  // Loading State
                  if (_isDocumentLoading)
                    Container(
                      color: bgColor,
                      child: Center(
                        child: CircularProgressIndicator(
                          color: const Color(0xFF0F4C81),
                          backgroundColor: textColor.withOpacity(0.1),
                        ),
                      ),
                    ),

                  // Top App Bar (Apple Books Translucent Glassmorphic Style)
                  AnimatedPositioned(
                    duration: const Duration(milliseconds: 250),
                    curve: Curves.easeInOut,
                    top: _showControls ? 0 : -90,
                    left: 0,
                    right: 0,
                    child: Container(
                      decoration: BoxDecoration(
                        color: chromeColor,
                        border: Border(
                          bottom: BorderSide(color: textColor.withOpacity(0.08)),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 10,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: SafeArea(
                        bottom: false,
                        child: SizedBox(
                          height: 52,
                          child: Row(
                            children: [
                              // Back button
                              IconButton(
                                icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
                                color: textColor,
                                onPressed: () => Navigator.pop(context),
                              ),
                              // Title
                              Expanded(
                                child: Text(
                                  widget.title,
                                  style: TextStyle(
                                    color: textColor,
                                    fontSize: 15,
                                    fontWeight: FontWeight.w600,
                                    letterSpacing: -0.2,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              // Jump to page / Table of Contents
                              IconButton(
                                icon: const Icon(Icons.format_list_numbered_rounded, size: 22),
                                color: textColor,
                                tooltip: 'Jump to Page',
                                onPressed: _pageCount > 0 ? _showJumpToPageDialog : null,
                              ),
                              // Bookmark
                              IconButton(
                                icon: Icon(
                                  _isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_border_rounded,
                                  size: 22,
                                  color: _isBookmarked ? const Color(0xFFD4AF37) : textColor,
                                ),
                                tooltip: 'Bookmark',
                                onPressed: _toggleFavorite,
                              ),
                              // Aa button (Appearance & Themes)
                              IconButton(
                                icon: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    border: Border.all(color: textColor.withOpacity(0.3), width: 1.2),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    'Aa',
                                    style: TextStyle(
                                      color: textColor,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                      fontFamily: 'Al Mushaf',
                                    ),
                                  ),
                                ),
                                tooltip: 'Themes & Appearance',
                                onPressed: _showAppearanceSheet,
                              ),
                              const SizedBox(width: 4),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),

                  // Bottom Floating Pill Scrubber (Apple Books Scrubber)
                  AnimatedPositioned(
                    duration: const Duration(milliseconds: 250),
                    curve: Curves.easeInOut,
                    bottom: _showControls ? 20 : -100,
                    left: 20,
                    right: 20,
                    child: Center(
                      child: Container(
                        constraints: const BoxConstraints(maxWidth: 420),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        decoration: BoxDecoration(
                          color: chromeColor,
                          borderRadius: BorderRadius.circular(28),
                          border: Border.all(color: textColor.withOpacity(0.1)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.12),
                              blurRadius: 18,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // Page Slider
                            if (_pageCount > 1)
                              Row(
                                children: [
                                  GestureDetector(
                                    onTap: _currentPage > 1
                                        ? () => _pdfViewerController.previousPage()
                                        : null,
                                    child: Icon(
                                      Icons.chevron_left_rounded,
                                      color: _currentPage > 1 ? textColor : textColor.withOpacity(0.25),
                                      size: 26,
                                    ),
                                  ),
                                  Expanded(
                                    child: SliderTheme(
                                      data: SliderThemeData(
                                        activeTrackColor: const Color(0xFF0F4C81),
                                        inactiveTrackColor: textColor.withOpacity(0.15),
                                        thumbColor: const Color(0xFF0F4C81),
                                        thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                                        overlayShape: const RoundSliderOverlayShape(overlayRadius: 14),
                                        trackHeight: 3,
                                      ),
                                      child: Slider(
                                        min: 1,
                                        max: _pageCount.toDouble(),
                                        value: _currentPage.toDouble().clamp(1.0, _pageCount.toDouble()),
                                        onChanged: (val) {
                                          _pdfViewerController.jumpToPage(val.toInt());
                                        },
                                      ),
                                    ),
                                  ),
                                  GestureDetector(
                                    onTap: _currentPage < _pageCount
                                        ? () => _pdfViewerController.nextPage()
                                        : null,
                                    child: Icon(
                                      Icons.chevron_right_rounded,
                                      color: _currentPage < _pageCount ? textColor : textColor.withOpacity(0.25),
                                      size: 26,
                                    ),
                                  ),
                                ],
                              ),

                            // Subtitle Status
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Page $_currentPage of $_pageCount',
                                  style: TextStyle(
                                    color: textColor,
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                if (remainingPages > 0)
                                  Text(
                                    '$remainingPages pages left',
                                    style: TextStyle(
                                      color: textColor.withOpacity(0.6),
                                      fontSize: 11,
                                    ),
                                  )
                                else if (_pageCount > 0)
                                  const Text(
                                    'Completed',
                                    style: TextStyle(
                                      color: Color(0xFF0F4C81),
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
