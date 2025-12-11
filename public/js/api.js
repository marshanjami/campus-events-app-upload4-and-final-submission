// Real API integration with error handling and retry logic
export class EventAPI {
  constructor() {
    // Using JSONPlaceholder as a mock REST API
    this.baseUrl = "https://jsonplaceholder.typicode.com";
    this.postsEndpoint = `${this.baseUrl}/posts`;
  }

  
  /**
 * Fetch events from external API
 * Maps posts to event structure for demo purposes
 */
async fetchEvents() {
  try {
    const response = await fetch(this.postsEndpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    
    // Map first 6 posts to event structure with better descriptions
    const events = posts.slice(0, 6).map((post, index) => ({
      id: post.id,
      title: this.generateEventTitle(index),
      date: this.generateFutureDate(index),
      location: this.generateLocation(index),
      description: this.generateDescription(index)  // Changed this line
    }));
    
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to load events. Please check your connection.");
  }
}
  /**
   * Fetch single event by ID
   */
  async fetchEventById(id) {
    try {
      const response = await fetch(`${this.postsEndpoint}/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Event not found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const post = await response.json();
      
      return {
        id: post.id,
        title: `Event ${post.id}`,
        date: this.generateFutureDate(post.id),
        location: this.generateLocation(post.id),
        description: post.body
      };
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  }

  /**
   * Submit new event (simulated)
   */
  async submitEvent(eventData) {
    try {
      const response = await fetch(this.postsEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: eventData.title,
          body: eventData.description,
          userId: 1
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Simulate delay
      await this.delay(500);
      
      return {
        success: true,
        id: result.id,
        message: "Event submitted successfully!"
      };
    } catch (error) {
      console.error("Error submitting event:", error);
      throw new Error("Failed to submit event. Please try again.");
    }
  }

  /**
   * Retry failed requests
   */
  async fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) return response;
        
        // Don't retry on 4xx errors
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`Client error: ${response.status}`);
        }
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.delay(1000 * (i + 1)); // Exponential backoff
      }
    }
  }

  // Helper methods
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateEventTitle(index) {
    const titles = [
      "Hackathon 2025",
      "Music Festival",
      "Career Fair",
      "Sports Day",
      "Art Exhibition",
      "Tech Talk Series"
    ];
    return titles[index] || `Campus Event ${index + 1}`;
  }

  generateFutureDate(index) {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + (index + 1) * 5);
    return futureDate.toISOString().split('T')[0];
  }

  generateLocation(index) {
    const locations = [
      "Innovation Hub",
      "Main Grounds",
      "Student Center",
      "Sports Complex",
      "Art Gallery",
      "Lecture Hall A"
    ];
    return locations[index] || "Campus Venue";
  }

  generateDescription(index) {
  const descriptions = [
    "Join us for an exciting 48-hour coding marathon where students collaborate to build innovative solutions. Prizes and mentorship opportunities available!",
    "Experience live performances from talented student bands and artists. Food trucks, games, and entertainment throughout the day.",
    "Meet potential employers, explore internship opportunities, and learn about career paths. Bring your resume and dress professionally.",
    "Compete in various sports including football, basketball, and athletics. Open to all students. Registration starts at 8 AM.",
    "Explore creative works from our talented art students. Exhibition includes paintings, sculptures, and digital art. Free admission.",
    "Learn from industry experts about the latest trends in technology. Topics include AI, web development, and cybersecurity."
  ];
  return descriptions[index] || "An exciting campus event you won't want to miss!";
}
}

export const api = new EventAPI();