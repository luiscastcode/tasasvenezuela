import urllib.request
urls=[
 'https://ve.dolarapi.com/v1/dolares/oficial',
 'https://ve.dolarapi.com/v1/dolares/paralelo',
 'https://ve.dolarapi.com/v1/euros/oficial',
 'https://ve.dolarapi.com/v1/historico/dolares/oficial',
 'https://ve.dolarapi.com/v1/historico/dolares/paralelo',
 'https://ve.dolarapi.com/v1/historico/euros/oficial',
 'https://ve.dolarapi.com/v1/historico/dolares/oficial/2026-04-19'
]
for url in urls:
    print('URL', url)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            print('STATUS', r.status)
            print(r.read(5000).decode('utf-8', errors='replace')[:500])
    except Exception as e:
        print(type(e).__name__, e)
    print('-'*60)
