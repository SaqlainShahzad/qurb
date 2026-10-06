file_path = "lib/features/quran/widgets/read_quran.dart"
with open(file_path, "r") as f:
    content = f.read()

# Let's find the `RepaintBoundary(` and properly format it
import re

content = re.sub(
    r'RepaintBoundary\(\s*child: Container\(\s*height: rowHeight,\s*width: double.infinity,',
    r'RepaintBoundary(child: Container(height: rowHeight, width: double.infinity,',
    content
)

content = re.sub(
    r'(child: _buildLine\([^\)]+\),\s*\),\s*\),\s*\),\s*\);)',
    lambda m: m.group(1).replace('),', '),),', 1) if 'RepaintBoundary' in m.group(1) else m.group(1),
    content
)

# wait, I can just replace the whole block again
old_text = """      widgets.add(
        RepaintBoundary(child: Container(height: rowHeight, width: double.infinity,
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

new_text = """      widgets.add(
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
content = content.replace(old_text, new_text)

with open(file_path, "w") as f:
    f.write(content)
