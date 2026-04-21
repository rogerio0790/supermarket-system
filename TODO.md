# TODO: Fix CORS blocking API calls (Profile 403 & products not loading)

## Steps:
1. [x] **Edit CORS settings** in `supermarket_backend/config/settings.py` (done):
   - Add `'http://172.20.10.3:3000'` to `CORS_ALLOWED_ORIGINS`
   - Add `'http://172.20.10.3:3000'` to `CSRF_TRUSTED_ORIGINS`

2. [ ] **Restart Django server**:
   ```
   cd supermarket_backend
   python manage.py runserver
   ```

3. [ ] **Test frontend** (http://172.20.10.3:3000):
   - Refresh page
   - Check products/categories load
   - Navigate to Account → should fetch profile (login first if needed)

4. [ ] **Verify user active** (if still 403 after CORS fix):
   ```
   cd supermarket_backend
   python manage.py shell
   ```
   ```python
   from accounts.models import User
   user = User.objects.first()  # or get(email='...')
   user.is_active = True
   user.save()
   ```

5. [ ] Mark complete
