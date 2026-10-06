import 'dart:io';
import 'package:qurb_app/pdf_thumbnail_helper.dart';
import 'dart:convert';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'pdf_viewer_screen.dart';

class PdfBook {
  final String id;
  String title;
  String path;
  final String? fileName;
  final int fileSize;
  final int dateAdded;
  int lastReadPage;
  int totalPages;
  bool isFavorite;
  String category;

  PdfBook({
    required this.id,
    required this.title,
    required this.path,
    this.fileName,
    required this.fileSize,
    required this.dateAdded,
    this.lastReadPage = 0,
    this.totalPages = 0,
    this.isFavorite = false,
    this.category = 'General',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'path': path,
        'fileName': fileName ?? p.basename(path),
        'fileSize': fileSize,
        'dateAdded': dateAdded,
        'lastReadPage': lastReadPage,
        'totalPages': totalPages,
        'isFavorite': isFavorite,
        'category': category,
      };

  factory PdfBook.fromJson(Map<String, dynamic> json) => PdfBook(
        id: json['id'] as String,
        title: json['title'] as String,
        path: json['path'] as String,
        fileName: json['fileName'] as String? ?? p.basename(json['path'] as String? ?? ''),
        fileSize: json['fileSize'] as int? ?? 0,
        dateAdded: json['dateAdded'] as int? ?? 0,
        lastReadPage: json['lastReadPage'] as int? ?? 0,
        totalPages: json['totalPages'] as int? ?? 0,
        isFavorite: json['isFavorite'] as bool? ?? false,
        category: json['category'] as String? ?? 'General',
      );

  PdfBook copyWith({
    String? id,
    String? title,
    String? path,
    String? fileName,
    int? fileSize,
    int? dateAdded,
    int? lastReadPage,
    int? totalPages,
    bool? isFavorite,
    String? category,
  }) {
    return PdfBook(
      id: id ?? this.id,
      title: title ?? this.title,
      path: path ?? this.path,
      fileName: fileName ?? this.fileName,
      fileSize: fileSize ?? this.fileSize,
      dateAdded: dateAdded ?? this.dateAdded,
      lastReadPage: lastReadPage ?? this.lastReadPage,
      totalPages: totalPages ?? this.totalPages,
      isFavorite: isFavorite ?? this.isFavorite,
      category: category ?? this.category,
    );
  }
}

class PdfLibraryScreen extends StatefulWidget {
  const PdfLibraryScreen({super.key});

  @override
  State<PdfLibraryScreen> createState() => _PdfLibraryScreenState();
}

class _PdfLibraryScreenState extends State<PdfLibraryScreen> {
  List<PdfBook> _books = [];
  List<PdfBook> _filteredBooks = [];
  bool _isLoading = true;
  bool _isGridView = true;
  String _searchQuery = '';
  String _activeCategory = 'all';

  @override
  void initState() {
    super.initState();
    _loadBooks();
  }

  Future<String> _getLibraryDirPath() async {
    final docsDir = await getApplicationDocumentsDirectory();
    final libraryDir = Directory(p.join(docsDir.path, 'qurb_pdf_books'));
    if (!libraryDir.existsSync()) {
      libraryDir.createSync(recursive: true);
    }
    return libraryDir.path;
  }

