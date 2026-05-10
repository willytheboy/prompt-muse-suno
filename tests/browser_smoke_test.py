from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / 'index.html').read_text(encoding='utf-8')
diag_html = (ROOT / 'diagnose.html').read_text(encoding='utf-8')

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
        page.set_content(html, wait_until='load')
        assert 'JavaScript ready' in page.locator('#statusText').inner_text(timeout=5000)
        page.locator('#btnTapTest').click()
        assert 'tap count 1' in page.locator('#tapCount').inner_text()
        before = page.locator('#outTitle').input_value()
        page.locator('#btnSpark').click()
        after = page.locator('#outTitle').input_value()
        assert after and after != before
        page.locator('#commandSelect').select_option('save')
        assert 'library 1' in page.locator('#libraryCount').inner_text()
        page.locator('#btnPolish').click()
        assert 'Safe Commercial' in page.locator('#aiResults').inner_text()
        page.locator('#commandSelect').select_option('spark')
        assert page.locator('#outTitle').input_value()
        page.locator('#ideaPreset').select_option('The Loft After Midnight')
        assert page.locator('#outTitle').input_value() == 'The Loft After Midnight'
        assert not page.locator('#errorBox').is_visible()

        diag = browser.new_page(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
        diag.set_content(diag_html, wait_until='load')
        assert 'JavaScript started' in diag.locator('#ready').inner_text(timeout=5000)
        diag.locator('#btn').click()
        diag.locator('#link').click()
        diag.locator('#inputBtn').click()
        diag.locator('#selectTest').select_option('one')
        diag.locator('#rangeTest').fill('5')
        diag.locator('#textTest').fill('abc')
        assert 'count 6' in diag.locator('#count').inner_text()
        browser.close()

if __name__ == '__main__':
    run()
    print('v13 smoke tests passed')
