# SWE Repository - Course Management System

A modern React-based application for managing university courses, tracking materials, and maintaining an activity log. Built with Firebase for authentication and real-time data storage.

## Features

- **User Authentication**: Secure login and registration using Firebase Authentication
- **Course Management**: Add, organize, and manage courses by semester
- **Course Materials**: Upload and organize course materials and resources
- **Activity Logging**: Track all activities and changes in the system
- **Real-time Sync**: Firebase Firestore integration for real-time data synchronization
- **Responsive Design**: Mobile-friendly interface with modern styling

## Tech Stack

- **Frontend**: React 19.2.5
- **Backend**: Firebase (Firestore + Authentication)
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Styling**: CSS-in-JS with styled components
- **Utilities**: UUID for unique identifiers

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account (free tier supported)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ifahad2k/SWE-repository.git
   cd SWE-repository
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a free Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Copy `.env.local.example` to `.env.local`
   - Add your Firebase configuration:
     ```
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```

4. **Enable Firebase Services**
   - Enable Authentication (Email/Password sign-in method)
   - Create a Firestore Database

## Development

Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Run the development server
- `npm run build` - Build the app for production
- `npm test` - Run the test suite
- `npm run deploy` - Build and deploy to Firebase Hosting

## Project Structure

```
src/
├── components/
│   ├── ActivityLogPage.js      # Activity tracking interface
│   ├── AddCourseForm.js        # Form to add new courses
│   ├── CourseCard.js           # Course display component
│   ├── CourseMaterialsPage.js  # Materials management
│   ├── Header.js               # Navigation header
│   ├── LoginPage.js            # Login interface
│   ├── RegisterPage.js         # User registration
│   └── SemesterList.js         # Semester organization
├── utils/
│   └── helpers.js              # Utility functions
├── App.js                      # Main app component
├── firebase.js                 # Firebase configuration
├── index.js                    # React entry point
└── styles.js                   # Global styles and theme
```

## Deployment

### Firebase Hosting (Recommended)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Deploy:
   ```bash
   firebase deploy
   ```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Firebase Rules

The project includes `firestore.rules` for Firestore security rules. Review and customize based on your requirements before deployment.

## Environment Variables

Create a `.env.local` file in the root directory (see `.env.local.example`). This file is ignored by git to protect your credentials.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private. All rights reserved.

## Support

For questions or issues, please open an issue on the GitHub repository.

## Changelog

### Version 0.1.0
- Initial release
- Course management system
- Firebase integration
- User authentication
- Activity logging
