import { storage } from "./storage.js";

export const state = {
  events: [],
  isLoading: false,
  error: null,
  subscribers: [],

  /**
   * Initialize state with cached or fresh data
   */
  async init() {
    // Try to load from cache first
    const cachedEvents = storage.loadEvents();
    if (cachedEvents && cachedEvents.length > 0) {
      this.events = cachedEvents;
      this.notify();
      return true;
    }
    return false;
  },

  /**
   * Subscribe to state changes
   */
  subscribe(fn) {
    this.subscribers.push(fn);
  },

  /**
   * Notify all subscribers of state changes
   */
  notify() {
    this.subscribers.forEach((fn) => fn(this));
  },

  /**
   * Set loading state
   */
  setLoading(isLoading) {
    this.isLoading = isLoading;
    this.notify();
  },

  /**
   * Set error state
   */
  setError(error) {
    this.error = error;
    this.notify();
  },

  /**
   * Clear error state
   */
  clearError() {
    this.error = null;
    this.notify();
  },

 /**
 * Set events (from API or cache)
 */
setEvents(events) {
  
  
  // Check if we're overwriting user events
  const userEvents = this.events.filter(e => e.isUserCreated);
  
  
  this.events = events;
  storage.saveEvents(events);
  this.notify();
},


/**
 * Add new event
 */
addEvent(event) {
  const newEvent = {
    id: Date.now(),
    title: event.title,
    date: event.date,
    location: event.location,
    description: event.description,
    isUserCreated: true
  };
  
 
  
  this.events.unshift(newEvent);
  
 
  
  const saved = storage.saveEvents(this.events);
  
  
  return newEvent;
},


  /**
   * Get event by ID
   */
  getEventById(id) {
    return this.events.find((event) => event.id === parseInt(id));
  },

  /**
   * Get all events
   */
  getAllEvents() {
    return [...this.events];
  },

  /**
   * Filter events
   */
  filterEvents(keyword) {
    if (!keyword) return this.events;
    
    const lowerKeyword = keyword.toLowerCase();
    return this.events.filter(event =>
      event.title.toLowerCase().includes(lowerKeyword) ||
      event.description.toLowerCase().includes(lowerKeyword) ||
      event.location.toLowerCase().includes(lowerKeyword)
    );
  },

  /**
 * Clean up past events automatically
 */
cleanupPastEvents() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const originalLength = this.events.length;
  
  this.events = this.events.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });
  
  const removedCount = originalLength - this.events.length;
  
  if (removedCount > 0) {
    console.log(`🗑️ Automatically removed ${removedCount} past event(s)`);
    storage.saveEvents(this.events);
  }
  
  return removedCount;
},

  /**
   * Clear all data
   */
  clearAllData() {
    this.events = [];
    storage.clearEvents();
    this.notify();
  }
};