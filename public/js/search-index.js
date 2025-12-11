/**
 * Client-side search index with pagination
 */

export class SearchIndex {
  constructor() {
    this.index = new Map();
    this.currentPage = 1;
    this.pageSize = 6;
  }

  /**
   * Build inverted index from events
   */
  buildIndex(events) {
    this.index.clear();
    
    events.forEach((event, eventIndex) => {
      // Tokenize title, description, and location
      const tokens = this.tokenize(
        `${event.title} ${event.description} ${event.location}`
      );
      
      tokens.forEach(token => {
        if (!this.index.has(token)) {
          this.index.set(token, new Set());
        }
        this.index.get(token).add(eventIndex);
      });
    });
  }

  /**
   * Tokenize text into searchable terms
   */
  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(token => token.length > 2); // Ignore very short words
  }

  /**
   * Search events using inverted index
   */
  search(query, events) {
    if (!query) return events;
    
    const queryTokens = this.tokenize(query);
    const matchingIndices = new Set();
    
    queryTokens.forEach(token => {
      if (this.index.has(token)) {
        this.index.get(token).forEach(index => {
          matchingIndices.add(index);
        });
      }
    });
    
    return Array.from(matchingIndices).map(index => events[index]);
  }

  /**
   * Paginate results
   */
  paginate(items) {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    
    return {
      items: items.slice(start, end),
      currentPage: this.currentPage,
      totalPages: Math.ceil(items.length / this.pageSize),
      totalItems: items.length,
      hasMore: end < items.length
    };
  }

  nextPage() {
    this.currentPage++;
  }

  resetPage() {
    this.currentPage = 1;
  }
}

export const searchIndex = new SearchIndex();