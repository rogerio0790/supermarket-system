# Product Reviews Implementation TODO

## Backend Changes
- [ ] 1. Update products/models.py - Add Review model
- [ ] 2. Update products/serializers.py - Add ReviewSerializer, update ProductDetailSerializer
- [ ] 3. Update products/views.py - Add ReviewListCreateView
- [ ] 4. Update products/urls.py - Add reviews endpoint
- [ ] 5. Create products/admin.py - Register Review

## Database
- [ ] 6. Run: cd supermarket_backend && python manage.py makemigrations products && python manage.py migrate

## Frontend
- [ ] 7. Create src/components/products/ProductReviews.jsx - Fetch/display/write reviews
- [ ] 8. Update pages/ProductDetailPage.js - Dynamic ratings, fix components
- [ ] 9. Update styles/ProductDetailPage.css - Reviews styling

## Testing
- [ ] 10. Backend: Test API endpoints (list/create reviews)
- [ ] 11. Frontend: cd supermarket-frontend && npm start, test review write/display (login required)
- [ ] 12. Add sample data via admin, verify average rating calculation

