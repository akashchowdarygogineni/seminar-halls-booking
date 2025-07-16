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

async function setupInitialData() {
  try {
    console.log('Setting up initial data for Vishnu Institute of Technology...');
    
    // Create initial seminar halls
    const halls = [
      {
        name: 'Seminar Hall 1',
        capacity: 150,
        location: 'Ground Floor, Academic Block A',
        facilities: 'Projector, AC, Sound System, Podium'
      },
      {
        name: 'Seminar Hall 2',
        capacity: 100,
        location: 'First Floor, Academic Block A',
        facilities: 'Projector, AC, Whiteboard'
      },
      {
        name: 'Conference Hall',
        capacity: 80,
        location: 'Second Floor, Administrative Block',
        facilities: 'Video Conferencing, AC, Projector, Round Table Setup'
      },
      {
        name: 'Auditorium',
        capacity: 300,
        location: 'Ground Floor, Main Building',
        facilities: 'Stage, Sound System, Lighting, AC, Projector'
      },
      {
        name: 'Smart Classroom 1',
        capacity: 60,
        location: 'Third Floor, Academic Block B',
        facilities: 'Smart Board, AC, Projector, Audio System'
      },
      {
        name: 'Multi-Purpose Hall',
        capacity: 200,
        location: 'Ground Floor, Student Activity Center',
        facilities: 'Flexible Seating, AC, Sound System, Stage'
      }
    ];
    
    // Add halls to Firestore
    for (const hall of halls) {
      await db.collection('halls').add({
        ...hall,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Added ${hall.name}`);
    }
    
    console.log('Successfully added all seminar halls');
    console.log('Initial setup completed for VIT Seminar Hall Booking System');
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up initial data:', error);
    process.exit(1);
  }
}

setupInitialData();