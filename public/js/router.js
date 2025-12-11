import { state } from "./state.js";
import { api } from "./api.js";
import { 
  renderHomePage, 
  renderEventList, 
  renderEventForm, 
  renderLoading, 
  renderError 
} from "./ui.js";
import { validateEventForm, validateEventName, validateEventDate, validateLocation, validateDescription } from "./validation.js";
 

export function router() {
  const main = document.querySelector("main");
  if (!main) return;

  const route = window.location.hash || "#/";

  // Update active nav link
  updateActiveNav(route);

  // Clear any existing error
  state.clearError();

  

  // Handle different routes
  if (route === "#/") {
    main.innerHTML = renderHomePage();
   
  } else if (route === "#/events") {
    renderEventsPage(main);
  } else if (route === "#/form") {
    main.innerHTML = renderEventForm();
    attachFormHandler();
  } else {
    main.innerHTML = `
      <h2>404 – Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <a href="#/" class="button">Go Home</a>
    `;
  }

  // Ensure main is focused for accessibility
  main.focus();
}

/**
 * Render events page with loading and error states
 */
async function renderEventsPage(main) {
  console.log("🔷 renderEventsPage called");
  console.log("🔷 Current state.events:", state.events.length);
  
  // Show loading state immediately
  main.innerHTML = renderLoading("Loading events...");

  try {
    // Check if we have cached data
    const hasCachedData = await state.init();
    console.log("🔷 Has cached data:", hasCachedData);
    console.log("🔷 State after init:", state.events.length);

    if (hasCachedData) {
      // Show cached data immediately
      console.log("🔷 Showing cached data first");
      main.innerHTML = `
        <div class="page-header">
          <h2>Upcoming Events</h2>
          <div class="search-container">
            <input 
              type="search" 
              id="event-search" 
              placeholder="Search events..." 
              aria-label="Search events"
            />
          </div>
        </div>
        ${renderEventList(state.events)}
      `;
      attachSearchHandler();
    }

    // Fetch fresh data from API
    
    state.setLoading(true);
    const freshEvents = await api.fetchEvents();
    
    
    // Merge: Keep user-created events, add API events
    const userEvents = state.events.filter(e => e.isUserCreated);
    
    
    const mergedEvents = [...userEvents, ...freshEvents];
    
    
    state.setEvents(mergedEvents);

    // Clean up past events automatically
    const removed = state.cleanupPastEvents();
    if (removed > 0) {
    console.log(`🗑️ Automatically removed ${removed} past event(s)`);
    }
    state.setLoading(false);

    // Re-render with merged data
    
    main.innerHTML = `
      <div class="page-header">
        <h2>Upcoming Events</h2>
        <div class="search-container">
          <input 
            type="search" 
            id="event-search" 
            placeholder="Search events..." 
            aria-label="Search events"
          />
        </div>
      </div>
      ${renderEventList(state.events)}
    `;
    attachSearchHandler();

  } catch (error) {
    console.error("🔷 Error in renderEventsPage:", error);
    state.setError(error.message);
    state.setLoading(false);

    // Check if we have any cached data to show
    if (state.events.length > 0) {
      main.innerHTML = `
        <div class="error-banner" role="alert">
          <p>⚠️ Could not fetch latest events. Showing cached data.</p>
        </div>
        <div class="page-header">
          <h2>Upcoming Events</h2>
          <div class="search-container">
            <input 
              type="search" 
              id="event-search" 
              placeholder="Search events..." 
              aria-label="Search events"
            />
          </div>
        </div>
        ${renderEventList(state.events)}
      `;
      attachSearchHandler();
    } else {
      main.innerHTML = renderError(error.message, () => renderEventsPage(main));
    }
  }
}

/**
 * Attach search handler with debouncing
 */
function attachSearchHandler() {
  const searchInput = document.getElementById("event-search");
  if (!searchInput) return;

  let debounceTimer;

  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      const keyword = e.target.value.trim();
      const filteredEvents = state.filterEvents(keyword);

      const cardGridParent = document.querySelector(".card-grid")?.parentElement;
      if (cardGridParent) {
        const listContent = renderEventList(filteredEvents);
        
        // Find the card-grid and replace it
        const existingGrid = document.querySelector(".card-grid") || document.querySelector(".empty-state");
        if (existingGrid) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = listContent;
          existingGrid.replaceWith(tempDiv.firstElementChild);
        }
      }
    }, 300); // 300ms debounce
  });
}

