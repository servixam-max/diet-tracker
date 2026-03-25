'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncPending, setSyncPending] = useState(false);
  const dbRef = useRef<IDBDatabase | null>(null);

  const openDatabase = useCallback(async (): Promise<IDBDatabase> => {
    if (dbRef.current) return dbRef.current;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('diet_tracker', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        dbRef.current = request.result;
        resolve(request.result);
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('sync_queue')) {
          db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }, []);

  const checkSyncPending = useCallback(async () => {
    try {
      const db = await openDatabase();
      return new Promise<boolean>((resolve) => {
        const tx = db.transaction('sync_queue', 'readonly');
        const store = tx.objectStore('sync_queue');
        const countRequest = store.count();
        countRequest.onsuccess = () => {
          resolve(countRequest.result > 0);
        };
        countRequest.onerror = () => {
          resolve(false);
        };
      });
    } catch {
      return false;
    }
  }, [openDatabase]);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      const pending = await checkSyncPending();
      setSyncPending(pending);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkSyncPending]);

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
