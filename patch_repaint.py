import re

file_path = "lib/features/quran/widgets/read_quran.dart"
with open(file_path, "r") as f:
    content = f.read()

# Wrap the Container inside _pageLines with RepaintBoundary
# The container is the one returning:
#       widgets.add(
#         Container(
#           height: rowHeight,
#           width: double.infinity,

replacement = """      widgets.add(
        RepaintBoundary(
          child: Container(
            height: rowHeight,
            width: double.infinity,"""
content = content.replace("""      widgets.add(
        Container(
          height: rowHeight,
          width: double.infinity,""", replacement)

# We also need to add the closing parenthesis for RepaintBoundary
# The container has:
#             ),
#           ),
#         ),
#       );
# Let's just find `FittedBox` closing... Actually, a regex might be better:

pattern = re.compile(r'(Container\([^>]*?FittedBox\([^>]*?_buildLine\([^>]*?\)[^>]*?\),[^>]*?\),[^>]*?\),[^>]*?\))', re.MULTILINE | re.DOTALL)
# Wait, parsing parentheses in regex is hard. Let's do simple string replace:
old_block = """      widgets.add(
        Container(
          height: rowHeight,
          width: double.infinity,
          padding: const EdgeInsets.only(left: 4, right: 4),
          decoration: leftRightBorder,
          child: FittedBox(
            fit: boxFit,
            child: _buildLine(
              l,
              idx,
              rowHeight,
              ayahData,
              fontSize,
              rowWidth,
              defaultTextStyle,
              themeData,
            ),
          ),
        ),
      );"""

new_block = """      widgets.add(
        RepaintBoundary(
          child: Container(
            height: rowHeight,
            width: double.infinity,
            padding: const EdgeInsets.only(left: 4, right: 4),
            decoration: leftRightBorder,
            child: FittedBox(
              fit: boxFit,
              child: _buildLine(
                l,
                idx,
                rowHeight,
                ayahData,
                fontSize,
                rowWidth,
                defaultTextStyle,
                themeData,
              ),
            ),
          ),
        ),
      );"""

if old_block in content:
    content = content.replace(old_block, new_block)
else:
    print("Could not find old block")

with open(file_path, "w") as f:
    f.write(content)

