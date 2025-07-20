const admin = require('firebase-admin');
require('dotenv').config();
const bcrypt = require('bcrypt');


// Initialize Firebase Admin SDK

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
  }),
});;

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
      uid: 'admin2',
      email: 'admin2@vit.edu',
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
