const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

// Initialize Firebase Admin (make sure serviceAccountKey.json exists)

async function setupInitialData() {
  try {
    // Hash passwords for security
    const adminPassword = await hashPassword('admin123');
    
    console.log('Setting up initial admin user...');
    
    // Create initial admin user
    await db.collection('users').add({
      uid: 'admin-vit-001',
      email: 'admin@vit.edu',
      name: 'VIT Administrator',
      role: 'admin',
      password: adminPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}