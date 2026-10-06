import os
import re

def update_dart_files(root_dir):
    dart_pattern1 = re.compile(r"fontFamily:\s*['\"][^'\"]+['\"]")
    dart_pattern2 = re.compile(r"fontFamily:\s*getQuranFont\(\)")
    dart_pattern3 = re.compile(r"fontFamily:\s*mushafStyle\.fontFamily")
    dart_pattern4 = re.compile(r"fontFamily:\s*settings\.mushafStyle\.fontFamily")
    dart_pattern5 = re.compile(r"fontFamily:\s*fontFamily")
    dart_theme_pattern = re.compile(r"(ThemeData\(\s*)")

    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".dart"):
                filepath = os.path.join(dirpath, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Replace all explicit font families
                new_content = dart_pattern1.sub("fontFamily: 'NotoKufiArabic'", content)
                new_content = dart_pattern2.sub("fontFamily: 'NotoKufiArabic'", new_content)
                new_content = dart_pattern3.sub("fontFamily: 'NotoKufiArabic'", new_content)
                new_content = dart_pattern4.sub("fontFamily: 'NotoKufiArabic'", new_content)
                # For `fontFamily: fontFamily`, we should just replace it with the string.
                # But wait, there might be variables named `fontFamily` that are defined.
                # It's safer to just replace `fontFamily: [a-zA-Z0-9_\.()]+` where it's a known font dynamic variable.
                new_content = re.sub(r"fontFamily:\s*[a-zA-Z0-9_\.\(\)]+", "fontFamily: 'NotoKufiArabic'", new_content)

                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")

def update_html_css_files(root_dir):
    # This pattern matches font-family: something; or font-family: something} or font-family: something!important;
    html_pattern = re.compile(r"font-family\s*:\s*[^;}]+([;}])?")

    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".html") or filename.endswith(".css") or filename.endswith(".js"):
                filepath = os.path.join(dirpath, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Careful not to destroy the semicolon or closing brace
                def replacer(match):
                    end_char = match.group(1) if match.group(1) else ""
                    if end_char not in [";", "}"]:
                        end_char = ""
                    # Check if it has !important
                    if "!important" in match.group(0):
                        return f"font-family: 'Noto Kufi Arabic', sans-serif !important{end_char}"
                    return f"font-family: 'Noto Kufi Arabic', sans-serif{end_char}"

                new_content = html_pattern.sub(replacer, content)

                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")

if __name__ == '__main__':
    lib_dir = "lib"
    assets_web_dir = "assets/web"
    update_dart_files(lib_dir)
    update_html_css_files(assets_web_dir)
    print("Done")
