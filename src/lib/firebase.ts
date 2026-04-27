import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, serverTimestamp, doc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Initialize anonymous auth for logging
signInAnonymously(auth).catch(err => {
  if (err.code === 'auth/admin-restricted-operation') {
    console.warn("Firebase Anonymous Auth is disabled. To enable it, go to your Firebase Console > Authentication > Sign-in method > Add new provider > Anonymous.");
  } else {
    console.error("Firebase Anonymous Auth Error:", err);
  }
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Utility to log analytics
export async function logQuery(intent: string, flow: string) {
  const id = `query_${Date.now()}`;
  const path = `analytics/queries/logs/${id}`;
  try {
    await setDoc(doc(db, path), {
      intent,
      flow,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Utility to submit feedback
export async function submitFeedback(rating: number, comment?: string) {
  const id = `fb_${Date.now()}`;
  const path = `feedback/${id}`;
  try {
    await setDoc(doc(db, path), {
      rating,
      comment: comment || null,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function followState(stateId: string) {
  if (!auth.currentUser) return;
  const path = `users/${auth.currentUser.uid}/following/${stateId}`;
  try {
    await setDoc(doc(db, path), {
      stateId,
      userId: auth.currentUser.uid,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function unfollowState(stateId: string) {
  if (!auth.currentUser) return;
  const path = `users/${auth.currentUser.uid}/following/${stateId}`;
  try {
    await deleteDoc(doc(db, path));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToFollowing(callback: (stateIds: string[]) => void) {
  let unsubSnapshot: (() => void) | null = null;
  
  const unsubAuth = onAuthStateChanged(auth, (user) => {
    if (unsubSnapshot) {
      unsubSnapshot();
      unsubSnapshot = null;
    }
    
    if (user) {
      const path = `users/${user.uid}/following`;
      unsubSnapshot = onSnapshot(collection(db, path), (snapshot) => {
        const ids = snapshot.docs.map(doc => doc.data().stateId);
        callback(ids);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      });
    } else {
      callback([]);
    }
  });

  return () => {
    unsubAuth();
    if (unsubSnapshot) unsubSnapshot();
  };
}

export async function pinStation(station: { id: string, name: string, address: string }) {
  if (!auth.currentUser) return;
  const path = `users/${auth.currentUser.uid}/pinnedStation/primary`;
  try {
    await setDoc(doc(db, path), {
      stationId: station.id,
      name: station.name,
      address: station.address,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function unpinStation() {
  if (!auth.currentUser) return;
  const path = `users/${auth.currentUser.uid}/pinnedStation/primary`;
  try {
    await deleteDoc(doc(db, path));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export interface PinnedStationData {
  stationId: string;
  name: string;
  address: string;
  timestamp: Date | string | null;
}

export function subscribeToPinnedStation(callback: (station: PinnedStationData | null) => void) {
  let unsubSnapshot: (() => void) | null = null;

  const unsubAuth = onAuthStateChanged(auth, (user) => {
    if (unsubSnapshot) {
      unsubSnapshot();
      unsubSnapshot = null;
    }

    if (user) {
      const path = `users/${user.uid}/pinnedStation/primary`;
      unsubSnapshot = onSnapshot(doc(db, path), (snapshot) => {
        callback(snapshot.exists() ? snapshot.data() as PinnedStationData : null);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      });
    } else {
      callback(null);
    }
  });

  return () => {
    unsubAuth();
    if (unsubSnapshot) unsubSnapshot();
  };
}

export async function updateChecklist(itemId: string, completed: boolean) {
  if (!auth.currentUser) return;
  const path = `users/${auth.currentUser.uid}/checklist/${itemId}`;
  try {
    await setDoc(doc(db, path), {
      itemId,
      completed,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToChecklist(callback: (items: Record<string, boolean>) => void) {
  let unsubSnapshot: (() => void) | null = null;

  const unsubAuth = onAuthStateChanged(auth, (user) => {
    if (unsubSnapshot) {
      unsubSnapshot();
      unsubSnapshot = null;
    }

    if (user) {
      const path = `users/${user.uid}/checklist`;
      unsubSnapshot = onSnapshot(collection(db, path), (snapshot) => {
        const items: Record<string, boolean> = {};
        snapshot.docs.forEach(doc => {
          items[doc.data().itemId] = doc.data().completed;
        });
        callback(items);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      });
    } else {
      callback({});
    }
  });

  return () => {
    unsubAuth();
    if (unsubSnapshot) unsubSnapshot();
  };
}
