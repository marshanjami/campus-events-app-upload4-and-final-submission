/**
 * Input validation utilities for security and data integrity
 */

/**
 * Validate event name
 */
export function validateEventName(name) {
  const errors = [];
  
  if (!name || name.trim().length === 0) {
    errors.push("Event name is required");
  }
  
  if (name.length < 3) {
    errors.push("Event name must be at least 3 characters");
  }
  
  if (name.length > 100) {
    errors.push("Event name must not exceed 100 characters");
  }
  
  // Check for potentially malicious patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onerror=, etc.
    /<iframe/i,
    /eval\(/i
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(name)) {
      errors.push("Event name contains invalid characters");
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate event date
 */
export function validateEventDate(dateString) {
  const errors = [];
  
  if (!dateString) {
    errors.push("Event date is required");
  }
  
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(date.getTime())) {
    errors.push("Invalid date format");
  } else if (date < today) {
    errors.push("Event date must be in the future");
  }
  
  // Check if date is too far in future (e.g., more than 2 years)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  
  if (date > maxDate) {
    errors.push("Event date cannot be more than 2 years in the future");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate location
 */
export function validateLocation(location) {
  const errors = [];
  
  if (!location || location.trim().length === 0) {
    errors.push("Location is required");
  }
  
  if (location.length < 3) {
    errors.push("Location must be at least 3 characters");
  }
  
  if (location.length > 100) {
    errors.push("Location must not exceed 100 characters");
  }
  
  // Check for dangerous patterns
  const dangerousPatterns = [/<script/i, /javascript:/i, /<iframe/i];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(location)) {
      errors.push("Location contains invalid characters");
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate description
 */
export function validateDescription(description) {
  const errors = [];
  
  // Description is optional
  if (!description) {
    return { isValid: true, errors: [] };
  }
  
  if (description.length > 500) {
    errors.push("Description must not exceed 500 characters");
  }
  
  // Check for dangerous patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /eval\(/i,
    /<embed/i,
    /<object/i
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(description)) {
      errors.push("Description contains invalid characters");
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate entire event form
 */
export function validateEventForm(formData) {
  const nameValidation = validateEventName(formData.eventName);
  const dateValidation = validateEventDate(formData.eventDate);
  const locationValidation = validateLocation(formData.eventLocation);
  const descriptionValidation = validateDescription(formData.description);
  
  const allErrors = [
    ...nameValidation.errors,
    ...dateValidation.errors,
    ...locationValidation.errors,
    ...descriptionValidation.errors
  ];
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    fields: {
      eventName: nameValidation,
      eventDate: dateValidation,
      eventLocation: locationValidation,
      description: descriptionValidation
    }
  };
}

/**
 * Sanitize string to prevent XSS
 */
export function sanitizeString(str) {
  if (!str) return "";
  
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/&/g, "&amp;");
}