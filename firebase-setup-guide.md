# Firebase Setup Guide for Seminar Hall Booking System

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `seminar-hall-booking`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Get started**
2. Go to **Sign-in method** tab
3. Click on **Email/Password**
4. Enable **Email/Password** (first option)
5. **DO NOT** enable **Email link (passwordless sign-in)**
6. Click **Save**

## Step 3: Enable Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (for development)
3. Select your preferred location
4. Click **Done**

## Step 4: Generate Service Account Key

1. Go to **Project Settings** (gear icon) → **Service accounts**
2. Click **Generate new private key**
3. Click **Generate key** - this downloads a JSON file
4. Rename the downloaded file to `serviceAccountKey.json`
5. Place it in your project root directory

## Step 5: Create Initial Admin User

1. Go to **Authentication** → **Users** tab
2. Click **Add user**
3. Enter:
   - Email: `admin@college.edu`
   - Password: `admin123`
4. Click **Add user**

## Step 6: Add Admin to Firestore

1. Go to **Firestore Database**
2. Click **Start collection**
3. Collection ID: `users`
4. Document ID: Click **Auto-ID**
5. Add these fields:
   ```
   uid: [copy the UID from Authentication users]
   email: admin@college.edu
   name: System Administrator
   role: admin
   password: admin123
   createdAt: [timestamp - click the timestamp icon]
   ```
6. Click **Save**

## Step 7: Update Firestore Rules (Optional for Development)

Go to **Firestore Database** → **Rules** and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Note**: This allows all read/write operations. In production, implement proper security rules.

## Step 8: Verify Setup

1. Make sure `serviceAccountKey.json` is in your project root
2. The file should contain your actual Firebase project credentials
3. Start your server: `npm start`
4. Go to `http://localhost:3000`
5. Try logging in as admin with: `admin@college.edu` / `admin123`

## Troubleshooting

### Error: "configuration-not-found"
- Make sure Authentication is enabled in Firebase Console
- Verify Email/Password sign-in method is enabled
- Check that serviceAccountKey.json has correct project_id

### Error: "Permission denied"
- Update Firestore rules to allow read/write operations
- Make sure the admin user exists in both Authentication and Firestore

### Error: "serviceAccountKey.json not found"
- Download the service account key from Firebase Console
- Place it in the project root directory
- Make sure it's named exactly `serviceAccountKey.json`

## Security Notes

- Never commit `serviceAccountKey.json` to version control
- The file is already added to `.gitignore`
- In production, use environment variables for sensitive data
- Implement proper Firestore security rules before deployment