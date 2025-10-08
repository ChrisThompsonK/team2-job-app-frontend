# Scalable Job Role Filtering System

## Overview

The job role filtering system has been optimized for performance and scalability, capable of handling thousands of job listings efficiently.

## Key Features

### 1. **Performance Optimizations**
- **DOM Caching**: Elements and job card data are cached on initialization to avoid repeated DOM queries
- **Debounced Search**: Search input is debounced (300ms) to prevent excessive filtering during typing
- **Efficient Filtering**: Data attributes are read once and cached, not on every filter operation
- **CSS Class Toggle**: Uses CSS classes instead of direct style manipulation to avoid layout thrashing

### 2. **Multiple Filter Types**
- **Search**: Case-insensitive partial match on job title
- **Location**: Filter by specific location
- **Band/Level**: Filter by job band/level
- **Combined Filters**: All filters work together for precise results

### 3. **Scalability**
The system is tested to handle 1000+ job cards efficiently (< 100ms processing time), making it suitable for:
- Large enterprise job boards
- High-volume recruitment platforms
- Real-time job listing updates

## Architecture

### Files Structure
```
/public/js/filterJobRoles.js        # Production JavaScript
/src/filterJobRoles.ts               # TypeScript source
/src/test-filterJobRoles.test.ts    # Comprehensive test suite
/src/views/job-role-list.njk        # Template with filter UI
```

### How It Works

1. **Initialization**: When the page loads, the system caches:
   - Filter control elements (search, location, band)
   - All job cards and their data attributes

2. **Filtering Process**:
   - User inputs trigger the filter function
   - Search input is debounced for better performance
   - Cached data is used to determine visibility
   - CSS classes are toggled for show/hide

3. **Data Flow**:
   ```
   User Input → Debounce (search only) → Filter Logic → Update Visibility
   ```

## Usage

### HTML Structure
Each job card requires these data attributes:
```html
<div class="job-card" 
     data-job-role="Software Developer"
     data-location="Belfast"
     data-band="Trainee">
  <!-- card content -->
</div>
```

### Filter Controls
```html
<input id="search-bar" oninput="filterJobRolesDebounced()" />
<select id="location-filter" onchange="filterJobRoles()">...</select>
<select id="band-filter" onchange="filterJobRoles()">...</select>
```

## Performance Benchmarks

- **1000 job cards**: < 100ms processing time
- **Debounce delay**: 300ms (configurable)
- **Memory**: Minimal overhead from caching
- **DOM queries**: Only on initialization, not during filtering

## Testing

The system includes comprehensive tests covering:
- Performance optimizations (caching, debouncing)
- Filter logic (search, location, band, combined)
- Scalability (1000+ cards)
- Cache management

Run tests:
```bash
npm test -- test-filterJobRoles
```

## Browser Compatibility

- Modern browsers (ES6+ support required)
- Uses standard DOM APIs
- No external dependencies

## Future Enhancements

Potential improvements for even better scalability:
1. Virtual scrolling for 10,000+ items
2. Web Workers for heavy filtering
3. IndexedDB for client-side data persistence
4. Server-side filtering with pagination

## Maintenance

### Adding New Filters
1. Add filter control to template with unique ID
2. Cache the element in `initializeFiltering()`
3. Add filter logic to `filterJobRoles()`
4. Update tests

### Modifying Debounce Delay
Change the timeout value in `filterJobRolesDebounced()`:
```javascript
debounceTimer = setTimeout(() => {
    filterJobRoles();
}, 300); // Change this value (milliseconds)
```
