"""產生 README 裡的「資源清單」：整個網站各檔案的大小，方便監控 GitHub Pages 用量。
用法：python3 tools/resources.py（在 repo 根目錄執行）。GitHub Actions 每次推上去會自動跑。
"""
import os, re, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {'.git', '.github', 'tools', 'node_modules'}
LIMIT = 1024 ** 3          # GitHub Pages 建議上限 1 GB
WARN = 500 * 1024          # 單張圖片超過 500 KB 提醒重新壓縮
IMG = ('.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg')

GROUPS = [  # (名稱, 路徑開頭)
    ('作品圖（assets/img/case）', 'assets/img/case/'),
    ('課程作品圖（assets/img/work）', 'assets/img/work/'),
    ('其他圖片（logo、點陣、大頭照）', 'assets/img/'),
    ('字型（assets/fonts）', 'assets/fonts/'),
    ('程式（assets/js、vendor）', 'assets/js/'),
    ('程式（assets/js、vendor）', 'assets/vendor/'),
    ('樣式（assets/css）', 'assets/css/'),
    ('資料（assets/data、i18n）', 'assets/data/'),
    ('資料（assets/data、i18n）', 'assets/i18n/'),
    ('頁面（HTML）', ''),
]


def human(n):
    for u in ['B', 'KB', 'MB', 'GB']:
        if n < 1024 or u == 'GB':
            return f'{n:.0f} {u}' if u == 'B' else f'{n:.1f} {u}'
        n /= 1024


def collect():
    files = []
    for d, dirs, names in os.walk(ROOT):
        dirs[:] = [x for x in dirs if x not in SKIP_DIRS]
        for n in names:
            p = os.path.join(d, n)
            rel = os.path.relpath(p, ROOT).replace(os.sep, '/')
            if rel == 'README.md':
                continue
            files.append((rel, os.path.getsize(p)))
    return sorted(files, key=lambda x: -x[1])


def group_of(rel):
    for name, pre in GROUPS:
        if pre and rel.startswith(pre):
            return name
    return '頁面（HTML）' if rel.endswith('.html') else '其他'


def build(files):
    total = sum(s for _, s in files)
    g = {}
    for rel, s in files:
        k = group_of(rel)
        c, t = g.get(k, (0, 0))
        g[k] = (c + 1, t + s)
    big = [(r, s) for r, s in files if r.lower().endswith(IMG) and s > WARN]
    L = ['## 資源清單', '',
         f'> 自動產生，請勿手動修改。更新時間：{datetime.date.today().isoformat()}', '',
         f'**總計 {human(total)}**，共 {len(files)} 個檔案，約佔 GitHub Pages 建議上限（1 GB）的 {total / LIMIT * 100:.1f}%。', '']
    if big:
        L += [f'⚠️ 有 {len(big)} 張圖片超過 500 KB，建議重新壓縮：', ''] + [f'- `{r}`（{human(s)}）' for r, s in big] + ['']
    L += ['### 分類小計', '', '| 分類 | 檔案數 | 大小 |', '|---|---:|---:|']
    for k, (c, t) in sorted(g.items(), key=lambda x: -x[1][1]):
        L.append(f'| {k} | {c} | {human(t)} |')
    L += ['', '### 檔案明細（由大到小）', '', '<details><summary>展開全部檔案</summary>', '',
          '| 檔案 | 大小 |', '|---|---:|']
    L += [f'| `{r}` | {human(s)} |' for r, s in files]
    L += ['', '</details>']
    return '\n'.join(L)


def main():
    readme = os.path.join(ROOT, 'README.md')
    s = open(readme, encoding='utf-8').read()
    block = '<!-- RESOURCES:START -->\n' + build(collect()) + '\n<!-- RESOURCES:END -->'
    if '<!-- RESOURCES:START -->' in s:
        s = re.sub(r'<!-- RESOURCES:START -->.*?<!-- RESOURCES:END -->', lambda m: block, s, flags=re.S)
    else:
        s = s.rstrip() + '\n\n' + block + '\n'
    open(readme, 'w', encoding='utf-8').write(s)


if __name__ == '__main__':
    main()
