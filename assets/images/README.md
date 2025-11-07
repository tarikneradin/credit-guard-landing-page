# Image Assets

## Hero Image Setup

To complete the hero image setup, please save the credit score image as:

```
hero-credit-score.png
```

in this directory (`CreditGuardWeb/assets/images/`).

### Image Details:
- **File name**: `hero-credit-score.png`
- **Recommended size**: 1200px - 1600px width (for high-res displays)
- **Format**: PNG (for transparency) or JPG (for smaller file size)
- **Content**: User with phone showing "Your credit scoring 792 Good"

### How to Save:
1. Save the image file you provided to this directory
2. Name it: `hero-credit-score.png`
3. Refresh the landing page

The image is already configured in the HTML and will display automatically once saved here.

---

## Alternative: Use External URL

If you prefer to host the image externally, update line 217 in `creditguard_landing_page.html`:

```html
<img class="w-full h-auto object-contain" src="YOUR_IMAGE_URL_HERE" alt="Happy user checking credit score of 792 - Good rating on CreditGuard app" loading="eager" />
```

Replace `YOUR_IMAGE_URL_HERE` with your hosted image URL.
