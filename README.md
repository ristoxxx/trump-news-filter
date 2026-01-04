# Trump News Filter

A Chrome extension that filters Trump-related news from websites by manipulating the page content **locally in the browser**. No tracking, no data collection, no backend.

This project is designed to be:
- ✅ Open source
- ✅ Simple (DOM + keyword-based filtering)
- ✅ Ethically transparent (user-controlled filtering)
- ✅ Publishable in Chrome Web Store (v1)

---

## 🎯 Project Goals

### v1 (Chrome Web Store release)
- Filter Trump-related content using keyword detection
- Multiple filtering modes:
  - Hide completely
  - Blur content
  - Collapse with "Show anyway" button
- Global on/off toggle
- Lightweight and fast

### v2+ (future)
- Site-specific rules (Yle, HS, Reddit, X, etc.)
- Custom keyword lists
- Tolerance slider ("How much Trump today?")
- Firefox support

---

## 🧠 Filtering Logic (v1)

**Trigger keywords (case-insensitive):**
- trump
- donald trump
- donald j. trump
- maga

**Elements scanned:**
- `<article>`
- headline elements (`h1–h3`)
- common news card containers

Filtering is based on:
- Title text (highest weight)
- Visible text content

---

## 🧩 Technical Architecture

### Chrome Extension (Manifest V3)

- `manifest.json`
- `contentScript.js` → DOM scanning & manipulation
- `styles.css` → blur / hide styles
- `popup.html` → simple enable/disable toggle
- `popup.js`

No backend. No external APIs.

---

## 🔐 Privacy & Ethics

- No network requests
- No analytics
- No user data
- Only modifies how *you* see a page

---

## 📦 Chrome Web Store Readiness Checklist

- [ ] Clear description (non-political positioning)
- [ ] Open-source license (MIT recommended)
- [ ] Icons (16, 48, 128)
- [ ] Privacy policy ("No data collected")
- [ ] Minimal permissions

---

## 📄 License

MIT License

---

## 🚀 Next Steps

1. Create repository structure
2. Implement minimal content script (hide mode only)
3. Add popup toggle
4. Package & test locally
5. Publish v1 to Chrome Web Store
6. Announce + open for contributions

---

*Filtering news is not censorship — it's user interface customization.*
