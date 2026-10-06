# -*- coding: utf-8 -*-
import re

with open('assets/web/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

# =============================================================
# 1. FIX MAY 17 MAGHRIB: 7,13 → 7,12 in JS MONTHS array
# =============================================================
# Current:  [3, 26, 5, 6, 12, 7, 5, 3, 7, 13, 8, 47]  (May day 17)
# Correct:  [3, 26, 5, 6, 12, 7, 5, 3, 7, 12, 8, 47]
old_may17_js = '[3, 26, 5, 6, 12, 7, 5, 3, 7, 13, 8, 47]'
new_may17_js = '[3, 26, 5, 6, 12, 7, 5, 3, 7, 12, 8, 47]'
if old_may17_js in content:
    content = content.replace(old_may17_js, new_may17_js)
    changes += 1
    print("✓ Fixed May 17 JS array (Maghrib 7:13 → 7:12)")

# =============================================================
# 2. FIX NOVEMBER 25 ASR: 3,22 → 3,23 in JS MONTHS array
# =============================================================
# Current:  [5, 24, 6, 54, 11, 58, 3, 22, 5, 5, 6, 29]  (Nov day 25)
# Correct:  [5, 24, 6, 54, 11, 58, 3, 23, 5, 5, 6, 29]
old_nov25_js = '[5, 24, 6, 54, 11, 58, 3, 22, 5, 5, 6, 29]'
new_nov25_js = '[5, 24, 6, 54, 11, 58, 3, 23, 5, 5, 6, 29]'
if old_nov25_js in content:
    content = content.replace(old_nov25_js, new_nov25_js)
    changes += 1
    print("✓ Fixed Nov 25 JS array (Asr 3:22 → 3:23)")

# =============================================================
# 3. FIX MAY 17 HTML TABLE ROW (Maghrib 7:13 → 7:12)
# =============================================================
old_may17_html = '''<tr data-day="17">
        <td class="daynum">17</td>
        <td>3:26</td>
        <td>5:06</td>
        <td>12:07</td>
        <td>5:03</td>
        <td>7:13</td>
        <td>8:47</td>
      </tr>'''
new_may17_html = '''<tr data-day="17">
        <td class="daynum">17</td>
        <td>3:26</td>
        <td>5:06</td>
        <td>12:07</td>
        <td>5:03</td>
        <td>7:12</td>
        <td>8:47</td>
      </tr>'''
if old_may17_html in content:
    content = content.replace(old_may17_html, new_may17_html)
    changes += 1
    print("✓ Fixed May 17 HTML table row (Maghrib 7:13 → 7:12)")

# =============================================================
# 4. FIX NOVEMBER 25 HTML TABLE ROW (Asr 3:22 → 3:23)
# =============================================================
old_nov25_html = '''<tr data-day="25">
        <td class="daynum">25</td>
        <td>5:24</td>
        <td>6:54</td>
        <td>11:58</td>
        <td>3:22</td>
        <td>5:05</td>
        <td>6:29</td>
      </tr>'''
new_nov25_html = '''<tr data-day="25">
        <td class="daynum">25</td>
        <td>5:24</td>
        <td>6:54</td>
        <td>11:58</td>
        <td>3:23</td>
        <td>5:05</td>
        <td>6:29</td>
      </tr>'''
if old_nov25_html in content:
    content = content.replace(old_nov25_html, new_nov25_html)
    changes += 1
    print("✓ Fixed Nov 25 HTML table row (Asr 3:22 → 3:23)")

# =============================================================
# 5. FIX ALL 12 MONTHLY AHKAM NOTE-BOX TEXT
# =============================================================
# The corruption pattern is: "8:59 بجے تک 29 منٹ تک ہے" 
# Should be: "8:59 بجے تک"
# And for Isha: "9:52 بجے سے پہلے تک ہے"
# Should be: "9:52 بجے سے پہلے تک"
# And for Maghrib: "4 منٹ 59 سیکنڈ سے کم نہ ہو"
# Should be: "59 منٹ 4 سیکنڈ"  (minutes first, then seconds)
# And Isha time format: "10:9" should be "10:09"

# Panel-cm0 (January)
note_fixes = [
    # January (panel-cm0)
    ('8:59 بجے تک 29 منٹ تک ہے', '8:59 بجے تک'),
    ('11:29 بجے تک 29 منٹ تک ہے', '11:29 بجے تک'),
    ('9:52 بجے سے پہلے تک ہے', '9:52 بجے سے پہلے تک'),
    ('4 منٹ 59 سیکنڈ سے کم نہ ہو', '59 منٹ 4 سیکنڈ'),
    
    # February (panel-cm1)
    ('8:22 بجے تک 22 منٹ تک ہے', '8:22 بجے تک'),
    ('11:41 بجے تک 41 منٹ تک ہے', '11:41 بجے تک'),
    ('10:9 بجے سے پہلے تک ہے', '10:09 بجے سے پہلے تک'),
    ('1 منٹ 57 سیکنڈ سے کم نہ ہو', '57 منٹ 1 سیکنڈ'),
    
    # March (panel-cm2)
    ('7:40 بجے تک 40 منٹ تک ہے', '7:40 بجے تک'),
    ('11:32 بجے تک 32 منٹ تک ہے', '11:32 بجے تک'),
    ('10:17 بجے سے پہلے تک ہے', '10:17 بجے سے پہلے تک'),

    # April (panel-cm3)
    ('7:19 بجے تک 19 منٹ تک ہے', '7:19 بجے تک'),
    ('11:21 بجے تک 21 منٹ تک ہے', '11:21 بجے تک'),
    ('10:20 بجے سے پہلے تک ہے', '10:20 بجے سے پہلے تک'),
    ('9 منٹ 57 سیکنڈ سے کم نہ ہو', '57 منٹ 9 سیکنڈ'),
    
    # May (panel-cm4)
    ('7:8 بجے تک 8 منٹ تک ہے', '7:08 بجے تک'),
    ('11:17 بجے تک 17 منٹ تک ہے', '11:17 بجے تک'),
    ('10:24 بجے سے پہلے تک ہے', '10:24 بجے سے پہلے تک'),
    ('62 منٹ 2 سیکنڈ سے کم نہ ہو', '62 منٹ 2 سیکنڈ'),
    
    # June (panel-cm5)
    ('7:17 بجے تک 17 منٹ تک ہے', '7:08 بجے تک'),
    ('67 منٹ 9 سیکنڈ سے کم نہ ہو', '67 منٹ 9 سیکنڈ'),
    ('10:32 بجے سے پہلے تک ہے', '10:32 بجے سے پہلے تک'),
    
    # July (panel-cm6)
    ('7:12 بجے تک 12 منٹ تک ہے', '7:12 بجے تک'),
    ('10:36 بجے سے پہلے تک ہے', '10:36 بجے سے پہلے تک'),
    ('64 منٹ 4 سیکنڈ سے کم نہ ہو', '64 منٹ 4 سیکنڈ'),
    
    # August (panel-cm7)
    ('7:23 بجے تک 23 منٹ تک ہے', '7:23 بجے تک'),
    ('11:26 بجے تک 26 منٹ تک ہے', '11:26 بجے تک'),
    ('59 منٹ سے کم نہ ہو', '59 منٹ'),
    
    # September (panel-cm8)
    ('7:34 بجے تک 34 منٹ تک ہے', '7:34 بجے تک'),
    ('11:18 بجے تک 18 منٹ تک ہے', '11:18 بجے تک'),
    ('9:59 بجے سے پہلے تک ہے', '9:59 بجے سے پہلے تک'),
    
    # October (panel-cm9)
    ('7:47 بجے تک 47 منٹ تک ہے', '7:47 بجے تک'),
    ('11:11 بجے تک 11 منٹ تک ہے', '11:11 بجے تک'),
    ('9:42 بجے سے پہلے تک ہے', '9:42 بجے سے پہلے تک'),
    ('56 منٹ 9 سیکنڈ سے کم نہ ہو', '56 منٹ 9 سیکنڈ'),
    
    # November (panel-cm10)
    ('8:10 بجے تک 10 منٹ تک ہے', '8:10 بجے تک'),
    ('9:38 بجے سے پہلے تک ہے', '9:38 بجے سے پہلے تک'),
    ('58 منٹ 5 سیکنڈ سے کم نہ ہو', '58 منٹ 5 سیکنڈ'),
    
    # December (panel-cm11)
    ('8:38 بجے تک 38 منٹ تک ہے', '8:38 بجے تک'),
    ('11:15 بجے تک 15 منٹ تک ہے', '11:15 بجے تک'),
    ('9:39 بجے سے پہلے تک ہے', '9:39 بجے سے پہلے تک'),
    ('61 منٹ 4 سیکنڈ سے کم نہ ہو', '61 منٹ 4 سیکنڈ'),
]

for old, new in note_fixes:
    if old in content:
        content = content.replace(old, new)
        changes += 1
        print(f"✓ Fixed note: '{old[:40]}...' → '{new[:40]}...'")
    else:
        print(f"⚠ Not found: '{old[:50]}...'")

# Also fix any remaining duplicated text "بجے تک XX منٹ تک ہے" pattern globally
# This catches any we might have missed
content = re.sub(r'(\d{1,2}:\d{2}) بجے تک \d+ منٹ تک ہے', r'\1 بجے تک', content)
content = re.sub(r'(\d{1,2}:\d{2}) بجے سے پہلے تک ہے', r'\1 بجے سے پہلے تک', content)

# Fix the November panel specifically
# "11:11 بجے تک" appears twice (Oct and Nov) - handle the Sawm one for Nov
# The Sawm note in Nov panel says "11:11 بجے تک 11 منٹ تک ہے" - already handled above

# Fix June Ishraq note: should be 7:08 not 7:17
# The source data says June Ishraq is 7:08 but the HTML currently has 7:17
# We already replaced "7:17 بجے تک 17 منٹ تک ہے" above to "7:08 بجے تک"

# July Sawm: "11:21 بجے تک 21 منٹ تک ہے" - overlaps with April
# Check if July still has the issue
# Actually the 11:21 in July overlaps with April's 11:21
# Let me check the August "10:20 بجے سے پہلے تک ہے" which also overlaps with April
# These are fine because we already globally fixed the pattern above

print(f"\nTotal changes: {changes}")

with open('assets/web/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
