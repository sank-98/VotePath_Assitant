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
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [pinnedStation, setPinnedStation] = useState<PinnedStationData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubFollowing = subscribeToFollowing((ids) => {
      setFollowedIds(ids);
      if (!isLoaded) setIsLoaded(true);
    });
    const unsubChecklist = subscribeToChecklist(setChecklist);
    const unsubStation = subscribeToPinnedStation(setPinnedStation);

    return () => {
      unsubFollowing();
      unsubChecklist();
      unsubStation();
    };
  }, []);

  const followedStates = followedIds
    .map(id => INDIA_ELECTION_DATA[id])
    .filter(Boolean);

  const toggleChecklist = async (itemId: string) => {
    await updateChecklist(itemId, !checklist[itemId]);
  };

  const unpinStation = async () => {
    await firebaseUnpin();
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
