file_path = "lib/features/quran_qurb/presentation/widgets/mushaf_page_widget.dart"
with open(file_path, "r") as f:
    content = f.read()

content = content.replace(
    "return Container(\n          color: QuranColors.background,",
    "return RepaintBoundary(\n          child: Container(\n          color: QuranColors.background,"
)

# Also close it
content = content.replace(
    "            }).toList(),\n          ),\n        );\n      },\n    );\n  }\n}",
    "            }).toList(),\n          ),\n        ),\n        );\n      },\n    );\n  }\n}"
)

with open(file_path, "w") as f:
    f.write(content)
