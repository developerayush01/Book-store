# Book Store Testing Checklist

## User Routes
- [x] Register new user
- [x] Register same phone again → "Phone already registered"
- [x] Login with correct details
- [x] Login with wrong phone → "User not found"
- [x] Login with wrong password → "Invalid password"
- [x] Get profile while logged in
- [x] Get profile while logged out → 401
- [x] Logout

## Book Routes
- [x] Add book while logged in
- [x] Add same book again → "Book exists already"
- [x] Add book while logged out → 401
- [x] Get all books (public)
- [x] Get book by ID
- [x] Get wrong book ID → 404
- [x] Get my books while logged in
- [x] Get books by seller ID
- [x] Edit own book
- [x] Edit another user's book → 403
- [x] Delete own book
- [x] Delete another user's book → 403
- [x] Delete when logged out → 401

## Order Routes
- [ ] Create order
- [ ] Get my orders
- [ ] Get order by ID

## Validation
- [ ] Register with invalid email
- [ ] Register with invalid phone
- [ ] Add book with negative price
- [ ] Add book with empty title