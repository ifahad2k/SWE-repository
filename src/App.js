import { useState, useEffect, useCallback } from "react";
import { db, auth } from "./firebase";
import { generateId } from "./utils/helpers";
import { hexToRgb } from "./utils/helpers";
import {
  SEMESTER_COLORS,
  DEFAULT_SECTIONS,
  pageBackground,
  gridOverlay,
  glowOrb1,
  glowOrb2,
  contentContainer,
} from "./styles";

// Components
import Header from "./components/Header";
import SemesterList from "./components/SemesterList";
import CourseMaterialsPage from "./components/CourseMaterialsPage";
import AddCourseForm from "./components/AddCourseForm";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ActivityLogPage from "./components/ActivityLogPage";

// ─── Firebase Firestore imports ─────────────────────────────────────────────
import {
  collection as fsCollection,
  doc as fsDoc,
  getDoc as fsGetDoc,
  setDoc as fsSetDoc,
  onSnapshot as fsOnSnapshot,
  serverTimestamp as fsServerTimestamp,
  addDoc as fsAddDoc,
  deleteField,
  arrayRemove,
  query,
  orderBy,
} from "firebase/firestore";

// ─── Firebase Auth imports ──────────────────────────────────────────────────
import {
  signInWithEmailAndPassword as fsSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as fsCreateUserWithEmailAndPassword,
  signOut as fsSignOut,
  onAuthStateChanged as fsOnAuthStateChanged,
  sendEmailVerification as fsSendEmailVerification,
  reload as fsReload,
} from "firebase/auth";

// Conditional assignment based on whether Firebase is initialized
const collection = db ? fsCollection : null;
const doc = db ? fsDoc : null;
const getDoc = db ? fsGetDoc : null;
const setDoc = db ? fsSetDoc : null;
const onSnapshot = db ? fsOnSnapshot : null;
const serverTimestamp = db ? fsServerTimestamp : null;
const addDoc = db ? fsAddDoc : null;

const signInWithEmailAndPassword = auth ? fsSignInWithEmailAndPassword : null;
const createUserWithEmailAndPassword = auth ? fsCreateUserWithEmailAndPassword : null;
const signOut = auth ? fsSignOut : null;
const onAuthStateChanged = auth ? fsOnAuthStateChanged : null;
const sendEmailVerification = auth ? fsSendEmailVerification : null;
const reload = auth ? fsReload : null;

// ─── Initial semester data ──────────────────────────────────────────────────
const createEmptySemesters = () =>
  Array.from({ length: 8 }, (_, i) => ({
    number: i + 1,
    courses: [],
  }));

const LOCAL_STORAGE_KEY = "swehub_semesters";
const LOCAL_LOG_KEY = "swehub_activity_log";
const LOCAL_USER_KEY = "swehub_user";

