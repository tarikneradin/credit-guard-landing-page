# Quick Start Guide - CreditGuard Landing Page

Get your CreditGuard landing page up and running in 2 minutes!

## Fastest Way to Run Locally

### Step 1: Open Terminal
Open your terminal/command prompt and navigate to the project directory:

```bash
cd /Users/tarikneradin/IdeaProjects/credit-guard/CreditGuardWeb
```

### Step 2: Start a Local Server

Choose one method based on what you have installed:

**If you have Python 3 (most common):**
```bash
python3 -m http.server 8000
```

**If you have Node.js:**
```bash
npx http-server -p 8000
```

**If you have PHP:**
```bash
php -S localhost:8000
```

### Step 3: Open in Browser

Open your web browser and visit:
```
http://localhost:8000/creditguard_landing_page.html
```

That's it! 🎉

## What You'll See

Your professional CreditGuard landing page with:
- ✅ Animated hero section with gradient backgrounds
- ✅ 6 feature cards with hover effects
- ✅ Interactive credit score prediction chart
- ✅ Pricing section with 3 tiers
- ✅ FAQ accordion (click to expand)
- ✅ Mobile-responsive menu
- ✅ Smooth scroll animations

## Testing Mobile View

### Chrome DevTools:
1. Press `F12` or right-click and select "Inspect"
2. Click the device toggle icon (or press `Ctrl+Shift+M`)
3. Select different device sizes to test responsiveness

## Quick Edits

### Change Your Brand Name:
Search for "CreditGuard" in the HTML file and replace with your brand name.

### Update Pricing:
Look for the "Pricing Section" around line 365 and modify the prices/features.

### Modify Colors:
Find the `tailwind.config` section (around line 42) and change the hex color values.

## Troubleshooting

**Page doesn't load?**
- Make sure you're accessing via `http://localhost:8000` not just opening the file
- Check if port 8000 is already in use (try port 8001 or 8080)

**Animations not working?**
- Check browser console (F12) for errors
- Ensure you have internet connection (CDN resources need to load)

**Chart not displaying?**
- Open browser console to see any errors
- Verify Plotly.js library loaded from CDN

## Next Steps

1. **Customize Content**: Update text, images, and colors to match your brand
2. **Add Analytics**: Integrate Google Analytics or similar
3. **Email Integration**: Connect form submissions to your email service
4. **Deploy**: Push to Netlify, Vercel, or your hosting provider

## Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Review the HTML file comments for code explanations
- Open browser console (F12) to debug JavaScript issues

---

**Pro Tip**: Use VS Code with the "Live Server" extension for automatic page reload during development!
