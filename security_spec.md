# Firebase Security Specification - BookStore

## Data Invariants
- A user profile must have a valid role ('reader' or 'author').
- A book must be associated with a valid authorId that matches the creator's UID.
- All IDs must follow standard alphanumeric patterns.
- Read access to `/users/{userId}` is restricted to the owner.
- `/books/{bookId}` is publicly readable.
- Only users with the `author` role can create documents in `/books`.

## The Dirty Dozen (Payloads to Deny)
1. **Identity Spoofing**: Creating a user profile with a UID that doesn't match `auth.uid`.
2. **Privilege Escalation**: A 'reader' trying to set their own role to 'author' during registration.
3. **Ghost Creation**: Creating a book with an `authorId` other than the current user.
4. **ID Poisoning**: Injecting a 2KB string as a `bookId` to cause storage bloat.
5. **Metadata Tampering**: A user updating the `createdAt` timestamp of a book after publication.
6. **Cross-User Library Access**: User A trying to list the contents of User B's `/users/B/library` subcollection.
7. **Role Hijacking**: User A trying to update the `name` or `email` of User B.
8. **Invalid Category**: Creating a book with a category that isn't in the allowed enum (e.g., 'Hacking').
9. **Unverified Write**: An unverified user attempting to publish a book (if email verification is mandated).
10. **Counter Manipulation**: A non-author directly incrementing the `likes` field on a book document without proper action-based validation.
11. **Shadow Fields**: Adding an `isAdmin: true` field to a user profile payload.
12. **Content Injection**: A 1MB string in the `title` field.

## Security Rules Deployment Plan
1. Standalone `isValidUser` and `isValidBook` helpers.
2. Master Gate pattern for `/users/{userId}`.
3. Master Gate with action-based update for `/books/{bookId}`.
4. Enforce `author` role check via `get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'author'`.
