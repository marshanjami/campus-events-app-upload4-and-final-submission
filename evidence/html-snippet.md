```markdown
# Key HTML Snippets  
*Upload 1: Foundations & Accessibility*  


---

## 1. Landmark Template  
*Semantic structure with proper landmarks and skip link*

```html
<body>
  <a class="skip-link" href="#main">Skip to main content</a>

  <header>
    <h1>Campus Life Web App</h1>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="../index.html">Home</a></li>
        <li><a href="events.html">Events</a></li>
        <li><a href="form.html">Submit Event</a></li>
      </ul>
    </nav>
  </header>

  <main id="main" tabindex="-1">
    <!-- Page content -->
  </main>

  <footer>
    <p>© 2025 Campus Life Team</p>
  </footer>
</body>
```

> **Purpose:** Provides clear, semantic landmarks (`header`, `nav`, `main`, `footer`) for screen readers and keyboard navigation. One `<h1>` per page.

---

## 2. Skip Link Example  
*HTML + CSS for accessible keyboard navigation*

```html
<!-- HTML -->
<a class="skip-link" href="#main">Skip to main content</a>
```

```css
/* CSS – from base.css */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0.5rem;
  background: var(--color-primary);
  color: white;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  font-weight: 600;
  z-index: 1000;
  transition: top var(--transition-fast);
}

.skip-link:focus {
  top: 0.5rem;
}
```

```js
// a11y.js – ensures focus lands on <main>
document.querySelector('.skip-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('main')?.focus();
});
```

> **Purpose:** Allows keyboard users to bypass navigation and jump directly to main content. Becomes visible and focusable on Tab.

---

## 3. Form Example  
*Accessible form control with label, required field, and helper text*

```html
<div class="form-group">
  <label for="eventName">Event Name *</label>
  <input
    id="eventName"
    name="eventName"
    type="text"
    required
    aria-describedby="eventName-hint"
  />
  <small id="eventName-hint">Max 100 characters. Be descriptive.</small>
</div>
```

> **Purpose:** Uses `for`/`id` pairing for label association, `required` for validation, and `aria-describedby` to link helper text to the input.

---

## 4. ARIA Usage Example  
*Only where native semantics are insufficient*

```html
<!-- Active navigation link -->
<li><a href="events.html" aria-current="page">Events</a></li>

<!-- Optional: Disclosure button (if using <details>/<summary>) -->
<details>
  <summary role="button" tabindex="0" aria-expanded="false">
    Filter Events by Category
  </summary>
  <div class="disclosure-panel">...</div>
</details>
```

> **Purpose:** `aria-current="page"` indicates the current page in navigation. `aria-expanded` (if toggled via JS) conveys open/closed state. No ARIA on native elements like `<h1>` or `<button>`.

---


```