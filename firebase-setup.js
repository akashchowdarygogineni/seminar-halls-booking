const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');  // Make sure this file exists

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Helper function to hash password
async function hashPassword(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function setupInitialData() {
  try {
    const adminPassword = await hashPassword('admin123');

    console.log('Setting up initial admin user...');

    await db.collection('users').add({
      uid: 'admin-vit-001',
      email: 'admin@vit.edu',
      name: 'VIT Administrator',
      role: 'admin',
      password: adminPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('Admin user created successfully.');
  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
}

setupInitialData();
