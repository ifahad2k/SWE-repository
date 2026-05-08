# SWEHUB — Undergraduate SWE Course Material Hub

An IUT-specific course material hub that reuses the dark, monospace, hacker-aesthetic design of the cybersec-roadmap project. Instead of **Phases → Tracks → Topics**, the hierarchy becomes **Semesters → Courses → Material Sections**.

---

## Existing Design Reference

The cybersec-roadmap project ([App.js](file:///e:/skill/roadmap/cybersec-roadmap/src/App.js)) uses:

- **React 19 + Create React App** with inline styles
- **Firebase Firestore** for real-time data sync (with localStorage fallback)
- Dark background (`#030508`), monospace font, neon accent colors, grid overlay, glow orbs
- Accordion-based UI: Phase cards expand to show tracks, tracks expand to show topics + materials
- A dedicated `MaterialsPage` for viewing/adding/deleting links

SWEHUB will keep this **exact visual language** but restructure the data and add authentication + activity logging.

---

## Data Architecture

### Hierarchy Mapping

| Cybersec Roadmap | SWEHUB |
|---|---|
| Phase (7 fixed) | Semester (8 fixed) |
| Track (fixed per phase) | Course (dynamic, user-added per semester) |
| Materials (PDF/Video/Course) | Material Sections (4 default + custom) |

### Semester Structure

```
Semester 1 → Semester 8 (fixed, always 8)
  └── Course (dynamic — added/removed by authenticated users)
        ├── Lecture (Drive links)
        ├── Books (Drive links)
        ├── Previous Year Questions (Drive links)
        ├── Notes (Drive links)
        └── [Custom Sections] (user-added, Drive links)
```

### Semester Color Palette

Each semester gets its own accent color (matching the phase-color pattern):

| Semester | Color | Icon |
|---|---|---|
| 1st | `#00ff88` (green) | 📗 |
| 2nd | `#00ccff` (cyan) | 📘 |
| 3rd | `#ff8800` (orange) | 📙 |
| 4th | `#cc00ff` (purple) | 📕 |
| 5th | `#ff0044` (red) | 🔴 |
| 6th | `#ffdd00` (gold) | 🟡 |
| 7th | `#ff4488` (pink) | 🩷 |
| 8th | `#44ff88` (lime) | 🟢 |

---

## Firebase Schema

### Firestore Collections

```
/semesters/{semesterId}
  ├── number: 1-8
  └── courses: [{
        id: "uuid",
        name: "CSE 4502 - Software Engineering",
        code: "CSE 4502",
        credit: 3.0,
        addedBy: "username@iut-dhaka.edu",
        addedAt: timestamp,
        sections: [
          {
            id: "uuid",
            name: "Lecture",       // default section
            type: "default",
            materials: [
              { id: "uuid", title: "Lecture 1 - Intro", url: "https://drive.google.com/...", addedBy: "...", addedAt: timestamp }
            ]
          },
          {
            id: "uuid",
            name: "Books",         // default section
            type: "default",
            materials: [...]
          },
          {
            id: "uuid",
            name: "Previous Year Questions",  // default section
            type: "default",
            materials: [...]
          },
          {
            id: "uuid",
            name: "Notes",         // default section
            type: "default",
            materials: [...]
          },
          {
            id: "uuid",
            name: "Lab Reports",   // custom section (user-added)
            type: "custom",
            materials: [...]
          }
        ]
      }]

/users/{userId}
  ├── name: "Md. Fahad Islam"
  ├── roll: "210041126"
  ├── email: "username@iut-dhaka.edu"
  ├── passwordHash: (handled by Firebase Auth)
  └── createdAt: timestamp

/activity_log/{logId}
  ├── action: "ADD_COURSE" | "REMOVE_COURSE" | "ADD_MATERIAL" | "REMOVE_MATERIAL" | "ADD_SECTION" | "REMOVE_SECTION"
  ├── details: "Added CSE 4502 to Semester 4"
  ├── userId: "username@iut-dhaka.edu"
  ├── userName: "Md. Fahad Islam"
  ├── userRoll: "210041126"
  ├── semesterNumber: 4
  ├── courseName: "CSE 4502"
  ├── timestamp: server timestamp
  └── metadata: { ... } (extra context)
```

---

## Authentication System

### Rules
- **Email must match**: `*@iut-dhaka.edu` (validated with regex on both client and Firebase rules)
- **Password**: Minimum 8 characters
- **Required fields**: IUT Roll Number, Full Name, IUT Email
- **Firebase Auth**: Email/password authentication provider

### User Roles
- **Authenticated Users**: Can add/remove courses, add/remove materials, add custom sections
- **Visitors (no account)**: Can browse semesters, courses, and materials (read-only). Cannot add, edit, or delete anything.

### UI Behavior
- A **Login / Register** button in the header (top-right)
- Login form asks for: Email + Password
- Register form asks for: Full Name, IUT Roll, IUT Email, Password (8+ chars)
- After login, the user's name appears in the header with a logout button
- All add/delete buttons are **hidden** for unauthenticated visitors

---

## Proposed Changes

### New Project Setup

> [!IMPORTANT]
> This will be a **brand new project** in a new directory (e.g., `e:\skill\roadmap\swehub`), not a modification of the cybersec-roadmap project.

We will use **Create React App** (same as the original) to keep the stack identical.

---

### Core Application

#### [NEW] `src/App.js`

The main application component. Pages managed via state (no React Router needed, matching original pattern):

- **`home`** — Landing page with semester accordions
- **`course`** — Course detail page with material sections
- **`login`** — Login form
- **`register`** — Registration form
- **`activityLog`** — Activity log viewer

Key UI structure:
```
Header (SWEHUB branding + Login/User info + Activity Log link)
├── Grid background + glow orbs (identical to cybersec)
├── Hero section (SWEHUB title, stats bar: 8 Semesters, X Courses, etc.)
└── Semester Accordion List
      ├── Semester 1 (click to expand)
      │     ├── Course Card 1 (click to open course materials page)
      │     ├── Course Card 2
      │     └── [+ ADD COURSE] button (auth only)
      ├── Semester 2
      └── ... (Semester 8)
```

#### [NEW] `src/firebase.js`

Firebase config with **both Firestore and Firebase Auth** initialized. Same env-var pattern as original.

#### [NEW] `src/components/Header.js`

Top navigation bar:
- SWEHUB logo/title (left)
- Activity Log button (center/right)
- Login/Register or User name + Logout (right)

#### [NEW] `src/components/SemesterList.js`

Accordion list of 8 semesters (maps directly to the phase list in the original). Each semester card:
- Semester number badge (styled like phase number `P01`)
- Semester title: "1st Semester", "2nd Semester", etc.
- Course count indicator
- Expand/collapse with `+` icon rotation animation

#### [NEW] `src/components/CourseCard.js`

Displayed inside an expanded semester. Styled like the track cards in the original:
- Course code badge (like priority badge)
- Course name
- Credit hours
- "Open Materials" button → navigates to course materials page
- Delete button (auth only, with confirmation)

#### [NEW] `src/components/CourseMaterialsPage.js`

Full-page view for a single course's materials. Styled identically to `MaterialsPage` in the original, but with sections instead of PDF/Video/Course categories:

```
← BACK TO SEMESTERS
[Semester 3 badge] [CSE 4502 badge]
📚 CSE 4502 - Software Engineering
   COURSE MATERIALS

── 📖 Lecture (3) ──────────────
   [Material card 1]  [OPEN] [DELETE]
   [Material card 2]  [OPEN] [DELETE]

── 📚 Books (2) ────────────────
   [Material card 1]  [OPEN] [DELETE]

── 📝 Previous Year Questions (5) ──
   [Material card 1]  [OPEN] [DELETE]

── 📋 Notes (1) ────────────────
   [Material card 1]  [OPEN] [DELETE]

── 🔬 Lab Reports (custom) (0) ──
   No materials yet

── ➕ Add New Material ──────────
   [Select Section ▼] [Title] [Drive Link URL]  [ADD]

── ➕ Add Custom Section ────────
   [Section Name]  [CREATE]
```

#### [NEW] `src/components/AddCourseForm.js`

Modal/inline form for adding a new course to a semester:
- Course Name (text input)
- Course Code (text input, e.g., "CSE 4502")
- Credit Hours (number input)
- Submit creates the course with 4 default sections (empty)

#### [NEW] `src/components/LoginPage.js`

Login form matching the dark aesthetic:
- IUT Email input (validated against `@iut-dhaka.edu`)
- Password input (min 8 chars)
- "Don't have an account? Register" link
- Error messages for invalid credentials

#### [NEW] `src/components/RegisterPage.js`

Registration form:
- Full Name input
- IUT Roll Number input
- IUT Email input (validated: `*@iut-dhaka.edu`)
- Password input (min 8 characters, with confirmation)
- "Already have an account? Login" link

#### [NEW] `src/components/ActivityLogPage.js`

Scrollable log of all add/remove actions. Styled like a terminal/console output:

```
[2026-05-03 22:30] Md. Fahad Islam (210041126)
   ✚ Added course "CSE 4502 - Software Engineering" to Semester 4

[2026-05-03 22:28] Another User (210041130)
   ✖ Removed material "Lecture 3" from Notes → CSE 4501 → Semester 4

[2026-05-03 22:25] Md. Fahad Islam (210041126)
   ✚ Added material "Final 2024" to Previous Year Questions → CSE 4502 → Semester 4
```

Filters: by semester, by action type, by user. Paginated (newest first).

#### [NEW] `src/utils/helpers.js`

Shared utilities:
- `hexToRgb()` — extracted from original
- `validateIUTEmail()` — regex check for `@iut-dhaka.edu`
- `validateDriveLink()` — optional check for Google Drive URL format
- `getOrdinal()` — returns "1st", "2nd", "3rd", etc.
- `formatTimestamp()` — human-readable date formatting

#### [NEW] `src/styles.js`

Shared inline style objects (matching the original's pattern of inline styles):
- `cardStyle`, `buttonStyle`, `inputStyle`, `badgeStyle`, etc.
- Color constants for each semester
- Grid background and glow orb styles

---

### Configuration Files

#### [NEW] `package.json`

Dependencies (same as original + Firebase Auth):
- `react`, `react-dom`, `react-scripts`
- `firebase` (Firestore + Auth)
- `uuid`

#### [NEW] `.env.local`

```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

#### [NEW] `public/index.html`

With proper SEO meta tags for SWEHUB:
```html
<title>SWEHUB — IUT SWE Course Materials</title>
<meta name="description" content="Undergraduate SWE course material hub for IUT students. Lecture notes, books, previous year questions, and more." />
```

---

## Key Design Decisions

> [!IMPORTANT]
> **Drive links only** — There is NO file upload. All materials are Google Drive links. The add-material form only accepts a title + URL. We validate that the URL looks like a valid link (starts with `https://`).

> [!IMPORTANT]
> **8 fixed semesters** — Semesters cannot be added or removed. They are hardcoded. Only courses within semesters are dynamic.

> [!IMPORTANT]
> **Activity log is public** — Anyone (even visitors) can view the activity log to see who added or removed what. This provides transparency and accountability.

---

## Open Questions

> [!WARNING]
> **Should the project be created in a new directory** (e.g., `e:\skill\roadmap\swehub`) or inside the existing `cybersec-roadmap` directory? I'm assuming a **new directory** to keep them separate.

> [!NOTE]
> **Course code format** — Is there a specific format for IUT course codes (e.g., "CSE 4502", "EEE 4523")? Should we validate the format, or allow free-text?

> [!NOTE]
> **Do you want Firebase security rules included?** — I can generate Firestore security rules that restrict writes to authenticated `@iut-dhaka.edu` users while keeping reads public.

> [!NOTE]
> **Deployment** — Do you want this deployed to Vercel (like the original has `.vercel` config), or is local-only fine for now?

---

## Verification Plan

### Automated Tests
- Run `npm start` and verify the app compiles without errors
- Test all pages load correctly via browser inspection
- Verify authentication flow (register → login → add course → logout → verify read-only)

### Manual Verification
- Register a test account with `@iut-dhaka.edu` email
- Add a course to Semester 1 with all 4 default sections
- Add materials (Drive links) to each section
- Add a custom section
- Verify activity log records all actions
- Verify unauthenticated users can browse but not modify
- Test on mobile viewport for responsive layout
- Compare visual design side-by-side with the cybersec-roadmap to ensure consistent aesthetic
