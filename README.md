# Vishnu Institute of Technology - Seminar Hall Booking System

A comprehensive web application for managing seminar hall bookings at Vishnu Institute of Technology. The system provides separate portals for administrators and faculty members with complete hall management features.

## Features

### Admin Portal
- **Authentication**: Secure login system for administrators
- **Faculty Management**: Create and manage faculty accounts
- **Hall Management**: Add, view, and delete seminar halls
- **Booking Management**: Review, approve, or reject seminar hall booking requests
- **Dashboard**: Overview of all bookings and faculty members

### Faculty Portal
- **Authentication**: Secure login system for faculty members
- **Hall Selection**: Choose from available seminar halls with capacity and location details
- **Booking System**: Request seminar hall bookings with date, time, hall selection, and reason
- **Status Tracking**: View booking history and approval status
- **Real-time Updates**: Automatic status updates and notifications
- **Conflict Prevention**: System prevents double booking of halls

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, EJS templating
- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Styling**: Custom CSS with modern design principles

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Download service account key as `serviceAccountKey.json`
   - Create an admin user in Firebase Authentication
   - Add admin user to Firestore users collection with role: "admin"
   - Run initial setup: `node firebase-setup.js`

4. Start the server:
   ```bash
   node server.js
   ```

5. Access the application at `http://localhost:3000`

## Usage

### Admin Setup
1. Create a Firebase project and enable authentication
2. Add an admin user to Firebase Authentication
3. Add the admin user to Firestore with role: "admin"
4. Login through the admin portal

### Faculty Management
1. Admin can create faculty accounts through the dashboard
2. Faculty members receive login credentials
3. Faculty can login and start booking seminar halls

### Booking Process
1. Faculty submits booking request with date, time, and reason
2. Admin reviews the request in the dashboard
3. Admin approves or rejects with optional reason
4. Faculty can view the status and admin response

## Database Structure

### Halls Collection
```javascript
{
  name: "Seminar Hall 1",
  capacity: 150,
  location: "Ground Floor, Academic Block A",
  facilities: "Projector, AC, Sound System, Podium",
  isActive: true,
  createdAt: timestamp
}
```

### Users Collection
```javascript
{
  uid: "firebase-user-id",
  email: "user@example.com",
  name: "User Name",
  department: "Computer Science",
  role: "faculty" | "admin",
  createdAt: timestamp
}
```

### Bookings Collection
```javascript
{
  facultyEmail: "faculty@example.com",
  facultyName: "Faculty Name",
  department: "Computer Science",
  hallId: "hall-document-id",
  hallName: "Seminar Hall 1",
  hallCapacity: 150,
  date: "2024-01-15",
  time: "14:00",
  reason: "Workshop on AI",
  status: "pending" | "approved" | "rejected",
  adminReason: "Reason for rejection",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Security Features

- Firebase Authentication for secure login
- Session management for user state
- Role-based access control
- Input validation and sanitization
- Secure password handling

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## License

This project is licensed under the MIT License.