// IndexedDB wrapper for offline-first food logging

const DB_NAME = "DietTrackerDB";
const DB_VERSION = 1;

export interface OfflineFoodLog {
  id?: number;
  localId: string;
  meal_type: string;
  description: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  date: string;
  image_url?: string;
  source: string;
  synced: boolean;
  created_at: string;
}

export interface OfflineWeeklyPlan {
  id?: number;
  weekStart: string;
  planData: unknown;
  targetCalories: number;
  synced: boolean;
  created_at: string;
}

class OfflineDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Food logs store
        if (!db.objectStoreNames.contains("foodLogs")) {
          const foodLogsStore = db.createObjectStore("foodLogs", { 
            keyPath: "localId",
            autoIncrement: false 
          });
          foodLogsStore.createIndex("synced", "synced", { unique: false });
          foodLogsStore.createIndex("date", "date", { unique: false });
        }

        // Weekly plans store
        if (!db.objectStoreNames.contains("weeklyPlans")) {
          const plansStore = db.createObjectStore("weeklyPlans", { 
            keyPath: "weekStart" 
          });
          plansStore.createIndex("synced", "synced", { unique: false });
        }

        // Pending sync queue
        if (!db.objectStoreNames.contains("syncQueue")) {
          const syncStore = db.createObjectStore("syncQueue", { 
            keyPath: "id", 
            autoIncrement: true 
          });
          syncStore.createIndex("type", "type", { unique: false });
        }
      };
    });
  }

  // Food Logs
  async addFoodLog(log: Omit<OfflineFoodLog, "id">): Promise<string> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("foodLogs", "readwrite");
      const store = tx.objectStore("foodLogs");
      const request = store.add(log);
      request.onsuccess = () => resolve(log.localId);
      request.onerror = () => reject(request.error);
    });
  }

  async getFoodLogs(date?: string): Promise<OfflineFoodLog[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("foodLogs", "readonly");
      const store = tx.objectStore("foodLogs");
      const index = date ? store.index("date") : store.index("synced");
      const request = date ? index.getAll(date) : store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getUnsyncedLogs(): Promise<OfflineFoodLog[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("foodLogs", "readonly");
      const store = tx.objectStore("foodLogs");
      const index = store.index("synced");
      // Get all and filter for synced=false
      const request = index.getAll();
      request.onsuccess = () => {
        const all = request.result || [];
        resolve(all.filter((log: OfflineFoodLog) => !log.synced));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async markLogSynced(localId: string): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("foodLogs", "readwrite");
      const store = tx.objectStore("foodLogs");
      const getRequest = store.get(localId);
      
      getRequest.onsuccess = () => {
        const log = getRequest.result;
        if (log) {
          log.synced = true;
          const updateRequest = store.put(log);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async deleteFoodLog(localId: string): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("foodLogs", "readwrite");
      const store = tx.objectStore("foodLogs");
      const request = store.delete(localId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Weekly Plans
  async saveWeeklyPlan(plan: OfflineWeeklyPlan): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("weeklyPlans", "readwrite");
      const store = tx.objectStore("weeklyPlans");
      const request = store.put(plan);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getWeeklyPlan(weekStart: string): Promise<OfflineWeeklyPlan | null> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("weeklyPlans", "readonly");
      const store = tx.objectStore("weeklyPlans");
      const request = store.get(weekStart);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Sync queue
  async addToSyncQueue(action: { type: string; data: unknown }): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("syncQueue", "readwrite");
      const store = tx.objectStore("syncQueue");
      const request = store.add({ ...action, created_at: new Date().toISOString() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSyncQueue(): Promise<unknown[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("syncQueue", "readonly");
      const store = tx.objectStore("syncQueue");
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async clearSyncQueue(): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("syncQueue", "readwrite");
      const store = tx.objectStore("syncQueue");
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async removeFromSyncQueue(id: number): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("syncQueue", "readwrite");
      const store = tx.objectStore("syncQueue");
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineDB = new OfflineDB();
