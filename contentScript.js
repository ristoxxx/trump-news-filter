// Keywords from README (case-insensitive)
const KEYWORDS = [
  /trump/i,
  /donald\s+trump/i,
  /donald\s+j\.?\s+trump/i,
  /maga/i
];

let isEnabled = true;
const FILTERED_CLASS = 'tnf-hidden';
const PROCESSED_ATTR = 'data-tnf-processed';

// Check if element contains Trump-related keywords
function containsKeywords(text) {
  if (!text) return false;
  return KEYWORDS.some(rx => rx.test(text));
}

// Get headline text from an element (prioritizes h1-h3, then title attributes)
function getHeadlineText(element) {
  // Check for headline elements (h1-h3) inside
  const headline = element.querySelector('h1, h2, h3, h4');
  if (headline) {
    return headline.innerText || headline.textContent || '';
  }
  
  // Check title attribute
  if (element.title) {
    return element.title;
  }
  
  // Check aria-label
  if (element.getAttribute('aria-label')) {
    return element.getAttribute('aria-label');
  }
  
  return '';
}

// Filter a single node
function filterNode(node) {
  // Skip if already processed or already hidden
  if (node.hasAttribute(PROCESSED_ATTR) || node.classList.contains(FILTERED_CLASS)) {
    return;
  }
  
  // Get headline text (highest priority per README)
  const headlineText = getHeadlineText(node);
  const hasKeywordInHeadline = containsKeywords(headlineText);
  
  // Get visible text content
  const visibleText = node.innerText || node.textContent || '';
  const hasKeywordInContent = containsKeywords(visibleText);
  
  // Filter if keyword found in headline (highest weight) or content
  if (hasKeywordInHeadline || hasKeywordInContent) {
    node.classList.add(FILTERED_CLASS);
    node.setAttribute(PROCESSED_ATTR, 'true');
  } else {
    node.setAttribute(PROCESSED_ATTR, 'true');
  }
}

// Scan for articles and headlines
function scanArticles() {
  if (!isEnabled) {
    // Remove filter if disabled
    document.querySelectorAll(`.${FILTERED_CLASS}`).forEach(node => {
      node.classList.remove(FILTERED_CLASS);
    });
    return;
  }
  
  // Common article selectors (works for most news sites)
  const articleSelectors = [
    'article',
    '[role="article"]',
    '.article',
    '.story',
    '.news-item',
    '.news-card',
    '.card',
    '.promo',
    '.story-card',
    '.PromoLink',
    '.Card'
  ];
  
  // YLE-specific selectors
  const yleSelectors = [
    'article[class*="Article"]',
    'article[class*="Story"]',
    '[class*="article"]',
    '[class*="story"]',
    '[class*="news-item"]',
    'h1, h2, h3, h4',
    'a[href*="/a/"]', // YLE article links
    '[data-testid*="article"]',
    '[data-testid*="story"]'
  ];
  
  // Combine all selectors
  const allSelectors = [...articleSelectors, ...yleSelectors].join(', ');
  
  try {
    document.querySelectorAll(allSelectors).forEach(node => {
      // Skip if it's a child of an already filtered element
      if (node.closest(`.${FILTERED_CLASS}`)) {
        return;
      }
      
      // Skip very small text nodes (likely not articles)
      const text = node.innerText || node.textContent || '';
      if (text.trim().length < 10) {
        return;
      }
      
      filterNode(node);
    });
  } catch (e) {
    console.warn('Trump News Filter: Error scanning articles', e);
  }
}

// Load enabled state from storage
function loadState() {
  chrome.storage.sync.get(['enabled'], result => {
    isEnabled = result.enabled !== false; // Default to enabled
    scanArticles();
  });
}

// Listen for state changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes.enabled) {
    isEnabled = changes.enabled.newValue !== false;
    // Remove processed attribute to allow re-scanning
    document.querySelectorAll(`[${PROCESSED_ATTR}]`).forEach(node => {
      node.removeAttribute(PROCESSED_ATTR);
    });
    scanArticles();
  }
});

// Initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadState();
  });
} else {
  loadState();
}

// Watch for dynamically loaded content (lazy-loaded articles)
const observer = new MutationObserver(() => {
  if (isEnabled) {
    scanArticles();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log('Trump News Filter: Active');