const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const admin = require('firebase-admin');

const { hashPassword, verifyPassword, validatePasswordStrength } = require('./utils/auth');
const app = express();
const port = 3000;

// Firebase Admin SDK configuration
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

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'seminar-hall-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/');
  }
  next();
};

// Routes
app.get('/', (req, res) => {
  res.render('index', { error: null });
});

app.get('/admin-login', (req, res) => {
  res.render('admin-login', { error: null });
});

app.get('/faculty-login', (req, res) => {
  res.render('faculty-login', { error: null });
});

// Admin login
app.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Get user by email from Firestore
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).where('role', '==', 'admin').get();
    
    if (snapshot.empty) {
      return res.render('admin-login', { error: 'Access denied. Admin privileges required.' });
    }
    
    const userData = snapshot.docs[0].data();
    
    // Verify hashed password
    const isValidPassword = await verifyPassword(password, userData.password);
    if (!isValidPassword) {
      return res.render('admin-login', { error: 'Invalid email or password.' });
    }
    
    req.session.user = {
      uid: userData.uid,
      email: userData.email,
      role: 'admin',
      name: userData.name
    };
    
    res.redirect('/admin-dashboard');
  } catch (error) {
    console.error('Admin login error:', error);
    res.render('admin-login', { error: 'Login failed. Please try again.' });
  }
});

// Faculty login
app.post('/faculty-login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Get user by email from Firestore
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).where('role', '==', 'faculty').get();
    
    if (snapshot.empty) {
      return res.render('faculty-login', { error: 'Access denied. Faculty account required.' });
    }
    
    const userData = snapshot.docs[0].data();
    
    // Verify hashed password
    const isValidPassword = await verifyPassword(password, userData.password);
    if (!isValidPassword) {
      return res.render('faculty-login', { error: 'Invalid email or password.' });
    }
    
    req.session.user = {
      uid: userData.uid,
      email: userData.email,
      role: 'faculty',
      name: userData.name,
      department: userData.department
    };
    
    res.redirect('/faculty-dashboard');
  } catch (error) {
    console.error('Faculty login error:', error);
    res.render('faculty-login', { error: 'Login failed. Please try again.' });
  }
});

// Admin dashboard
app.get('/admin-dashboard', requireAdmin, async (req, res) => {
  try {
    // Get all halls
    const hallsRef = db.collection('halls');
    const hallsSnapshot = await hallsRef.orderBy('name').get();
    const halls = hallsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const bookingsRef = db.collection('bookings');
    const bookingsSnapshot = await bookingsRef.orderBy('createdAt', 'desc').get();
    const bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const facultyRef = db.collection('users');
    const facultySnapshot = await facultyRef.where('role', '==', 'faculty').get();
    const faculty = facultySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.render('admin-dashboard', { bookings, faculty, halls, user: req.session.user });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.render('admin-dashboard', { bookings: [], faculty: [], halls: [], user: req.session.user, error: error.message });
  }
});

// Faculty dashboard
app.get('/faculty-dashboard', requireAuth, async (req, res) => {
  try {
    // Get all halls
    const hallsRef = db.collection('halls');
    const hallsSnapshot = await hallsRef.orderBy('name').get();
    const halls = hallsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const bookingsRef = db.collection('bookings');
    const bookingsSnapshot = await bookingsRef
      .where('facultyEmail', '==', req.session.user.email)
      .orderBy('createdAt', 'desc')
      .get();
    const bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.render('faculty-dashboard', { bookings, halls, user: req.session.user });
  } catch (error) {
    console.error('Faculty dashboard error:', error);
    res.render('faculty-dashboard', { bookings: [], halls: [], user: req.session.user, error: error.message });
  }
});

// Create faculty account
app.post('/create-faculty', requireAdmin, async (req, res) => {
  const { name, email, password, department } = req.body;
  
  try {
    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.redirect('/admin-dashboard?error=' + encodeURIComponent(passwordValidation.message));
    }
    
    // Hash the password before storing
    const hashedPassword = await hashPassword(password);
    
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: name
    });
    
    // Add user to Firestore
    await db.collection('users').add({
      uid: userRecord.uid,
      email: email,
      name: name,
      department: department,
      role: 'faculty',
      password: hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.redirect('/admin-dashboard');
  } catch (error) {
    console.error('Create faculty error:', error);
    res.redirect('/admin-dashboard?error=' + encodeURIComponent(error.message));
  }
});

// Book seminar hall
app.post('/book-hall', requireAuth, async (req, res) => {
  const { date, time, reason, hallId } = req.body;
  
  try {
    // Get hall details
    const hallDoc = await db.collection('halls').doc(hallId).get();
    if (!hallDoc.exists) {
      return res.redirect('/faculty-dashboard?error=' + encodeURIComponent('Selected hall not found'));
    }
    
    const hallData = hallDoc.data();
    
    // Check if hall is already booked for the same date and time
    const existingBooking = await db.collection('bookings')
      .where('hallId', '==', hallId)
      .where('date', '==', date)
      .where('time', '==', time)
      .where('status', '==', 'approved')
      .get();
    
    if (!existingBooking.empty) {
      return res.redirect('/faculty-dashboard?error=' + encodeURIComponent('Hall is already booked for this date and time'));
    }
    
    await db.collection('bookings').add({
      facultyEmail: req.session.user.email,
      facultyName: req.session.user.name,
      department: req.session.user.department,
      hallId: hallId,
      hallName: hallData.name,
      hallCapacity: hallData.capacity,
      date: date,
      time: time,
      reason: reason,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.redirect('/faculty-dashboard');
  } catch (error) {
    console.error('Book hall error:', error);
    res.redirect('/faculty-dashboard?error=' + encodeURIComponent(error.message));
  }
});

// Approve/Reject booking
app.post('/update-booking/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, adminReason } = req.body;
  
  try {
    const bookingRef = db.collection('bookings').doc(id);
    await bookingRef.update({
      status: status,
      adminReason: adminReason || '',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.redirect('/admin-dashboard');
  } catch (error) {
    console.error('Update booking error:', error);
    res.redirect('/admin-dashboard?error=' + encodeURIComponent(error.message));
  }
});

// Delete faculty
app.post('/delete-faculty/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get faculty data first
    const facultyDoc = await db.collection('users').doc(id).get();
    const facultyData = facultyDoc.data();
    
    // Delete from Firebase Auth
    if (facultyData && facultyData.uid) {
      await auth.deleteUser(facultyData.uid);
    }
    
    // Delete from Firestore
    await db.collection('users').doc(id).delete();
    
    res.redirect('/admin-dashboard');
  } catch (error) {
    console.error('Delete faculty error:', error);
    res.redirect('/admin-dashboard?error=' + encodeURIComponent(error.message));
  }
});

// Add seminar hall
app.post('/add-hall', requireAdmin, async (req, res) => {
  const { name, capacity, location, facilities } = req.body;
  
  try {
    await db.collection('halls').add({
      name: name,
      capacity: parseInt(capacity),
      location: location,
      facilities: facilities,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.redirect('/admin-dashboard');
  } catch (error) {
    console.error('Add hall error:', error);
    res.redirect('/admin-dashboard?error=' + encodeURIComponent(error.message));
  }
});

// Delete seminar hall
app.post('/delete-hall/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    await db.collection('halls').doc(id).delete();
    res.redirect('/admin-dashboard');
  } catch (error) {
    console.error('Delete hall error:', error);
    res.redirect('/admin-dashboard?error=' + encodeURIComponent(error.message));
  }
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});