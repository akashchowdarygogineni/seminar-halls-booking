const admin = require('firebase-admin');

// Initialize Firebase Admin
try {
  const serviceAccount = require("./serviceAccountKey.json");
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
  
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  process.exit(1);
}

const db = admin.firestore();
const auth = admin.auth();

async function createAdminUser() {
  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: 'admin@college.edu',
      password: 'admin123',
      displayName: 'System Administrator'
    });
    
    console.log('Successfully created admin user in Auth:', userRecord.uid);
    
    // Add user to Firestore
    await db.collection('users').add({
      uid: userRecord.uid,
      email: 'admin@college.edu',
      name: 'System Administrator',
      role: 'admin',
      password: 'admin123', // In production, hash this password
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Successfully added admin user to Firestore');
    console.log('Admin login credentials:');
    console.log('Email: admin@college.edu');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();