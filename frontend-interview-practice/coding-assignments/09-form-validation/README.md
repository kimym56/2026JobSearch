# Challenge 9: Form Validation

**Time Limit:** 60 minutes
**Difficulty:** Intermediate
**Tech:** React + Vite

## Requirements

Build a multi-field form with comprehensive validation.

### Form Fields
1. **Name** (required, 2-50 characters)
2. **Email** (required, valid email format)
3. **Password** (required, min 8 chars, 1 uppercase, 1 number, 1 special char)
4. **Confirm Password** (must match password)
5. **Phone** (optional, valid format)
6. **Age** (required, 18-100)
7. **Terms** (checkbox, required)

### Must Have
1. Validate on blur (when user leaves field)
2. Validate on submit
3. Show error messages below each field
4. Disable submit button if form invalid
5. Show success message on valid submit
6. Clear form after successful submit
7. Show loading state during submit
8. Real-time validation for password strength

### Bonus (if time permits)
- Show checkmarks for valid fields
- Password strength meter with visual indicator
- Character count for name field
- Email availability check (mock API)
- Show all errors on submit
- Focus first invalid field on submit

## Validation Rules

```javascript
const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: 'Name must be 2-50 characters'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email'
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must contain uppercase, number, and special character'
  },
  age: {
    required: true,
    min: 18,
    max: 100,
    message: 'Age must be between 18 and 100'
  }
};
```

## Evaluation Criteria

- ✅ All validation rules work correctly
- ✅ Error messages are clear and helpful
- ✅ Form UX is smooth (not jarring)
- ✅ Edge cases handled (paste, autofill, etc.)
- ✅ Accessible (labels, error announcements)
- ✅ Code is clean and maintainable

## Test Cases

1. Submit empty form → all required fields show errors
2. Enter invalid email → shows error on blur
3. Enter password without uppercase → shows specific error
4. Passwords don't match → shows error on confirm field
5. Enter age 17 → shows error
6. Fix all errors → submit button becomes enabled
7. Submit valid form → shows success message
8. Try to submit while loading → button disabled

## UI/UX Tips

- Don't show errors immediately on focus
- Show errors after blur or on submit
- Use color + icons (not just color) for accessibility
- Keep error messages near the field
- Positive feedback for valid fields
- Clear indication of required fields
