import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FirebaseService, logUserInteraction, getAggregatedTrends } from './firebaseService';
import { auth, db, handleFirestoreError } from '../lib/firebase';
import { addDoc, collection, onSnapshot, getDocs, query } from 'firebase/firestore';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn(),
  getDocs: vi.fn(),
  serverTimestamp: vi.fn(() => 'test-timestamp')
}));

vi.mock('../lib/firebase', () => ({
  auth: { currentUser: null, onAuthStateChanged: vi.fn() },
  db: {},
  handleFirestoreError: vi.fn(),
  OperationType: { WRITE: 'write', GET: 'get' }
}));

describe('firebaseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('logUserInteraction', () => {
    it('returns early if no user', async () => {
      auth.currentUser = null;
      await logUserInteraction('test');
      expect(addDoc).not.toHaveBeenCalled();
    });

    it('logs interaction when user is logged in', async () => {
      auth.currentUser = { uid: 'user123' } as any;
      (addDoc as any).mockResolvedValueOnce({});
      
      await logUserInteraction('test_type', { foo: 'bar' });
      
      expect(addDoc).toHaveBeenCalled();
      const payload = (addDoc as any).mock.calls[0][1];
      expect(payload).toMatchObject({
        type: 'test_type',
        userId: 'user123',
        metadata: { foo: 'bar' }
      });
    });

    it('throws validation error if missing type', async () => {
      auth.currentUser = { uid: 'user123' } as any;
      await logUserInteraction('', {});
      expect(handleFirestoreError).toHaveBeenCalled();
    });

    it('throws validation error if missing userId', async () => {
      auth.currentUser = { uid: '' } as any;
      await logUserInteraction('test', {});
      expect(handleFirestoreError).toHaveBeenCalled();
    });
    
    it('handles firestore addDoc error', async () => {
      auth.currentUser = { uid: 'user123' } as any;
      (addDoc as any).mockRejectedValueOnce(new Error('firestore err'));
      await logUserInteraction('test', {});
      expect(handleFirestoreError).toHaveBeenCalled();
    });
  });

  describe('getAggregatedTrends', () => {
    it('cleans up unsubSnapshot if user logs out', () => {
      let authCallback: any;
      (auth.onAuthStateChanged as any).mockImplementationOnce((cb: any) => {
        authCallback = cb;
        return () => {};
      });

      const mockUnsubSnapshot = vi.fn();
      (onSnapshot as any).mockImplementation((q: any, onSuccess: any) => {
        return mockUnsubSnapshot;
      });

      const cb = vi.fn();
      getAggregatedTrends(cb);
      
      // Simulate login
      authCallback({ uid: 'user123' });
      // Simulate logout
      authCallback(null);
      
      expect(mockUnsubSnapshot).toHaveBeenCalled();
    });

    it('returns empty when no user', () => {
      (auth.onAuthStateChanged as any).mockImplementationOnce((cb: any) => {
        cb(null);
        return () => {};
      });
      const cb = vi.fn();
      getAggregatedTrends(cb);
      expect(cb).toHaveBeenCalledWith({});
    });

    it('fetches trends when user is logged in', () => {
      (auth.onAuthStateChanged as any).mockImplementationOnce((cb: any) => {
        cb({ uid: 'user123' });
        return () => {}; // return unsubAuth
      });

      (onSnapshot as any).mockImplementationOnce((q: any, onSuccess: any) => {
        onSuccess({
          docs: [
            { data: () => ({ metadata: { stateId: 'MH' } }) },
            { data: () => ({ metadata: { stateId: 'MH' } }) },
            { data: () => ({ metadata: { stateId: 'KA' } }) }
          ]
        });
        return vi.fn(); // return unsubSnapshot
      });

      const cb = vi.fn();
      const unsub = getAggregatedTrends(cb);
      
      expect(cb).toHaveBeenCalledWith({ 'MH': 2, 'KA': 1 });
      unsub();
    });
    
    it('handles snapshot error', () => {
      (auth.onAuthStateChanged as any).mockImplementationOnce((cb: any) => {
        cb({ uid: 'user123' });
        return () => {};
      });

      (onSnapshot as any).mockImplementationOnce((q: any, onSuccess: any, onError: any) => {
        onError(new Error('snapshot err'));
        return vi.fn();
      });

      const cb = vi.fn();
      getAggregatedTrends(cb);
      expect(handleFirestoreError).toHaveBeenCalled();
    });
  });
  
  describe('getUserProfile', () => {
    it('returns user data if found', async () => {
      (getDocs as any).mockResolvedValueOnce({
        docs: [
          { data: () => ({ name: 'John Doe' }) }
        ]
      });
      
      const profile = await FirebaseService.getUserProfile('user123');
      expect(profile).toEqual({ name: 'John Doe' });
    });
    
    it('returns undefined if not found', async () => {
      (getDocs as any).mockResolvedValueOnce({
        docs: []
      });
      
      const profile = await FirebaseService.getUserProfile('user123');
      expect(profile).toBeUndefined();
    });
  });
});
