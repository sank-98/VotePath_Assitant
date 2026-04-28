import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, handleFirestoreError } from '../lib/firebase';
import { OperationType } from '../lib/firebase';

/**
 * PRODUCTION-GRADE FIREBASE DATA LAYER
 * 
 * Manages all persistent storage and real-time syncing for regional trends.
 */
class SelectionValidator {
  /**
   * Validates interaction payload before transmission to Firestore.
   * @param data - The raw user interaction object
   * @throws {Error} If payload fails domain-specific validation rules
   */
  static validateInteraction(data: { type: string; userId: string; [key: string]: unknown }): boolean {
    if (!data.type || typeof data.type !== 'string') throw new Error('Interaction type is required');
    if (!data.userId) throw new Error('User context required for persistence');
    return true;
  }
}

export const logUserInteraction = async (type: string, metadata: Record<string, unknown> = {}) => {
  if (!auth.currentUser) return;

  const payload = {
    userId: auth.currentUser.uid,
    type,
    metadata,
    timestamp: serverTimestamp(),
  };

  const path = `interactions`;
  try {
    SelectionValidator.validateInteraction(payload);
    await addDoc(collection(db, path), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getAggregatedTrends = (callback: (trends: Record<string, number>) => void) => {
  const path = 'interactions';
  
  // Return an unsubscriber that handles both auth and snapshot
  let unsubSnapshot: (() => void) | null = null;
  
  const unsubAuth = auth.onAuthStateChanged((user) => {
    if (unsubSnapshot) {
      unsubSnapshot();
      unsubSnapshot = null;
    }
    
    if (user) {
      const q = query(
        collection(db, path), 
        orderBy('timestamp', 'desc'),
        where('type', '==', 'follow_state') 
      );

      unsubSnapshot = onSnapshot(q, (snapshot) => {
        const counts: Record<string, number> = {};
        snapshot.docs.forEach(doc => {
          const stateId = (doc.data() as { metadata?: { stateId?: string } }).metadata?.stateId;
          if (stateId) counts[stateId] = (counts[stateId] || 0) + 1;
        });
        callback(counts);
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
};

/**
 * CLEAN INTERFACE FOR DATA SERVICES
 */
export const FirebaseService = {
  logInteraction: logUserInteraction,
  getTrends: getAggregatedTrends,
  // Helper to safely fetch user data
  getUserProfile: async (userId: string) => {
    const snap = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
    return snap.docs[0]?.data();
  }
};
