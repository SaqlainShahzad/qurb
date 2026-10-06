import 'dart:io';

void main() {
  var manifestFile = File('android/app/src/main/AndroidManifest.xml');
  if (!manifestFile.existsSync()) {
    print("No AndroidManifest.xml found.");
    return;
  }
  var content = manifestFile.readAsStringSync();
  print("Permissions found in AndroidManifest:");
  var regex = RegExp(r'<uses-permission.*/>');
  for (var match in regex.allMatches(content)) {
    print(match.group(0));
  }
  
  print("\nReceivers found in AndroidManifest:");
  var receiverRegex = RegExp(r'<receiver.*?>.*?<\/receiver>', dotAll: true);
  for (var match in receiverRegex.allMatches(content)) {
    print(match.group(0));
  }
}