// ─── App Component ──────────────────────────────────────────────────────────
export default function App() {
  // Navigation state
  const [page, setPage] = useState("home");
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeSemester, setActiveSemester] = useState(null);

  // Data state
  const [semesters, setSemesters] = useState(createEmptySemesters());
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth state
  const [user, setUser] = useState(null);

  // Add course form
  const [addCourseForSemester, setAddCourseForSemester] = useState(null);

  // ─── Stats ──────────────────────────────────────────────────────────
  const totalCourses = semesters.reduce((t, s) => t + (s.courses?.length || 0), 0);
  const totalMaterials = semesters.reduce(
    (t, s) =>
      t +
      (s.courses || []).reduce(
        (ct, c) =>
          ct + (c.sections || []).reduce((mt, sec) => mt + (sec.materials?.length || 0), 0),
        0
      ),
    0
  );

  // ─── Load data ────────────────────────────────────────────────────
  useEffect(() => {
    if (db) {
      console.log("[Firestore] Setting up real-time listeners for all users");
      // Firestore real-time listener for semesters (PUBLIC READ)
      const unsubscribers = [];
      
      for (let i = 1; i <= 8; i++) {
        const docRef = doc(db, "semesters", `semester_${i}`);
        const unsub = onSnapshot(
          docRef,
          (snap) => {
            const data = snap.data();
            console.log(`[Firestore] Semester ${i} snapshot received:`, data);
            setSemesters((prev) => {
              const next = [...prev];
              next[i - 1] = { number: i, courses: data?.courses || [] };
              return next;
            });
          },
          (error) => {
            console.error(`[Firestore] Error listening to semester_${i}:`, error);
          }
        );
        unsubscribers.push(unsub);
      }

      // Activity log listener (AUTH ONLY - will fail for unauthenticated)
      if (user) {
        const logUnsub = onSnapshot(
          collection(db, "activity_log"),
          (snap) => {
            const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            console.log("[Firestore] Activity logs snapshot received:", logs.length, "logs");
            setActivityLogs(logs);
          },
          (error) => {
            console.error("[Firestore] Error listening to activity_log:", error);
          }
        );
        unsubscribers.push(logUnsub);
      }

      setLoading(false);
      return () => {
        console.log("[Firestore] Cleaning up listeners");
        unsubscribers.forEach((u) => u());
      };
    } else {
      console.warn("[Firestore] DB not initialized, using localStorage fallback");
      // LocalStorage fallback only if no Firebase
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          setSemesters(JSON.parse(saved));
        }
        const savedLogs = localStorage.getItem(LOCAL_LOG_KEY);
        if (savedLogs) {
          setActivityLogs(JSON.parse(savedLogs));
        }
      } catch (e) {
        console.error("Failed to load from localStorage:", e);
      }
      setLoading(false);
    }
  }, [db, user]);

  // ─── Auth listener (Firebase) ─────────────────────────────────────
  useEffect(() => {
    if (auth && onAuthStateChanged) {
      const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Get user profile from Firestore
          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
              setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() });
            } else {
              setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
            }
          } catch {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
          }
        } else {
          setUser(null);
        }
      });
      return unsub;
    }
  }, []);

  // ─── Save to localStorage (fallback mode) ─────────────────────────
  const saveToLocal = useCallback(
    (updatedSemesters, updatedLogs) => {
      if (!db) {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSemesters || semesters));
          localStorage.setItem(LOCAL_LOG_KEY, JSON.stringify(updatedLogs || activityLogs));
        } catch (e) {
          console.error("Failed to save to localStorage:", e);
        }
      }
    },
    [semesters, activityLogs]
  );

  // ─── Activity log helper ──────────────────────────────────────────
  const addLogEntry = useCallback(
    async (action, details, semesterNumber, courseName, metadata = {}) => {
      const entry = {
        action,
        details,
        userId: user?.email || "unknown",
        userName: user?.name || user?.email || "Unknown",
        userRoll: user?.roll || "",
        semesterNumber,
        courseName: courseName || "",
        timestamp: db ? serverTimestamp() : new Date().toISOString(),
        metadata,
      };

      if (db) {
        try {
          await addDoc(collection(db, "activity_log"), entry);
        } catch (e) {
          console.error("Failed to add log entry:", e);
        }
      } else {
        const newLogs = [{ id: generateId(), ...entry }, ...activityLogs];
        setActivityLogs(newLogs);
        return newLogs;
      }
      return null;
    },
    [user, activityLogs]
  );

  // ─── Save semester to Firestore ───────────────────────────────────
  const saveSemester = useCallback(
    async (semesterNumber, courses) => {
      if (db) {
        try {
          console.log(`[Firestore] Saving semester ${semesterNumber}:`, { number: semesterNumber, courses });
          await setDoc(doc(db, "semesters", `semester_${semesterNumber}`), { number: semesterNumber, courses });
          console.log(`[Firestore] Semester ${semesterNumber} saved successfully`);
        } catch (e) {
          console.error(`[Firestore] Failed to save semester ${semesterNumber}:`, e);
        }
      } else {
        console.warn("[Firestore] DB not available, cannot save semester");
      }
    },
    []
  );

  // ─── Add Course ───────────────────────────────────────────────────
  const handleAddCourse = useCallback(
    async (semesterNumber, courseData) => {
      const newCourse = {
        id: generateId(),
        name: courseData.name,
        code: courseData.code,
        credit: courseData.credit,
        addedBy: user?.email || "local",
        addedAt: new Date().toISOString(),
        sections: DEFAULT_SECTIONS.map((name) => ({
          id: generateId(),
          name,
          type: "default",
          materials: [],
        })),
      };

      const newSemesters = semesters.map((s) => {
        if (s.number === semesterNumber) {
          return { ...s, courses: [...(s.courses || []), newCourse] };
        }
        return s;
      });
      setSemesters(newSemesters);

      const updatedSemester = newSemesters.find((s) => s.number === semesterNumber);
      await saveSemester(semesterNumber, updatedSemester.courses);

      const newLogs = await addLogEntry(
        "ADD_COURSE",
        `Added course "${courseData.name}" to Semester ${semesterNumber}`,
        semesterNumber,
        courseData.name
      );
      saveToLocal(newSemesters, newLogs);
      setAddCourseForSemester(null);
    },
    [semesters, user, saveSemester, addLogEntry, saveToLocal]
  );

  // ─── Delete Course ────────────────────────────────────────────────
  const handleDeleteCourse = useCallback(
    async (semesterNumber, courseId, courseName) => {
      const newSemesters = semesters.map((s) => {
        if (s.number === semesterNumber) {
          return { ...s, courses: (s.courses || []).filter((c) => c.id !== courseId) };
        }
        return s;
      });
      setSemesters(newSemesters);

      const updatedSemester = newSemesters.find((s) => s.number === semesterNumber);
      await saveSemester(semesterNumber, updatedSemester.courses);

      const newLogs = await addLogEntry(
        "REMOVE_COURSE",
        `Removed course "${courseName}" from Semester ${semesterNumber}`,
        semesterNumber,
        courseName
      );
      saveToLocal(newSemesters, newLogs);

      // If we're viewing this course, go back
      if (activeCourse?.id === courseId) {
        setPage("home");
        setActiveCourse(null);
        setActiveSemester(null);
      }
    },
    [semesters, saveSemester, addLogEntry, saveToLocal, activeCourse]
  );

  // ─── Open Course Materials ────────────────────────────────────────
  const handleOpenCourse = useCallback((course, semester) => {
    setActiveCourse(course);
    setActiveSemester(semester);
    setPage("course");
  }, []);

  // ─── Add Material ─────────────────────────────────────────────────
  const handleAddMaterial = useCallback(
    async (sectionId, materialData) => {
      if (!activeCourse || !activeSemester) return;

      const newMaterial = {
        ...materialData,
        addedBy: user?.email || "local",
        addedAt: new Date().toISOString(),
      };

      const newSemesters = semesters.map((s) => {
        if (s.number === activeSemester.number) {
          return {
            ...s,
            courses: (s.courses || []).map((c) => {
              if (c.id === activeCourse.id) {
                return {
                  ...c,
                  sections: (c.sections || []).map((sec) => {
                    if (sec.id === sectionId) {
                      return { ...sec, materials: [...(sec.materials || []), newMaterial] };
                    }
                    return sec;
                  }),
                };
              }
              return c;
            }),
          };
        }
        return s;
      });
      setSemesters(newSemesters);

      // Update active course reference
      const updatedSemester = newSemesters.find((s) => s.number === activeSemester.number);
      const updatedCourse = updatedSemester.courses.find((c) => c.id === activeCourse.id);
      setActiveCourse(updatedCourse);
      setActiveSemester(updatedSemester);

      await saveSemester(activeSemester.number, updatedSemester.courses);

      const sectionName = (activeCourse.sections || []).find((s) => s.id === sectionId)?.name || "Unknown";
      const newLogs = await addLogEntry(
        "ADD_MATERIAL",
        `Added material "${materialData.title}" to ${sectionName} → ${activeCourse.name} → Semester ${activeSemester.number}`,
        activeSemester.number,
        activeCourse.name
      );
      saveToLocal(newSemesters, newLogs);
    },
    [semesters, activeCourse, activeSemester, user, saveSemester, addLogEntry, saveToLocal]
  );

  // ─── Delete Material ──────────────────────────────────────────────
  const handleDeleteMaterial = useCallback(
    async (sectionId, materialId) => {
      if (!activeCourse || !activeSemester) return;

      let deletedTitle = "";
      let sectionName = "";

      const newSemesters = semesters.map((s) => {
        if (s.number === activeSemester.number) {
          return {
            ...s,
            courses: (s.courses || []).map((c) => {
              if (c.id === activeCourse.id) {
                return {
                  ...c,
                  sections: (c.sections || []).map((sec) => {
                    if (sec.id === sectionId) {
                      sectionName = sec.name;
                      const mat = (sec.materials || []).find((m) => m.id === materialId);
                      if (mat) deletedTitle = mat.title;
                      return { ...sec, materials: (sec.materials || []).filter((m) => m.id !== materialId) };
                    }
                    return sec;
                  }),
                };
              }
              return c;
            }),
          };
        }
        return s;
      });
      setSemesters(newSemesters);

      const updatedSemester = newSemesters.find((s) => s.number === activeSemester.number);
      const updatedCourse = updatedSemester.courses.find((c) => c.id === activeCourse.id);
      setActiveCourse(updatedCourse);
      setActiveSemester(updatedSemester);

      await saveSemester(activeSemester.number, updatedSemester.courses);

      const newLogs = await addLogEntry(
        "REMOVE_MATERIAL",
        `Removed material "${deletedTitle}" from ${sectionName} → ${activeCourse.name} → Semester ${activeSemester.number}`,
        activeSemester.number,
        activeCourse.name
      );
      saveToLocal(newSemesters, newLogs);
    },
    [semesters, activeCourse, activeSemester, saveSemester, addLogEntry, saveToLocal]
  );

  // ─── Add Section ──────────────────────────────────────────────────
  const handleAddSection = useCallback(
    async (sectionData) => {
      if (!activeCourse || !activeSemester) return;

      const newSemesters = semesters.map((s) => {
        if (s.number === activeSemester.number) {
          return {
            ...s,
            courses: (s.courses || []).map((c) => {
              if (c.id === activeCourse.id) {
                return { ...c, sections: [...(c.sections || []), sectionData] };
              }
              return c;
            }),
          };
        }
        return s;
      });
      setSemesters(newSemesters);

      const updatedSemester = newSemesters.find((s) => s.number === activeSemester.number);
      const updatedCourse = updatedSemester.courses.find((c) => c.id === activeCourse.id);
      setActiveCourse(updatedCourse);
      setActiveSemester(updatedSemester);

      await saveSemester(activeSemester.number, updatedSemester.courses);

      const newLogs = await addLogEntry(
        "ADD_SECTION",
        `Added section "${sectionData.name}" to ${activeCourse.name} → Semester ${activeSemester.number}`,
        activeSemester.number,
        activeCourse.name
      );
      saveToLocal(newSemesters, newLogs);
    },
    [semesters, activeCourse, activeSemester, saveSemester, addLogEntry, saveToLocal]
  );

  // ─── Delete Section ───────────────────────────────────────────────
  const handleDeleteSection = useCallback(
    async (sectionId) => {
      if (!activeCourse || !activeSemester) return;

      let deletedName = "";

      const newSemesters = semesters.map((s) => {
        if (s.number === activeSemester.number) {
          return {
            ...s,
            courses: (s.courses || []).map((c) => {
              if (c.id === activeCourse.id) {
                const sec = (c.sections || []).find((s) => s.id === sectionId);
                if (sec) deletedName = sec.name;
                return {
                  ...c,
                  sections: (c.sections || []).filter((s) => s.id !== sectionId),
                };
              }
              return c;
            }),
          };
        }
        return s;
      });
      setSemesters(newSemesters);

      const updatedSemester = newSemesters.find((s) => s.number === activeSemester.number);
      const updatedCourse = updatedSemester.courses.find((c) => c.id === activeCourse.id);
      setActiveCourse(updatedCourse);
      setActiveSemester(updatedSemester);

      await saveSemester(activeSemester.number, updatedSemester.courses);

      const newLogs = await addLogEntry(
        "REMOVE_SECTION",
        `Removed section "${deletedName}" from ${activeCourse.name} → Semester ${activeSemester.number}`,
        activeSemester.number,
        activeCourse.name
      );
      saveToLocal(newSemesters, newLogs);
    },
    [semesters, activeCourse, activeSemester, saveSemester, addLogEntry, saveToLocal]
  );

  // ─── Auth handlers ────────────────────────────────────────────────
  const handleLogin = useCallback(
    async (email, password) => {
      if (auth && signInWithEmailAndPassword) {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        
        // Reload user to get latest verification status
        if (reload) {
          await reload(cred.user);
        }
        
        // Check if email is verified
        if (!cred.user.emailVerified) {
          // Sign them out since they're not verified
          if (signOut) {
            await signOut(auth);
          }
          throw new Error("❌ Email not verified. Please check your inbox for the verification link and click it before logging in.");
        }
        
        // Create profile on first verified login
        try {
          const userDocRef = doc(db, "users", cred.user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            // Extract name and roll from email or use defaults (since we don't have them on login)
            await setDoc(userDocRef, {
              name: cred.user.email.split('@')[0] || "User",
              roll: "N/A",
              email: cred.user.email,
              createdAt: serverTimestamp(),
            });
          }
        } catch (err) {
          console.error("[Auth] Failed to create user profile:", err);
        }
        
        setPage("home");
      } else {
        // Local fallback: simulate login
        const savedUser = localStorage.getItem(LOCAL_USER_KEY);
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed.email === email) {
            setUser(parsed);
            setPage("home");
            return;
          }
        }
        throw new Error("No local account found. Please register first.");
      }
    },
    []
  );

  const handleRegister = useCallback(
    async (name, roll, email, password) => {
      if (auth && createUserWithEmailAndPassword) {
        // Validate IUT email before creating account
        if (!email.endsWith('@iut-dhaka.edu')) {
          throw new Error('Only IUT emails (@iut-dhaka.edu) are allowed to register.');
        }
        
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        
        // Send email verification
        if (sendEmailVerification) {
          try {
            await sendEmailVerification(cred.user);
            console.log("[Auth] Verification email sent to", email);
          } catch (err) {
            console.error("[Auth] Failed to send verification email:", err);
          }
        }
        
        // Sign them out so they can only access after verification
        if (signOut) {
          await signOut(auth);
        }
        
        // Redirect to login with message
        alert("✓ Account created!\n\nA verification link has been sent to your email. Please click it to verify your account, then log in.");
        setPage("login");
      } else {
        // Local fallback
        const localUser = { name, roll, email, uid: generateId() };
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
        setUser(localUser);
        setPage("home");
      }
    },
    []
  );

  const handleLogout = useCallback(async () => {
    if (auth && signOut) {
      await signOut(auth);
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
    setUser(null);
  }, []);

  // ─── Render ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        ...pageBackground,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>📂</div>
          <div style={{
            fontSize: "12px",
            color: "#00ff88",
            letterSpacing: "4px",
            textTransform: "uppercase",
            animation: "pulse 1.5s ease-in-out infinite",
          }}>
            LOADING SWE REPOSITORY...
          </div>
        </div>
      </div>
    );
  }

  // Course materials page
  if (page === "course" && activeCourse && activeSemester) {
    const semesterColor = SEMESTER_COLORS[activeSemester.number - 1] || "#00ff88";
    return (
      <CourseMaterialsPage
        course={activeCourse}
        semester={activeSemester}
        semesterColor={semesterColor}
        user={user}
        onBack={() => { setPage("home"); setActiveCourse(null); setActiveSemester(null); }}
        onAddMaterial={handleAddMaterial}
        onDeleteMaterial={handleDeleteMaterial}
        onAddSection={handleAddSection}
        onDeleteSection={handleDeleteSection}
      />
    );
  }

  // Wrap common pages with the dark background shell
  return (
    <div style={pageBackground}>
      {/* Grid overlay */}
      <div style={gridOverlay} />
      {/* Glow orbs */}
      <div style={glowOrb1} />
      <div style={glowOrb2} />

      <div style={contentContainer}>
        <Header
          user={user}
          onLoginClick={() => setPage("login")}
          onRegisterClick={() => setPage("register")}
          onLogout={handleLogout}
          onActivityLogClick={() => setPage("activityLog")}
          onHomeClick={() => { setPage("home"); setActiveCourse(null); setActiveSemester(null); }}
        />

        {/* ─── LOGIN PAGE ─────────────────────────────────────────── */}
        {page === "login" && (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToRegister={() => setPage("register")}
            onBack={() => setPage("home")}
          />
        )}

        {/* ─── REGISTER PAGE ─────────────────────────────────────── */}
        {page === "register" && (
          <RegisterPage
            onRegister={handleRegister}
            onSwitchToLogin={() => setPage("login")}
            onBack={() => setPage("home")}
          />
        )}

        {/* ─── ACTIVITY LOG PAGE ─────────────────────────────────── */}
        {page === "activityLog" && (
          <ActivityLogPage
            logs={activityLogs}
            onBack={() => setPage("home")}
          />
        )}

        {/* ─── HOME PAGE ─────────────────────────────────────────── */}
        {page === "home" && (
          <>
            {/* Hero Section */}
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <div style={{
                fontSize: "11px",
                letterSpacing: "6px",
                color: "#00ff88",
                marginBottom: "16px",
                textTransform: "uppercase",
              }}>
                [ IUT Software Engineering ]
              </div>
              <h1 style={{
                fontSize: "42px",
                fontWeight: "900",
                color: "#ffffff",
                margin: "0 0 8px 0",
                letterSpacing: "-1px",
              }}>
                SWE <span style={{ color: "#00ff88" }}>REPOSITORY</span>
              </h1>
              <p style={{
                fontSize: "13px",
                color: "#667788",
                margin: "0 0 28px 0",
                lineHeight: 1.6,
              }}>
                Centralized course materials for IUT undergraduate Software Engineering students.
                <br />Lecture notes, books, previous year questions, and more.
              </p>

              {/* Stats bar */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "24px",
                flexWrap: "wrap",
              }}>
                {[
                  { label: "SEMESTERS", value: 8, color: "#00ff88" },
                  { label: "COURSES", value: totalCourses, color: "#00ccff" },
                  { label: "MATERIALS", value: totalMaterials, color: "#ff8800" },
                  { label: "CONTRIBUTORS", value: new Set(activityLogs.map((l) => l.userId)).size || 0, color: "#cc00ff" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      padding: "12px 20px",
                      border: `1px solid rgba(${hexToRgb(stat.color)}, 0.2)`,
                      borderRadius: "3px",
                      background: `rgba(${hexToRgb(stat.color)}, 0.05)`,
                      minWidth: "100px",
                    }}
                  >
                    <div style={{ fontSize: "24px", fontWeight: "900", color: stat.color }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#556677", marginTop: "2px" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Semester List */}
            <SemesterList
              semesters={semesters}
              user={user}
              onOpenCourse={handleOpenCourse}
              onDeleteCourse={handleDeleteCourse}
              onShowAddCourseForm={(semNum) => setAddCourseForSemester(semNum)}
            />
          </>
        )}
      </div>

      {/* Add Course Modal */}
      {addCourseForSemester && (
        <AddCourseForm
          semesterNumber={addCourseForSemester}
          semesterColor={SEMESTER_COLORS[addCourseForSemester - 1] || "#00ff88"}
          onSubmit={(courseData) => handleAddCourse(addCourseForSemester, courseData)}
          onCancel={() => setAddCourseForSemester(null)}
        />
      )}

      {/* Footer - Created by credit */}
      <div style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        fontSize: "11px",
        color: "#667788",
        textAlign: "right",
        lineHeight: "1.6",
        fontFamily: "inherit",
      }}>
        <div style={{ marginBottom: "4px" }}>
          Created by{" "}
          <a 
            href="https://www.facebook.com/mdfahadrahman2k.22" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: "#00ff88",
              textDecoration: "none",
              fontWeight: "700",
              transition: "all 0.2s",
              borderBottom: "1px solid rgba(0,255,136,0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#00ccff";
              e.target.style.borderBottomColor = "rgba(0,204,255,0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#00ff88";
              e.target.style.borderBottomColor = "rgba(0,255,136,0.3)";
            }}
          >
            iFahad2k
          </a>
        </div>
        <div style={{ fontSize: "9px", color: "#556677" }}>
          Tool used: <span style={{ color: "#00ff88" }}>Claude Code</span>
        </div>
      </div>
    </div>
  );
}