/**
 * Update active navigation link
 */
function updateActiveNav(currentRoute) {
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentRoute) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/**
 * Attach form submit handler with validation
 */
function attachFormHandler() {
  const form = document.querySelector("#event-form");
  if (!form) {
    console.error("Form not found!");
    return;
  }

  // Real-time validation on blur
  const inputs = form.querySelectorAll("input, textarea");
  inputs.forEach(input => {
    input.addEventListener("blur", () => {
      validateField(input);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous error messages
    clearFormErrors();

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    const formData = new FormData(form);
    const eventData = {
      eventName: formData.get("eventName"),
      eventDate: formData.get("eventDate"),
      eventLocation: formData.get("eventLocation"),
      description: formData.get("description") || ""
    };

    // Validate form data
    const validation = validateEventForm(eventData);

    if (!validation.isValid) {
      // Show validation errors
      displayFormErrors(validation.errors);
      return;
    }

    try {
      // Disable form during submission
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";

      const newEvent = {
        title: eventData.eventName.trim(),
        date: eventData.eventDate,
        location: eventData.eventLocation.trim(),
        description: eventData.description.trim() || "No description provided"
      };

      // Add to state immediately (optimistic update)
      state.addEvent(newEvent);

      // Try to submit to API (simulated)
      try {
        await api.submitEvent(newEvent);
      } catch (apiError) {
        console.warn("API submission failed, but saved locally:", apiError);
      }

      // Show success message
      const successMsg = document.createElement("div");
      successMsg.className = "success-message";
      successMsg.textContent = "✓ Event submitted successfully!";
      successMsg.setAttribute("role", "status");
      successMsg.setAttribute("aria-live", "polite");
      form.insertAdjacentElement("beforebegin", successMsg);

      // Clear the form
      form.reset();

      // Redirect to events page after showing success
      setTimeout(() => {
        window.location.hash = "#/events";
      }, 1500);

    } catch (error) {
      // Show error message
      const errorMsg = document.createElement("div");
      errorMsg.className = "error-message";
      errorMsg.textContent = `✗ ${error.message}`;
      errorMsg.setAttribute("role", "alert");
      form.insertAdjacentElement("beforebegin", errorMsg);

      // Re-enable form
      submitButton.disabled = false;
      submitButton.textContent = originalText;

      // Remove error after 5 seconds
      setTimeout(() => errorMsg.remove(), 5000);
    }
  });
}

/**
 * Validate individual field
 */
function validateField(input) {
  const fieldName = input.name;
  const value = input.value;
  
  let validation;
  
  if (fieldName === "eventName") {
    validation = validateEventName(value);
  } else if (fieldName === "eventDate") {
    validation = validateEventDate(value);
  } else if (fieldName === "eventLocation") {
    validation = validateLocation(value);
  } else if (fieldName === "description") {
    validation = validateDescription(value);
  }
  
  // Remove existing error for this field
  const existingError = input.parentElement.querySelector(".field-error");
  if (existingError) {
    existingError.remove();
  }
  
  // Show error if invalid
  if (validation && !validation.isValid) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.textContent = validation.errors[0];
    errorDiv.setAttribute("role", "alert");
    input.parentElement.appendChild(errorDiv);
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
}

/**
 * Display form-level errors
 */
function displayFormErrors(errors) {
  const form = document.querySelector("#event-form");
  const errorContainer = document.createElement("div");
  errorContainer.className = "form-errors";
  errorContainer.setAttribute("role", "alert");
  
  const errorList = document.createElement("ul");
  errors.forEach(error => {
    const li = document.createElement("li");
    li.textContent = error;
    errorList.appendChild(li);
  });
  
  errorContainer.appendChild(errorList);
  form.insertAdjacentElement("beforebegin", errorContainer);
  
  // Scroll to errors
  errorContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/**
 * Clear all form error messages
 */
function clearFormErrors() {
  const formErrors = document.querySelector(".form-errors");
  if (formErrors) {
    formErrors.remove();
  }
  
  const fieldErrors = document.querySelectorAll(".field-error");
  fieldErrors.forEach(error => error.remove());
  
  const invalidInputs = document.querySelectorAll('[aria-invalid="true"]');
  invalidInputs.forEach(input => input.removeAttribute("aria-invalid"));
}

