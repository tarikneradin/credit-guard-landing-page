# CreditGuard Landing Page

A modern, professional landing page for the CreditGuard AI-powered credit monitoring platform built with HTML, Tailwind CSS, and modern web development best practices.

## Features

### Design & UX
- **Responsive Design**: Fully responsive layout that works seamlessly on mobile, tablet, and desktop devices
- **Modern UI**: Clean, minimalist design with purple and blue gradient brand colors
- **Smooth Animations**: Scroll-based animations using AOS (Animate On Scroll) library
- **Interactive Elements**: Animated feature cards, FAQ accordion, and mobile menu

### Sections
1. **Hero Section**: Eye-catching header with trust indicators and CTA buttons
2. **Features Section**: 6 key features displayed in animated cards
3. **How It Works**: 3-step process visualization
4. **Interactive Demo**: Live credit score prediction chart using Plotly.js
5. **Pricing Section**: 3 pricing tiers (Free, Premium, Pro) with detailed features
6. **FAQ Section**: Collapsible accordion with 6 common questions
7. **CTA Section**: Conversion-focused call-to-action
8. **Footer**: Comprehensive footer with navigation links and social media

### Technical Features
- **SEO Optimized**: Meta tags for search engines and social media sharing
- **Performance**: Optimized images with lazy loading
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation support
- **Custom Animations**: CSS animations for floating elements and gradient shifts
- **Interactive Charts**: Dynamic credit score visualization with Plotly.js

## Technologies Used

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **JavaScript**: Vanilla JavaScript for interactivity
- **AOS (Animate On Scroll)**: Scroll animation library
- **Plotly.js**: Interactive charting library
- **Font Awesome**: Icon library
- **Google Fonts**: Inter font family

## How to Run Locally

### Method 1: Using a Simple HTTP Server (Recommended)

#### Option A: Python (Python 3)
```bash
# Navigate to the CreditGuardWeb directory
cd /Users/tarikneradin/IdeaProjects/credit-guard/CreditGuardWeb

# Start a simple HTTP server on port 8000
python3 -m http.server 8000

# Open your browser and visit:
# http://localhost:8000/creditguard_landing_page.html
```

#### Option B: Python 2 (if Python 3 is not available)
```bash
cd /Users/tarikneradin/IdeaProjects/credit-guard/CreditGuardWeb
python -m SimpleHTTPServer 8000
# Then visit: http://localhost:8000/creditguard_landing_page.html
```

#### Option C: Node.js (http-server)
```bash
# Install http-server globally (one-time setup)
npm install -g http-server

# Navigate to the directory
cd /Users/tarikneradin/IdeaProjects/credit-guard/CreditGuardWeb

# Start the server
http-server -p 8000

# Then visit: http://localhost:8000/creditguard_landing_page.html
```

#### Option D: PHP Built-in Server
```bash
cd /Users/tarikneradin/IdeaProjects/credit-guard/CreditGuardWeb
php -S localhost:8000
# Then visit: http://localhost:8000/creditguard_landing_page.html
```

### Method 2: Using Live Server (VS Code Extension)

1. Install the "Live Server" extension in VS Code
2. Open the `creditguard_landing_page.html` file in VS Code
3. Right-click anywhere in the HTML file and select "Open with Live Server"
4. The page will automatically open in your default browser

### Method 3: Direct File Opening (Not Recommended)

You can double-click the HTML file to open it directly in a browser, but this method may have limitations with certain features due to CORS restrictions.

## Browser Support

The landing page is compatible with all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Customization

### Changing Colors
The color scheme is defined in the Tailwind config within the HTML file. Look for the `tailwind.config` section and modify the brand colors:

```javascript
colors: {
    'brand-purple': '#6D4BFF',
    'brand-blue': '#4A8CFF',
    'brand-dark': '#131A32',
    // ... more colors
}
```

### Updating Content
All content is in plain HTML. Simply search for the text you want to change and update it directly.

### Adding More Sections
Follow the existing section structure and add your new section before the closing `</main>` tag. Remember to add AOS animation attributes:

```html
<section id="your-section" class="py-20 md:py-28">
    <div class="container mx-auto px-6" data-aos="fade-up">
        <!-- Your content -->
    </div>
</section>
```

## Performance Optimization

For production deployment, consider these optimizations:

1. **Self-host Libraries**: Download and serve Tailwind CSS, Font Awesome, AOS, and Plotly.js locally
2. **Minify Assets**: Minify HTML, CSS, and JavaScript
3. **Optimize Images**: Compress images and convert to WebP format
4. **Add Caching**: Configure appropriate cache headers on your web server
5. **Enable Compression**: Enable GZIP/Brotli compression on the server

## Deployment

### Static Hosting Options
The landing page can be deployed to any static hosting service:

- **Netlify**: Drag and drop the folder or connect via Git
- **Vercel**: Deploy directly from your Git repository
- **GitHub Pages**: Push to a GitHub repo and enable Pages
- **AWS S3**: Upload to an S3 bucket configured for static hosting
- **Cloudflare Pages**: Connect your Git repository

### Quick Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to the directory
cd /Users/tarikneradin/IdeaProjects/credit-guard/CreditGuardWeb

# Deploy
netlify deploy --prod
```

## File Structure

```
CreditGuardWeb/
├── creditguard_landing_page.html   # Main landing page file
└── README.md                        # This file
```

## Future Enhancements

Consider adding these features for enhanced functionality:

1. **Email Capture Form**: Integrate with email marketing service (Mailchimp, ConvertKit)
2. **Analytics**: Add Google Analytics or similar tracking
3. **A/B Testing**: Implement testing for different CTAs
4. **Chatbot**: Add live chat or AI chatbot for visitor engagement
5. **Blog Section**: Add a blog for SEO and content marketing
6. **Testimonials**: Include customer reviews and ratings
7. **Video Demo**: Add a product demo video

## Support

For issues or questions:
- Review the code in `creditguard_landing_page.html`
- Check browser console for JavaScript errors
- Ensure all CDN resources are loading properly

## License

This landing page is part of the CreditGuard project. All rights reserved.

---

**Note**: This is a front-end only landing page. For full functionality, you'll need to integrate backend services for user authentication, payment processing, and credit monitoring features as outlined in the CreditGuard specifications.
