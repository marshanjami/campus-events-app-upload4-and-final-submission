import { filterEventsByKeyword, sortEventsByDate } from "../public/js/utils.js";

describe("Event Utilities", () => {
  const mockEvents = [
    { id: 1, title: "Hackathon", date: "2025-11-20", location: "Hub" },
    { id: 2, title: "Music Fest", date: "2025-11-15", location: "Grounds" },
    { id: 3, title: "Career Fair", date: "2025-11-25", location: "Center" }
  ];

  test("filterEventsByKeyword returns all events when no keyword", () => {
    expect(filterEventsByKeyword(mockEvents, "")).toEqual(mockEvents);
  });

  test("filterEventsByKeyword filters by title (case insensitive)", () => {
    const result = filterEventsByKeyword(mockEvents, "music");
    expect(result.length).toBe(1);
    expect(result[0].title).toBe("Music Fest");
  });

  test("filterEventsByKeyword returns empty array if no match", () => {
    const result = filterEventsByKeyword(mockEvents, "nonexistent");
    expect(result.length).toBe(0);
  });

  test("sortEventsByDate sorts in ascending order", () => {
    const sorted = sortEventsByDate(mockEvents);
    expect(sorted[0].date).toBe("2025-11-15");
    expect(sorted[1].date).toBe("2025-11-20");
    expect(sorted[2].date).toBe("2025-11-25");
  });

  test("sortEventsByDate does not mutate original array", () => {
    const original = [...mockEvents];
    sortEventsByDate(mockEvents);
    expect(mockEvents).toEqual(original);
  });
});