import { useState, useEffect } from 'react';
import { 
  subscribeToFollowing, 
  subscribeToChecklist, 
  subscribeToPinnedStation, 
  updateChecklist,
  unpinStation as firebaseUnpin,
  followState as firebaseFollow,
  PinnedStationData
} from '../lib/firebase';
import { INDIA_ELECTION_DATA } from '../data/indiaElectionData';

export function useVoterData() {
  const [followedIds, setFollowedIds] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('voter_checklist');
    return saved ? JSON.parse(saved) : {};
  });
  const [pinnedStation, setPinnedStation] = useState<PinnedStationData | null>(() => {
    const saved = localStorage.getItem('voter_pinned_station');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubFollowing = subscribeToFollowing((ids) => {
      setFollowedIds(prev => ids.length > 0 ? ids : prev);
      if (!isLoaded) setIsLoaded(true);
    });
    
    const unsubChecklist = subscribeToChecklist((items) => {
      if (Object.keys(items).length > 0) {
        setChecklist(items);
        localStorage.setItem('voter_checklist', JSON.stringify(items));
      }
    });

    const unsubStation = subscribeToPinnedStation((station) => {
      if (station) {
        setPinnedStation(station);
        localStorage.setItem('voter_pinned_station', JSON.stringify(station));
      }
    });

    return () => {
      unsubFollowing();
      unsubChecklist();
      unsubStation();
    };
  }, [isLoaded]);

  const followedStates = followedIds
    .map(id => INDIA_ELECTION_DATA[id])
    .filter(Boolean);

  const toggleChecklist = async (itemId: string) => {
    const newVal = !checklist[itemId];
    const updated = { ...checklist, [itemId]: newVal };
    setChecklist(updated);
    localStorage.setItem('voter_checklist', JSON.stringify(updated));
    await updateChecklist(itemId, newVal).catch(() => {});
  };

  const unpinStation = async () => {
    setPinnedStation(null);
    localStorage.removeItem('voter_pinned_station');
    await firebaseUnpin().catch(() => {});
  };

  const followState = async (stateId: string) => {
    await firebaseFollow(stateId);
  };

  return {
    followedIds,
    followedStates,
    checklist,
    pinnedStation,
    isLoaded,
    toggleChecklist,
    unpinStation,
    followState
  };
}
