import { openDB } from './db';

export interface SyncAction {
  id?: number;
  type: 'create' | 'update' | 'delete';
  store: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

export class SyncManager {
  private static instance: SyncManager;
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;
  private retryCount: number = 0;
  private maxRetries: number = 5;

  private constructor() {
    this.checkOnlineStatus();
    this.setupOnlineListener();
  }

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  private checkOnlineStatus(): void {
    this.isOnline = navigator.onLine;
  }

  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.triggerSync();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async queueAction(action: Omit<SyncAction, 'id' | 'synced'>): Promise<void> {
    const syncAction: SyncAction = {
      ...action,
      timestamp: Date.now(),
      synced: false,
    };

    if (this.isOnline && !this.syncInProgress) {
      // Try to sync immediately
      await this.executeAction(syncAction);
    } else {
      // Queue for later sync
      await this.addToQueue(syncAction);
    }
  }

  private async addToQueue(action: SyncAction): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction('sync_queue', 'readwrite');
      const store = tx.objectStore('sync_queue');
      await new Promise<void>((resolve, reject) => {
        const request = store.add(action);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to queue action:', error);
    }
  }

  async triggerSync(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    
    try {
      const db = await openDB();
      const tx = db.transaction('sync_queue', 'readonly');
      const store = tx.objectStore('sync_queue');
      const actions = await this.getAllFromStore(store);

      for (const action of actions) {
        await this.executeAction(action);
        await this.markAsSynced(action.id!);
      }

      // Clear synced actions
      await this.clearSyncedActions();
      this.retryCount = 0;
    } catch (error) {
      console.error('Sync failed:', error);
      this.handleSyncError();
    } finally {
      this.syncInProgress = false;
    }
  }

  private async executeAction(action: SyncAction): Promise<void> {
    // This would integrate with your Supabase sync logic
    // For now, we'll just mark it as synced
    console.log('Executing sync action:', action);
  }

  private async markAsSynced(id: number): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction('sync_queue', 'readwrite');
      const store = tx.objectStore('sync_queue');
      const action = await new Promise<any>((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      if (action) {
        action.synced = true;
        await new Promise<void>((resolve, reject) => {
          const request = store.put(action);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }
    } catch (error) {
      console.error('Failed to mark action as synced:', error);
    }
  }

  private async clearSyncedActions(): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction('sync_queue', 'readwrite');
      const store = tx.objectStore('sync_queue');
      const allActions = await this.getAllFromStore(store);
      
      for (const action of allActions) {
        if (action.synced) {
          await new Promise<void>((resolve, reject) => {
            const request = store.delete(action.id!);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          });
        }
      }
    } catch (error) {
      console.error('Failed to clear synced actions:', error);
    }
  }

  private async getAllFromStore(store: IDBObjectStore): Promise<SyncAction[]> {
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as SyncAction[]);
      request.onerror = () => reject(request.error);
    });
  }

  private handleSyncError(): void {
    this.retryCount++;
    
    if (this.retryCount < this.maxRetries) {
      // Exponential backoff
      const delay = Math.pow(2, this.retryCount) * 1000; // 2s, 4s, 8s, 16s, 32s
      setTimeout(() => this.triggerSync(), delay);
    } else {
      console.error('Max retries reached. Sync failed.');
      this.retryCount = 0;
    }
  }

  async getPendingSyncCount(): Promise<number> {
    try {
      const db = await openDB();
      const tx = db.transaction('sync_queue', 'readonly');
      const store = tx.objectStore('sync_queue');
      const countRequest = store.count();
      return await new Promise<number>((resolve, reject) => {
        countRequest.onsuccess = () => resolve(countRequest.result as number);
        countRequest.onerror = () => reject(countRequest.error);
      });
    } catch (error) {
      console.error('Failed to get pending sync count:', error);
      return 0;
    }
  }

  isSyncing(): boolean {
    return this.syncInProgress;
  }
}

// Export singleton instance
export const syncManager = SyncManager.getInstance();
