/**
 * Performance monitoring utilities
 */

/**
 * Measure and log page load performance
 */
export function measurePageLoad() {
  if (!window.performance || !window.performance.timing) {
    console.warn("Performance API not supported");
    return;
  }

  window.addEventListener("load", () => {
    setTimeout(() => {
      const timing = performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
      const renderTime = timing.domComplete - timing.domLoading;

      console.log("📊 Performance Metrics:");
      console.log(`  Total Load Time: ${loadTime}ms`);
      console.log(`  DOM Ready: ${domReady}ms`);
      console.log(`  Render Time: ${renderTime}ms`);

      // Store metrics
      if (window.performance.getEntriesByType) {
        const resources = performance.getEntriesByType("resource");
        console.log(`  Resources Loaded: ${resources.length}`);
        
        let totalSize = 0;
        resources.forEach(resource => {
          totalSize += resource.transferSize || 0;
        });
        console.log(`  Total Transfer Size: ${(totalSize / 1024).toFixed(2)} KB`);
      }
    }, 0);
  });
}

/**
 * Lazy load images
 */
export function setupLazyLoading() {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    });

    const lazyImages = document.querySelectorAll("img.lazy");
    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

/**
 * Debounce function for performance
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}