  Future<void> _loadBooks() async {
    setState(() => _isLoading = true);
    final prefs = await SharedPreferences.getInstance();
    final jsonList = prefs.getStringList('qurb_pdf_library_v1') ?? [];
    final libDirPath = await _getLibraryDirPath();

    List<PdfBook> loaded = [];
    for (final item in jsonList) {
      try {
        final map = jsonDecode(item) as Map<String, dynamic>;
        var book = PdfBook.fromJson(map);

        String resolvedPath = book.path;
        if (!File(resolvedPath).existsSync()) {
          final relName = book.fileName ?? p.basename(book.path);
          final candidatePath = p.join(libDirPath, relName);
          if (File(candidatePath).existsSync()) {
            resolvedPath = candidatePath;
            book = book.copyWith(path: resolvedPath);
          }
        }

        if (File(resolvedPath).existsSync()) {
          final bookmark = prefs.getInt('pdf_bookmark_${book.id}');
          if (bookmark != null) {
            book.lastReadPage = bookmark;
          }
          final total = prefs.getInt('pdf_total_pages_${book.id}');
          if (total != null && total > 0) {
            book.totalPages = total;
          }
          final fav = prefs.getBool('pdf_fav_${book.id}');
          if (fav != null) {
            book.isFavorite = fav;
          }
          loaded.add(book);
        }
      } catch (e) {
        debugPrint('Error parsing book: $e');
      }
    }

    if (mounted) {
      setState(() {
        _books = loaded;
        _filterBooks();
        _isLoading = false;
      });
    }
  }

  Future<void> _saveBooks() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = _books.map((b) => jsonEncode(b.toJson())).toList();
    await prefs.setStringList('qurb_pdf_library_v1', jsonList);
  }

  void _filterBooks() {
    List<PdfBook> list = _books;

    if (_activeCategory == 'favorites') {
      list = list.where((b) => b.isFavorite).toList();
    } else if (_activeCategory == 'recent') {
      list = list.where((b) => b.lastReadPage > 0).toList();
    }

    if (_searchQuery.isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      list = list
          .where((b) => b.title.toLowerCase().contains(q) || b.category.toLowerCase().contains(q))
          .toList();
    }

    _filteredBooks = list;
  }

