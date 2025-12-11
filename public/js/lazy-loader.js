/**
 * Lazy load modules for better performance
 */

/**
 * Lazy load validation module only when form is shown
 */
export async function loadValidation() {
  const { validateEventForm, validateEventName, validateEventDate, validateLocation, validateDescription } = 
    await import('./validation.js');
  
  return { validateEventForm, validateEventName, validateEventDate, validateLocation, validateDescription };
}

/**
 * Lazy load API module only when needed
 */
export async function loadAPI() {
  const { api } = await import('./api.js');
  return api;
}

/**
 * Preload modules for better UX
 */
export function preloadModules() {
  // Preload on hover/interaction
  const formLink = document.querySelector('a[href="#/form"]');
  if (formLink) {
    formLink.addEventListener('mouseenter', () => {
      import('./validation.js');
    }, { once: true });
  }

  const eventsLink = document.querySelector('a[href="#/events"]');
  if (eventsLink) {
    eventsLink.addEventListener('mouseenter', () => {
      import('./api.js');
    }, { once: true });
  }
}