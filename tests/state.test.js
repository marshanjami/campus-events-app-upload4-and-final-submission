import { jest } from '@jest/globals';
import { state } from "../public/js/state.js";

describe("State Management", () => {
  let originalEvents;

  beforeEach(() => {
    // Save original events and reset
    originalEvents = [...state.events];
    state.events = [];
    state.subscribers = [];
  });

  afterEach(() => {
    // Restore original events
    state.events = originalEvents;
  });

  test("addEvent adds event to state", () => {
    const newEvent = {
      title: "Test Event",
      date: "2025-12-01",
      location: "Test Location",
      description: "Test description"
    };

    state.addEvent(newEvent);
    expect(state.events.length).toBe(1);
    expect(state.events[0].title).toBe("Test Event");
    expect(state.events[0]).toHaveProperty("id");
  });

  test("getEventById returns correct event", () => {
    const event = {
      title: "Find Me",
      date: "2025-12-01",
      location: "Somewhere",
      description: "Test"
    };

    state.addEvent(event);
    const addedEvent = state.events[0];
    const foundEvent = state.getEventById(addedEvent.id);
    
    expect(foundEvent).toBeDefined();
    expect(foundEvent.title).toBe("Find Me");
  });

  test("getEventById returns undefined for non-existent id", () => {
    const foundEvent = state.getEventById(999999);
    expect(foundEvent).toBeUndefined();
  });

  test("subscribe adds subscriber function", () => {
    const mockFn = jest.fn();
    state.subscribe(mockFn);
    
    expect(state.subscribers.length).toBe(1);
    expect(state.subscribers[0]).toBe(mockFn);
  });

  test("notify calls all subscribers", () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    
    state.subscribe(mockFn1);
    state.subscribe(mockFn2);
    state.notify();
    
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  test("addEvent triggers notify", () => {
    const mockFn = jest.fn();
    state.subscribe(mockFn);
    
    state.addEvent({
      title: "Notify Test",
      date: "2025-12-01",
      location: "Test",
      description: "Test"
    });
    
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});