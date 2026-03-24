# Book Store Testing Checklist

## User Routes
- [x] Register new user
- [x] Register same phone again → "Phone already registered"
- [ ] Login with correct details
- [ ] Login with wrong phone → "User not found"
- [ ] Login with wrong password → "Invalid password"
- [ ] Get profile while logged in
- [ ] Get profile while logged out → 401
- [ ] Logout

## Book Routes
- [ ] Add book while logged in
- [ ] Add same book again → "Book exists already"
- [ ] Add book while logged out → 401
- [ ] Get all books (public)
- [ ] Get book by ID
- [ ] Get wrong book ID → 404
- [ ] Get my books while logged in
- [ ] Get books by seller ID
- [ ] Edit own book
- [ ] Edit another user's book → 403
- [ ] Delete own book
- [ ] Delete another user's book → 403

## Order Routes
- [ ] Create order
- [ ] Get my orders
- [ ] Get order by ID

## Validation
- [ ] Register with invalid email
- [ ] Register with invalid phone
- [ ] Add book with negative price
- [ ] Add book with empty title