// Firebase Admin SDK Setup Instructions
// This file contains the instructions for setting up Firebase Admin SDK for your project

/*
FIREBASE ADMIN SDK SETUP:

1. Go to https://console.firebase.google.com/
2. Select your project or create a new one

3. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in test mode (you can modify rules later)

4. Generate Service Account Key:
   - Go to Project Settings > Service accounts
   - Click "Generate new private key"
   - Download the JSON file and rename it to "serviceAccountKey.json"
   - Place it in your project root directory

5. Enable Authentication (optional for user management):
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication

6. Create initial admin user in Firestore:
   - Go to Firestore Database
   - Create a new collection called "users"
   - Add a document with these fields:
     {
       uid: "admin-uid-123",
       email: "admin@college.edu",
       name: "System Administrator",
       role: "admin",
       password: "admin123", // Change this in production
       createdAt: [current timestamp]
     }

7. Database Collections Structure:

   USERS COLLECTION:
   {
     uid: "unique-user-id",
     email: "user@example.com",
     name: "User Name",
     department: "Computer Science", // for faculty only
     role: "admin" | "faculty",
     password: "hashed-password", // In production, use proper hashing
     createdAt: timestamp
   }

   BOOKINGS COLLECTION:
   {
     facultyEmail: "faculty@example.com",
     facultyName: "Faculty Name",
     department: "Computer Science",
     date: "2024-01-15",
     time: "14:00",
     reason: "Workshop on AI",
     status: "pending" | "approved" | "rejected",
     adminReason: "Reason for rejection (optional)",
     createdAt: timestamp,
     updatedAt: timestamp
   }

8. Security Rules for Firestore:
   Go to Firestore Database > Rules and use:
   
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }

9. IMPORTANT SECURITY NOTES:
   - Keep your serviceAccountKey.json file secure and never commit it to version control
   - Add serviceAccountKey.json to your .gitignore file
   - In production, use environment variables for sensitive data
   - Implement proper password hashing (bcrypt) instead of plain text passwords
   - Use proper input validation and sanitization

10. Default Login Credentials (after setup):
    Admin: admin@college.edu / admin123
    (Create faculty accounts through admin dashboard)
*/

// Example of how the serviceAccountKey.json should look:
/*
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com"
}
*/