# Vercel Web Analytics Setup

This project has been configured with Vercel Web Analytics to track visitor behavior and page performance.

## Implementation Details

### Static HTML Integration (Currently Active)

The analytics tracking has been implemented using Vercel's recommended approach for static HTML sites:

**Location:** `index.html` (in the `<head>` section)

```html
<!-- Vercel Web Analytics -->
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

### How It Works

1. **Script Queue**: The first script creates a queue (`window.vaq`) to buffer analytics events before the main script loads
2. **Deferred Loading**: The second script loads the analytics tracker with `defer` to avoid blocking page rendering
3. **Auto-detection**: When deployed to Vercel, the `/_vercel/insights/script.js` path is automatically handled by Vercel's infrastructure

### Package Installation

The `@vercel/analytics` package has been installed for future use:

```json
{
  "dependencies": {
    "@vercel/analytics": "^1.4.1"
  }
}
```

This package can be used if you migrate to a JavaScript framework or build system in the future.

## Viewing Analytics Data

Once deployed to Vercel:

1. Go to your project dashboard on Vercel
2. Navigate to the **Analytics** tab
3. View real-time traffic, page views, and visitor insights

## Verification

After deployment, you can verify that analytics is working by:

1. Visiting your live site
2. Opening browser DevTools → Network tab
3. Looking for requests to `/_vercel/insights/*` paths
4. Checking your Vercel dashboard for incoming analytics data

## Privacy & GDPR

Vercel Web Analytics is privacy-friendly and GDPR-compliant:
- No cookies used
- No personal data collected
- No cross-site tracking
- Aggregated insights only

## Additional Configuration (Optional)

If you need advanced features like custom events or filtering, you can use the `window.va()` function:

```javascript
// Example: Track custom events
window.va('event', { name: 'button_click' });

// Example: Filter events before sending
window.va('beforeSend', (event) => {
  if (event.url.includes('/admin')) {
    return null; // Don't track admin pages
  }
  return event;
});
```

## Documentation

- [Vercel Web Analytics Quickstart](https://vercel.com/docs/analytics/quickstart)
- [Advanced Analytics Configuration](https://vercel.com/docs/analytics/package)
- [@vercel/analytics Package](https://www.npmjs.com/package/@vercel/analytics)

## Notes

- Analytics will only work when deployed to Vercel (not on localhost)
- No additional setup required - it works automatically after deployment
- The analytics script is lightweight (~1KB) and doesn't impact page performance
