// LocalStorage wrapper with error handling
export class StorageManager {
  constructor(storageKey = "campuslife_events") {
    this.storageKey = storageKey;
    this.isAvailable = this.checkStorageAvailability();
  }

  /**
   * Check if localStorage is available
   */
  checkStorageAvailability() {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn("localStorage not available:", e);
      return false;
    }
  }

  /**
   * Save events to localStorage
   */
  saveEvents(events) {
    if (!this.isAvailable) {
      console.warn("Storage not available, events not saved");
      return false;
    }

    try {
      const data = {
        events,
        timestamp: Date.now(),
        version: "1.0"
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      
      // Handle quota exceeded error
      if (error.name === "QuotaExceededError") {
        this.clearOldData();
        try {
          localStorage.setItem(this.storageKey, JSON.stringify({ events, timestamp: Date.now() }));
          return true;
        } catch (retryError) {
          console.error("Still failed after clearing:", retryError);
          return false;
        }
      }
      return false;
    }
  }

  /**
 * Load events from localStorage
 */
loadEvents() {
  if (!this.isAvailable) {
    return null;
  }

  try {
    const data = localStorage.getItem(this.storageKey);
    if (!data) return null;

    const parsed = JSON.parse(data);
    
    // Check if data is stale (older than 24 hours)
    const age = Date.now() - parsed.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (age > maxAge) {
      // Don't clear everything! Keep user events, just mark as stale
      const userEvents = parsed.events.filter(e => e.isUserCreated);
      
      if (userEvents.length > 0) {
        // Save only user events with fresh timestamp
        const freshData = {
          events: userEvents,
          timestamp: Date.now(),
          version: "1.0"
        };
        localStorage.setItem(this.storageKey, JSON.stringify(freshData));
        return userEvents;
      } else {
        // No user events, safe to clear
        this.clearEvents();
        return null;
      }
    }

    return parsed.events;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
}

  /**
   * Clear events from localStorage
   */
  clearEvents() {
    if (!this.isAvailable) return false;

    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  }

  /**
   * Clear old data to free up space
   */
  clearOldData() {
    if (!this.isAvailable) return;

    try {
      // Remove any keys older than 7 days
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        try {
          const item = localStorage.getItem(key);
          const data = JSON.parse(item);
          if (data.timestamp) {
            const age = Date.now() - data.timestamp;
            if (age > 7 * 24 * 60 * 60 * 1000) {
              localStorage.removeItem(key);
            }
          }
        } catch (e) {
          // Skip invalid items
        }
      });
    } catch (error) {
      console.error("Error clearing old data:", error);
    }
  }

  /**
   * Get storage usage info
   */
  getStorageInfo() {
    if (!this.isAvailable) {
      return { used: 0, available: 0 };
    }

    try {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }

      return {
        used: (used / 1024).toFixed(2) + " KB",
        available: this.isAvailable
      };
    } catch (error) {
      return { used: "Unknown", available: false };
    }
  }
}

export const storage = new StorageManager();