file_path = "lib/features/quran_qurb/presentation/widgets/reflow_page_widget.dart"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace(
    "return Container(\n      color: QuranColors.background,\n      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),",
    "return RepaintBoundary(\n      child: Container(\n      color: QuranColors.background,\n      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),"
)

# And close the RepaintBoundary correctly at the end of the widget build method
content = content.replace(
    "          ),\n        ),\n      ),\n    );\n  }\n}",
    "          ),\n        ),\n      ),\n    ),\n    );\n  }\n}"
)

# Alternatively, I can just not patch reflow if it's not strictly necessary. Let's try replacing it exactly.
