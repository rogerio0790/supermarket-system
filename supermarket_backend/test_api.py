"""
Simple API test script
Run: python test_api.py
"""

import requests

BASE_URL = "http://127.0.0.1:8000/api"

def test_api():
    print("Testing Supermarket API...")
    print("-" * 50)
    
    # Test API root
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✓ API Root accessible")
        else:
            print("✗ API Root failed")
    except:
        print("✗ Cannot connect to API. Is the server running?")
        return
    
    # Test products endpoint
    try:
        response = requests.get(f"{BASE_URL}/products/")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Products endpoint working - {data['count']} products found")
        else:
            print("✗ Products endpoint failed")
    except Exception as e:
        print(f"✗ Products endpoint error: {e}")
    
    # Test categories endpoint
    try:
        response = requests.get(f"{BASE_URL}/categories/")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Categories endpoint working - {len(data)} categories found")
        else:
            print("✗ Categories endpoint failed")
    except Exception as e:
        print(f"✗ Categories endpoint error: {e}")
    
    print("-" * 50)
    print("Test complete!")

if __name__ == "__main__":
    test_api()
```

### Update .gitignore (final version)
```
# Python
venv/
*.pyc
__pycache__/
*.py[cod]
*$py.class

# Django
*.log
db.sqlite3
db.sqlite3-journal
/media
/staticfiles
logs/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Migrations (optional - uncomment if you want to ignore)
# */migrations/*.py
# !*/migrations/__init__.py