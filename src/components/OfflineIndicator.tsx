'use client';

import { useEffect, useState } from 'react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncPending, setSyncPending] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Check if there are pending sync operations
      checkSyncPending();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkSyncPending = async () => {
    // Check IndexedDB for pending sync operations
    try {
      const db = await openDB();
      const tx = db.transaction('sync_queue', 'readonly');
      const store = tx.objectStore('sync_queue');
      const countRequest = store.count();
      await new Promise<void>((resolve) => {
        countRequest.onsuccess = () => {
          setSyncPending(countRequest.result > 0);
          resolve();
        };
        countRequest.onerror = () => {
          setSyncPending(false);
          resolve();
        };
      });
    } catch (e) {
      setSyncPending(false);
    }
  };

  // Import openDB from our db module
  async function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('diet_tracker', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('sync_queue')) {
          db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  if (isOnline && !syncPending) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 p-2 text-center text-sm font-medium ${
      !isOnline ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
    }`}>
      {!isOnline && (
        <span>
          📡 You are offline - changes will sync when reconnected
        </span>
      )}
      {isOnline && syncPending && (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin">⏳</span>
          Syncing pending changes...
        </span>
      )}
    </div>
  );
}
