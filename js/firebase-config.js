// Firebase SDK Configuration & Graceful Mock Fallback
// If you have a real Firebase project, fill in your credentials below:
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

export let auth = null;
export let db = null;
export let isFirebaseMock = true;

// Custom Event Dispatcher for auth state changes
const authStateCallbacks = [];
const dbListeners = {};

// Mock Services definitions
export const mockAuth = {
  currentUser: null,
  onAuthStateChanged(callback) {
    authStateCallbacks.push(callback);
    // Trigger immediately with initial state
    const savedUser = localStorage.getItem("truthlens_user");
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    } else {
      this.currentUser = null;
    }
    callback(this.currentUser);
    return () => {
      const idx = authStateCallbacks.indexOf(callback);
      if (idx > -1) authStateCallbacks.splice(idx, 1);
    };
  },
  signInWithEmail(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple mock validation
        if (password.length < 6) {
          reject(new Error("Password must be at least 6 characters."));
          return;
        }
        const user = {
          uid: "mock-uid-" + Math.floor(Math.random() * 100000),
          email: email,
          displayName: email.split("@")[0],
          photoURL: null,
          points: 450,
          level: "Expert Fact Checker",
          badges: ["truth_beginner", "fact_checker"]
        };
        this.currentUser = user;
        localStorage.setItem("truthlens_user", JSON.stringify(user));
        authStateCallbacks.forEach(cb => cb(user));
        resolve({ user });
      }, 500);
    });
  },
  signUpWithEmail(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password.length < 6) {
          reject(new Error("Password must be at least 6 characters."));
          return;
        }
        const user = {
          uid: "mock-uid-" + Math.floor(Math.random() * 100000),
          email: email,
          displayName: email.split("@")[0],
          photoURL: null,
          points: 100,
          level: "Novice Fact Checker",
          badges: ["truth_beginner"]
        };
        this.currentUser = user;
        localStorage.setItem("truthlens_user", JSON.stringify(user));
        authStateCallbacks.forEach(cb => cb(user));
        resolve({ user });
      }, 500);
    });
  },
  signInWithGoogle() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          uid: "mock-google-uid-12345",
          email: "dipti.firke@gmail.com",
          displayName: "Dipti",
          photoURL: null,
          points: 450,
          level: "Expert Fact Checker",
          badges: ["truth_beginner", "fact_checker"]
        };
        this.currentUser = user;
        localStorage.setItem("truthlens_user", JSON.stringify(user));
        authStateCallbacks.forEach(cb => cb(user));
        resolve({ user });
      }, 600);
    });
  },
  signOut() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = null;
        localStorage.removeItem("truthlens_user");
        authStateCallbacks.forEach(cb => cb(null));
        resolve();
      }, 300);
    });
  }
};

export const mockDb = {
  // In-memory / localStorage database collections
  getData(collectionName) {
    const data = localStorage.getItem(`truthlens_db_${collectionName}`);
    return data ? JSON.parse(data) : [];
  },
  saveData(collectionName, items) {
    localStorage.setItem(`truthlens_db_${collectionName}`, JSON.stringify(items));
    // Trigger listeners
    if (dbListeners[collectionName]) {
      dbListeners[collectionName].forEach(cb => cb(items));
    }
  },
  collection(name) {
    return {
      name,
      get: () => {
        return Promise.resolve({
          docs: this.mockDb.getData(name).map(doc => ({
            id: doc.id,
            data: () => doc
          }))
        });
      },
      add: (docData) => {
        const items = this.mockDb.getData(name);
        const newDoc = { id: "doc-" + Math.floor(Math.random() * 100000), ...docData, createdAt: new Date().toISOString() };
        items.push(newDoc);
        this.mockDb.saveData(name, items);
        return Promise.resolve({ id: newDoc.id });
      },
      doc: (docId) => {
        return {
          update: (updateFields) => {
            const items = this.mockDb.getData(name);
            const index = items.findIndex(i => i.id === docId);
            if (index > -1) {
              items[index] = { ...items[index], ...updateFields };
              this.mockDb.saveData(name, items);
            }
            return Promise.resolve();
          },
          delete: () => {
            let items = this.mockDb.getData(name);
            items = items.filter(i => i.id !== docId);
            this.mockDb.saveData(name, items);
            return Promise.resolve();
          }
        };
      },
      onSnapshot: (callback) => {
        if (!dbListeners[name]) {
          dbListeners[name] = [];
        }
        dbListeners[name].push(callback);
        // Call immediately with current data
        callback({
          docs: this.mockDb.getData(name).map(doc => ({
            id: doc.id,
            data: () => doc
          }))
        });
        // Return unsubscribe
        return () => {
          dbListeners[name] = dbListeners[name].filter(cb => cb !== callback);
        };
      }
    };
  }
};

// Check if credentials are set
const hasConfig = firebaseConfig.apiKey && firebaseConfig.apiKey !== "";

if (hasConfig) {
  try {
    // Dynamic import to avoid loading heavy SDKs if they aren't configured
    // We use standard ES module CDN scripts
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
    const { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
    const { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    
    const app = initializeApp(firebaseConfig);
    const liveAuth = getAuth(app);
    const liveDb = getFirestore(app);

    auth = {
      currentUser: liveAuth.currentUser,
      onAuthStateChanged: (callback) => liveAuth.onAuthStateChanged(callback),
      signInWithEmail: (email, password) => signInWithEmailAndPassword(liveAuth, email, password),
      signUpWithEmail: (email, password) => createUserWithEmailAndPassword(liveAuth, email, password),
      signInWithGoogle: () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(liveAuth, provider);
      },
      signOut: () => signOut(liveAuth)
    };

    db = {
      collection: (name) => {
        return {
          get: () => getDocs(collection(liveDb, name)),
          add: (docData) => addDoc(collection(liveDb, name), docData),
          doc: (docId) => ({
            update: (updateFields) => updateDoc(doc(liveDb, name, docId), updateFields),
            delete: () => deleteDoc(doc(liveDb, name, docId))
          }),
          onSnapshot: (callback) => onSnapshot(collection(liveDb, name), callback)
        };
      }
    };
    isFirebaseMock = false;
    console.log("TruthLens: Firebase initialized successfully.");
  } catch (err) {
    console.warn("TruthLens: Firebase initialization failed. Falling back to mockup storage.", err);
    auth = mockAuth;
    db = mockDb;
    isFirebaseMock = true;
  }
} else {
  // Use mock framework
  auth = mockAuth;
  db = mockDb;
  isFirebaseMock = true;
  console.log("TruthLens: Running in mock database storage mode. (No API Keys provided).");
}
