/**
 * Render loading state
 */
export function renderLoading(message = "Loading...") {
  return `
    <div class="loading-container" role="status" aria-live="polite">
      <div class="spinner"></div>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

/**
 * Render error state
 */
export function renderError(message, retryCallback) {
  return `
    <div class="error-container" role="alert">
      <h2>⚠️ Oops! Something went wrong</h2>
      <p>${escapeHtml(message)}</p>
      <button class="button" onclick="(${retryCallback.toString()})()">Try Again</button>
      <a href="#/" class="button button-secondary">Go Home</a>
    </div>
  `;
}

/**
 * Render event card
 */
export function renderEventCard(event) {
  return `
    <article class="event-card">
      <h3>${escapeHtml(event.title)}</h3>
      <p class="event-meta">
        <strong>Date:</strong> ${formatDate(event.date)} | 
        <strong>Venue:</strong> ${escapeHtml(event.location)}
      </p>
      <p class="event-description">${escapeHtml(event.description)}</p>
    </article>
  `;
}

/**
 * Render event list
 */
export function renderEventList(events) {
  if (events.length === 0) {
    return `
      <section class="empty-state">
        <p>📅 No events found. Try adjusting your search or check back later!</p>
      </section>
    `;
  }

  return `
    <section class="card-grid">
      ${events.map(renderEventCard).join("")}
    </section>
  `;
}


/**
 * Render home page
 */
export function renderHomePage() {
  return `
    <section class="hero">
      <h2>Welcome to Campus Life</h2>
      <p>Explore campus events, join clubs, and stay updated on what's happening around your university.</p>
      <a href="#/events" class="button">View Upcoming Events</a>
    </section>
  `;
}

/**
 * Render event form
 */
export function renderEventForm() {
  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return `
    <h2>Submit a Campus Event</h2>
    <form id="event-form" aria-describedby="form-help">
      <p id="form-help">All fields marked with * are required.</p>

      <div class="form-group">
        <label for="eventName">Event Name *</label>
        <input 
          id="eventName" 
          name="eventName" 
          type="text" 
          required 
          minlength="3"
          maxlength="100"
          placeholder="e.g., Hackathon 2025"
        />
      </div>

      <div class="form-group">
        <label for="eventDate">Event Date *</label>
        <input 
          id="eventDate" 
          name="eventDate" 
          type="date" 
          required 
          min="${today}"
        />
      </div>

      <div class="form-group">
        <label for="eventLocation">Location *</label>
        <input 
          id="eventLocation" 
          name="eventLocation" 
          type="text" 
          required 
          minlength="3"
          maxlength="100"
          placeholder="e.g., Innovation Hub"
        />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description" 
          name="description" 
          rows="4"
          maxlength="500"
          placeholder="Tell us about your event..."
        ></textarea>
        <small>Maximum 500 characters</small>
      </div>

      <button type="submit" class="button">Submit Event</button>
    </form>
  `;
}

// Helper functions
function escapeHtml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
