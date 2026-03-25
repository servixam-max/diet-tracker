/* eslint-disable @typescript-eslint/no-explicit-any */
// IndexedDB sync utility - uses raw IndexedDB API with any types
// This is acceptable for IndexedDB as the API is callback-based and verbose

export interface SyncAction {
  id?: number;
  type: 'create' | 'update' | 'delete';
  store: string;
  data: unknown;
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
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  private setupOnlineListener(): void {
    if (typeof window === 'undefined') return;
    
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
      await this.executeAction(syncAction);
    } else {
      await this.addToQueue(syncAction);
    }
  }

  private async addToQueue(action: SyncAction): Promise<void> {
    // Queue implementation would go here
  }

  async triggerSync(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    
    try {
      this.retryCount = 0;
    } catch {
      this.handleSyncError();
    } finally {
      this.syncInProgress = false;
    }
  }

  private async executeAction(action: SyncAction): Promise<void> {
    // Sync implementation would go here
  }

  private handleSyncError(): void {
    this.retryCount++;
    
    if (this.retryCount < this.maxRetries) {
      const delay = Math.pow(2, this.retryCount) * 1000;
      setTimeout(() => this.triggerSync(), delay);
    } else {
      this.retryCount = 0;
    }
  }

  isSyncing(): boolean {
    return this.syncInProgress;
  }
}

export const syncManager = SyncManager.getInstance();
