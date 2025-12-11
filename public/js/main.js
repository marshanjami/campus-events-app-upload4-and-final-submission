import { router } from "./router.js";
import { state } from "./state.js";
import { measurePageLoad } from "./performance.js";  
import { preloadModules } from "./lazy-loader.js";  

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}


// Initialize app
async function initApp() {
  // Measure performance
  measurePageLoad();  

  // Initialize state (load from cache)
  await state.init();

  // Run router on page load
  router();

  // Listen for hash changes
  window.addEventListener("hashchange", () => {
    const currentRoute = window.location.hash || "#/";
    
    // Force fresh render on events page
    if (currentRoute === "#/events") {
      const main = document.querySelector("main");
      if (main) {
        main.innerHTML = "";
      }
    }
    
    router();
  });
}

// Start app when DOM is ready
window.addEventListener("DOMContentLoaded", initApp);