  Future<void> _importPdfFile() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf'],
      );

      if (result != null && result.files.single.path != null) {
        final originalFile = File(result.files.single.path!);
        if (!originalFile.existsSync()) {
          throw Exception('Picked document could not be found.');
        }

        final libDirPath = await _getLibraryDirPath();
        final fileName = result.files.single.name;
        final bookId = '${DateTime.now().millisecondsSinceEpoch}';
        final sanitizedName = '${bookId}_$fileName';
        final newPath = p.join(libDirPath, sanitizedName);

        await originalFile.copy(newPath);
        final newFile = File(newPath);
        if (!newFile.existsSync()) {
          throw Exception('Failed to save document to storage.');
        }

        final fileSize = await newFile.length();
        final book = PdfBook(
          id: bookId,
          title: fileName.replaceAll('.pdf', '').replaceAll('_', ' '),
          path: newPath,
          fileName: sanitizedName,
          fileSize: fileSize,
          dateAdded: DateTime.now().millisecondsSinceEpoch,
        );

        setState(() {
          _books.insert(0, book);
          _filterBooks();
        });
        await _saveBooks();

        if (mounted) {
          _openReader(book);
        }
      }
    } catch (e) {
      debugPrint('Error importing PDF: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to import PDF: $e'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  void _openReader(PdfBook book) async {
    final prefs = await SharedPreferences.getInstance();
    final lastPage = prefs.getInt('pdf_bookmark_${book.id}') ?? 0;
    if (!mounted) return;
    await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PdfViewerScreen(
          title: book.title,
          filePath: book.path,
          initialPage: lastPage,
          bookId: book.id,
        ),
      ),
    );
    _loadBooks();
  }

  void _showRenameDialog(PdfBook book) {
    final controller = TextEditingController(text: book.title);
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFFF8F5EE),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Rename Document',
            style: TextStyle(color: Color(0xFF2C1810), fontSize: 17, fontWeight: FontWeight.bold)),
        content: TextField(
          controller: controller,
          autofocus: true,
          style: const TextStyle(color: Color(0xFF2C1810), fontWeight: FontWeight.w600),
          decoration: InputDecoration(
            hintText: 'Enter title...',
            hintStyle: const TextStyle(color: Color(0xFF8C7A6B)),
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFD6C7B2)),
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF8C7A6B))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0F4C81),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () {
              final newTitle = controller.text.trim();
              if (newTitle.isNotEmpty) {
                setState(() {
                  book.title = newTitle;
                  _filterBooks();
                });
                _saveBooks();
                Navigator.pop(context);
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _toggleFavorite(PdfBook book) async {
    setState(() {
      book.isFavorite = !book.isFavorite;
      _filterBooks();
    });
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('pdf_fav_${book.id}', book.isFavorite);
    _saveBooks();
  }

  Future<void> _deleteBook(PdfBook book) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFFF8F5EE),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Delete Document',
            style: TextStyle(color: Color(0xFF2C1810), fontSize: 17, fontWeight: FontWeight.bold)),
        content: Text('Are you sure you want to remove "${book.title}" from your library?',
            style: const TextStyle(color: Color(0xFF5C4033))),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF8C7A6B))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.redAccent,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      try {
        final f = File(book.path);
        if (f.existsSync()) f.deleteSync();
      } catch (e) {
        debugPrint('File deletion error: $e');
      }

      setState(() {
        _books.removeWhere((b) => b.id == book.id);
        _filterBooks();
      });
      await _saveBooks();
    }
  }

  String _formatFileSize(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  }

  @override
  Widget build(BuildContext context) {
    final recentlyReadBooks = _books.where((b) => b.lastReadPage > 0).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8F5EE),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8F5EE),
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF2C1810)),
        title: Row(
          children: [
            const Text(
              'کتب خانہ',
              style: TextStyle(
                fontSize: 21,
                fontWeight: FontWeight.bold,
                color: Color(0xFF2C1810),
                fontFamily: 'Al Mushaf',
              ),
            ),
            const SizedBox(width: 6),
            const Text(
              '• Library',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF5C4033),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 2),
              decoration: BoxDecoration(
                color: const Color(0xFF0F4C81),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '${_books.length}',
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(
              _isGridView ? Icons.view_list_rounded : Icons.grid_view_rounded,
              color: const Color(0xFF2C1810),
            ),
            tooltip: _isGridView ? 'List View' : 'Grid View',
            onPressed: () {
              setState(() {
                _isGridView = !_isGridView;
              });
            },
          ),
          IconButton(
            icon: const Icon(Icons.add_circle_rounded, color: Color(0xFF0F4C81), size: 28),
            tooltip: 'Import PDF',
            onPressed: _importPdfFile,
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF0F4C81)))
          : CustomScrollView(
              slivers: [
                // 1. High-contrast Search Bar
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 8, 16, 10),
                    child: Container(
                      height: 48,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFD6C7B2)),
                        boxShadow: [
                          BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 6, offset: const Offset(0, 2)),
                        ],
                      ),
                      child: TextField(
                        style: const TextStyle(color: Color(0xFF2C1810), fontSize: 14, fontWeight: FontWeight.w600),
                        onChanged: (val) {
                          setState(() {
                            _searchQuery = val;
                            _filterBooks();
                          });
                        },
                        decoration: InputDecoration(
                          hintText: 'Search documents... / کتاب تلاش کریں',
                          hintStyle: const TextStyle(color: Color(0xFF8C7A6B), fontSize: 13),
                          prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFF0F4C81), size: 20),
                          suffixIcon: _searchQuery.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(Icons.clear_rounded, size: 18, color: Color(0xFF8C7A6B)),
                                  onPressed: () {
                                    setState(() {
                                      _searchQuery = '';
                                      _filterBooks();
                                    });
                                  },
                                )
                              : null,
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                    ),
                  ),
                ),

                // 2. Category Filter Chips
                SliverToBoxAdapter(
                  child: SizedBox(
                    height: 44,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      children: [
                        _buildFilterChip('all', 'All Books (تمام)'),
                        _buildFilterChip('recent', 'Recently Read (زیرِ مطالعہ)'),
                        _buildFilterChip('favorites', 'Favorites (پسندیدہ)'),
                      ],
                    ),
                  ),
                ),

                // 3. Recently Read Horizontal Carousel (Apple Books Style)
                if (recentlyReadBooks.isNotEmpty && _searchQuery.isEmpty && _activeCategory == 'all')
                  SliverToBoxAdapter(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Padding(
                          padding: EdgeInsets.fromLTRB(18, 16, 16, 8),
                          child: Text(
                            'Recently Read',
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF2C1810),
                              letterSpacing: -0.3,
                            ),
                          ),
                        ),
                        SizedBox(
                          height: 160,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: recentlyReadBooks.length,
                            itemBuilder: (context, index) {
                              final book = recentlyReadBooks[index];
                              final progress = book.totalPages > 0
                                  ? (book.lastReadPage / book.totalPages * 100).clamp(0, 100).toInt()
                                  : 0;

                              return Container(
                                width: 220,
                                margin: const EdgeInsets.only(right: 12),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: const Color(0xFFE2E8F0)),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.04),
                                      blurRadius: 10,
                                      offset: const Offset(0, 3),
                                    ),
                                  ],
                                ),
                                child: InkWell(
                                  borderRadius: BorderRadius.circular(16),
                                  onTap: () => _openReader(book),
                                  child: Padding(
                                    padding: const EdgeInsets.all(12),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Row(
                                          children: [
                                            Container(
                                              width: 38,
                                              height: 48,
                                              decoration: BoxDecoration(
                                                color: const Color(0xFF0F4C81),
                                                borderRadius: BorderRadius.circular(8),
                                              ),
                                              child: const Icon(Icons.picture_as_pdf_rounded,
                                                  color: Colors.white, size: 22),
                                            ),
                                            const SizedBox(width: 10),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    book.title,
                                                    style: const TextStyle(
                                                      color: Color(0xFF2C1810),
                                                      fontSize: 13,
                                                      fontWeight: FontWeight.bold,
                                                    ),
                                                    maxLines: 2,
                                                    overflow: TextOverflow.ellipsis,
                                                  ),
                                                  const SizedBox(height: 2),
                                                  Text(
                                                    _formatFileSize(book.fileSize),
                                                    style: const TextStyle(
                                                        color: Color(0xFF8C7A6B), fontSize: 10),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                              children: [
                                                Text(
                                                  'Page ${book.lastReadPage + 1}${book.totalPages > 0 ? ' of ${book.totalPages}' : ''}',
                                                  style: const TextStyle(
                                                    color: Color(0xFF0F4C81),
                                                    fontSize: 11,
                                                    fontWeight: FontWeight.w600,
                                                  ),
                                                ),
                                                if (progress > 0)
                                                  Text(
                                                    '$progress%',
                                                    style: const TextStyle(
                                                      color: Color(0xFF8C7A6B),
                                                      fontSize: 10,
                                                      fontWeight: FontWeight.bold,
                                                    ),
                                                  ),
                                              ],
                                            ),
                                            const SizedBox(height: 6),
                                            ClipRRect(
                                              borderRadius: BorderRadius.circular(4),
                                              child: LinearProgressIndicator(
                                                value: book.totalPages > 0
                                                    ? (book.lastReadPage / book.totalPages).clamp(0.0, 1.0)
                                                    : 0.1,
                                                backgroundColor: const Color(0xFFE2E8F0),
                                                valueColor: const AlwaysStoppedAnimation<Color>(
                                                    Color(0xFF0F4C81)),
                                                minHeight: 4,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),

                // 4. Section Title for All Documents
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(18, 18, 16, 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          _activeCategory == 'favorites'
                              ? 'Favorites'
                              : _activeCategory == 'recent'
                                  ? 'Recent Documents'
                                  : 'All Documents',
                          style: const TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF2C1810),
                            letterSpacing: -0.3,
                          ),
                        ),
                        Text(
                          '${_filteredBooks.length} items',
                          style: const TextStyle(fontSize: 12, color: Color(0xFF8C7A6B)),
                        ),
                      ],
                    ),
                  ),
                ),

                // 5. Empty State
                if (_filteredBooks.isEmpty)
                  SliverFillRemaining(
                    hasScrollBody: false,
                    child: Center(
                      child: Padding(
                        padding: const EdgeInsets.all(32.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: 80,
                              height: 80,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(24),
                                border: Border.all(color: const Color(0xFFD6C7B2)),
                                boxShadow: [
                                  BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10),
                                ],
                              ),
                              child: const Icon(Icons.menu_book_rounded,
                                  size: 40, color: Color(0xFF0F4C81)),
                            ),
                            const SizedBox(height: 18),
                            const Text(
                              'کوئی کتاب موجود نہیں، پی ڈی ایف شامل کریں',
                              style: TextStyle(
                                color: Color(0xFF2C1810),
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                fontFamily: 'Al Mushaf',
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 6),
                            const Text(
                              'Select a PDF from your device to start reading with offline bookmarks and reading progress.',
                              textAlign: TextAlign.center,
                              style: TextStyle(color: Color(0xFF6B5B4E), fontSize: 13),
                            ),
                            const SizedBox(height: 24),
                            ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF0F4C81),
                                foregroundColor: Colors.white,
                                elevation: 3,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 13),
                              ),
                              icon: const Icon(Icons.add_rounded),
                              label: const Text('Import PDF',
                                  style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 0.3)),
                              onPressed: _importPdfFile,
                            ),
                          ],
                        ),
                      ),
                    ),
                  )
                else if (_isGridView)
                  // 6. Grid View
                  SliverPadding(
                    padding: const EdgeInsets.fromLTRB(16, 4, 16, 90),
                    sliver: SliverGrid(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.72,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                      ),
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final book = _filteredBooks[index];
                          return _buildGridCard(book);
                        },
                        childCount: _filteredBooks.length,
                      ),
                    ),
                  )
                else
                  // 7. List View
                  SliverPadding(
                    padding: const EdgeInsets.fromLTRB(16, 4, 16, 90),
                    sliver: SliverList(
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final book = _filteredBooks[index];
                          return _buildListCard(book);
                        },
                        childCount: _filteredBooks.length,
                      ),
                    ),
                  ),
              ],
            ),
    );
  }

  Widget _buildFilterChip(String key, String label) {
    final isSelected = _activeCategory == key;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: ChoiceChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (val) {
          setState(() {
            _activeCategory = key;
            _filterBooks();
          });
        },
        selectedColor: const Color(0xFF0F4C81),
        backgroundColor: Colors.white,
        labelStyle: TextStyle(
          color: isSelected ? Colors.white : const Color(0xFF5C4033),
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          fontSize: 12,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
          side: BorderSide(
            color: isSelected ? const Color(0xFF0F4C81) : const Color(0xFFD6C7B2),
          ),
        ),
        showCheckmark: false,
      ),
    );
  }

  Widget _buildGridCard(PdfBook book) {
    final progress = book.totalPages > 0
        ? (book.lastReadPage / book.totalPages * 100).clamp(0, 100).toInt()
        : 0;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => _openReader(book),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Preview Cover
            Expanded(
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      const Color(0xFF0F4C81).withOpacity(0.12),
                      const Color(0xFFE2E8F0),
                    ],
                  ),
                ),
                child: Stack(
                  children: [
                    FutureBuilder<File?>(
                      future: PdfThumbnailHelper.getThumbnail(book.path),
                      builder: (context, snapshot) {
                        if (snapshot.hasData && snapshot.data != null) {
                          return Positioned.fill(
                            child: Image.file(
                              snapshot.data!,
                              fit: BoxFit.cover,
                              cacheWidth: 360,
                              gaplessPlayback: true,
                            ),
                          );
                        }
                        return const Center(
                          child: Icon(
                            Icons.picture_as_pdf_rounded,
                            size: 44,
                            color: Color(0xFF0F4C81),
                          ),
                        );
                      },
                    ),
                    if (book.isFavorite)
                      const Positioned(
                        top: 8,
                        left: 8,
                        child: Icon(Icons.bookmark_rounded, color: Color(0xFFD4AF37), size: 20),
                      ),
                    Positioned(
                      top: 4,
                      right: 4,
                      child: _buildPopupMenu(book),
                    ),
                    if (progress > 0)
                      Positioned(
                        bottom: 8,
                        left: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.65),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            '$progress%',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),

            // Info Block
            Padding(
              padding: const EdgeInsets.all(10.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    book.title,
                    style: const TextStyle(
                      color: Color(0xFF2C1810),
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        _formatFileSize(book.fileSize),
                        style: const TextStyle(color: Color(0xFF8C7A6B), fontSize: 10),
                      ),
                      if (book.lastReadPage > 0)
                        Text(
                          'p. ${book.lastReadPage + 1}',
                          style: const TextStyle(
                            color: Color(0xFF0F4C81),
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                    ],
                  ),
                  if (book.totalPages > 0) ...[
                    const SizedBox(height: 6),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(2),
                      child: LinearProgressIndicator(
                        value: (book.lastReadPage / book.totalPages).clamp(0.0, 1.0),
                        backgroundColor: const Color(0xFFE2E8F0),
                        valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF0F4C81)),
                        minHeight: 3,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildListCard(PdfBook book) {
    return Card(
      color: Colors.white,
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () => _openReader(book),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 54,
                decoration: BoxDecoration(
                  color: const Color(0xFF0F4C81),
                  borderRadius: BorderRadius.circular(10),
                ),
                clipBehavior: Clip.hardEdge,
                child: FutureBuilder<File?>(
                  future: PdfThumbnailHelper.getThumbnail(book.path),
                  builder: (context, snapshot) {
                    if (snapshot.hasData && snapshot.data != null) {
                      return Image.file(
                        snapshot.data!,
                        fit: BoxFit.cover,
                        cacheWidth: 120,
                        gaplessPlayback: true,
                      );
                    }
                    return const Icon(Icons.picture_as_pdf_rounded, color: Colors.white, size: 24);
                  },
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      book.title,
                      style: const TextStyle(
                        color: Color(0xFF2C1810),
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Text(
                          _formatFileSize(book.fileSize),
                          style: const TextStyle(color: Color(0xFF8C7A6B), fontSize: 11),
                        ),
                        if (book.lastReadPage > 0) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0F4C81).withOpacity(0.1),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              'Page ${book.lastReadPage + 1}',
                              style: const TextStyle(
                                color: Color(0xFF0F4C81),
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
              _buildPopupMenu(book),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPopupMenu(PdfBook book) {
    return PopupMenuButton<String>(
      icon: const Icon(Icons.more_vert_rounded, color: Color(0xFF8C7A6B), size: 20),
      color: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      onSelected: (val) {
        if (val == 'rename') {
          _showRenameDialog(book);
        } else if (val == 'favorite') {
          _toggleFavorite(book);
        } else if (val == 'delete') {
          _deleteBook(book);
        }
      },
      itemBuilder: (context) => [
        const PopupMenuItem(
          value: 'rename',
          child: Row(
            children: [
              Icon(Icons.edit_outlined, color: Color(0xFF2C1810), size: 18),
              SizedBox(width: 10),
              Text('Rename', style: TextStyle(color: Color(0xFF2C1810), fontSize: 13)),
            ],
          ),
        ),
        PopupMenuItem(
          value: 'favorite',
          child: Row(
            children: [
              Icon(
                book.isFavorite ? Icons.bookmark_remove_rounded : Icons.bookmark_add_rounded,
                color: const Color(0xFFD4AF37),
                size: 18,
              ),
              const SizedBox(width: 10),
              Text(
                book.isFavorite ? 'Remove Bookmark' : 'Add Bookmark',
                style: const TextStyle(color: Color(0xFF2C1810), fontSize: 13),
              ),
            ],
          ),
        ),
        const PopupMenuDivider(height: 1),
        const PopupMenuItem(
          value: 'delete',
          child: Row(
            children: [
              Icon(Icons.delete_outline_rounded, color: Colors.redAccent, size: 18),
              SizedBox(width: 10),
              Text('Delete', style: TextStyle(color: Colors.redAccent, fontSize: 13)),
            ],
          ),
        ),
      ],
    );
  }
}
