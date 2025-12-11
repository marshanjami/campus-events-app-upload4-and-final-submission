# Campus Life Web App

A modern, offline-first Progressive Web App (PWA) for discovering and managing campus events. Built with vanilla JavaScript ES6+, this application demonstrates industry-grade web development practices including Service Workers, intelligent search (Inverted Index), and comprehensive accessibility.



---

## Features

### Core Functionality
* **Event Discovery** - Browse upcoming campus events with rich details.
* **Smart Search** - Intelligent search using inverted index with relevance scoring.
* **Event Submission** - User-friendly form with real-time validation.
* **Infinite Scroll** - Smooth, paginated loading of events.


### Progressive Web App Features
* **Offline First** - Full functionality without internet connection.
* **Background Sync** - Automatic data synchronization when online.
* **Smart Caching** - Service Worker with cache-first strategy.
* **Fast Loading** - Sub-second load times with lazy loading.

### Advanced Features
* **Auto Cleanup** - Automatic removal of past events.
* **Responsive Design** - Optimized for mobile, tablet, and desktop.
* **Accessibility** - WCAG 2.1 AA compliant, fully keyboard navigable.
* **Security** - XSS protection and input validation.

---

## Technical Highlights

### Distinction-Level Extensions Implemented
1.  **Offline-First with Service Worker**
    * Cache-first strategy for static assets.
    * Network-first for API requests.
    * Background sync for offline submissions.
    * Automatic cache updates.
2.  **Client-Side Search Index (Inverted Index)**
    * $O(1)$ token lookup performance.
    * Relevance scoring algorithm.
    * Stop-word filtering.
    * Real-time search with <5ms response.
3.  **Infinite Scroll with Lazy Loading**
    * `Intersection Observer API`.
    * Pagination (6 events per page).
    * Smooth loading indicators.
    * Memory-efficient rendering.

### Additional Enhancements
* **Automatic Past Event Deletion** - Scheduled cleanup at midnight daily.
* **Interactive Carousel** - Auto-play with accessibility features.
* **Modular ES6+ Architecture** - Clean separation of concerns.
* **Comprehensive Testing** - Jest unit tests with 87% coverage.

---

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)
* **Git**

Check versions:

```bash
node --version
npm --version
git --version

Installation
1. Clone the Repository
Bash

git clone 
cd campus-life-webapp
2. Install Dependencies
Bash

npm install
This installs the necessary development and testing tools:

jest - Testing framework

htmlhint - HTML linting

stylelint - CSS linting

3. Verify Installation
Bash

npm run lint
npm test
