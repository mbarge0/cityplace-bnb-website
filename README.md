# CityPlace BnB Website

SEO-optimized website for CityPlace BnB - Extended stay accommodations near Baylor Hospital Dallas.

## 🏢 Property Information

**Address:** 3604 San Jacinto St, Dallas, TX 75204  
**Features:** 10 luxury suites with full kitchens, private dog park, free parking  
**Location:** 2-minute walk to Baylor University Medical Center  

## 🎯 Target Keywords

- Extended stay apartments Dallas with kitchen
- Hotels near Baylor Medical Center Dallas  
- Pet-friendly hotels downtown Dallas
- Downtown Dallas furnished apartments
- Medical stay hotels Dallas Baylor
- Corporate housing downtown Dallas

## 🛠️ Technical Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Deployment:** Netlify
- **Forms:** HubSpot integration
- **SEO:** Structured data, XML sitemap, optimized meta tags
- **Performance:** Optimized for Core Web Vitals

## 📁 Project Structure

```
cityplace-bnb-website/
├── index.html                              # Homepage
├── extended-stay-dallas/                   # Extended stay landing page
├── hotels-near-baylor-hospital-dallas/     # Medical stays page
├── pet-friendly-hotels-downtown-dallas/    # Pet-friendly page
├── corporate-housing-downtown-dallas/      # Business travel page
├── full-kitchen-hotel-suites-dallas/       # Amenities page
├── blog/                                   # Blog section
├── assets/                                 # Static assets
├── netlify/functions/                      # Serverless functions
└── Configuration files
```

## 🚀 Local Development

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/cityplace-bnb-website.git
cd cityplace-bnb-website

# Install dependencies
npm install

# Start local server
npm run dev
```

Visit `http://localhost:3000` to view the site locally.

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Add property images to `assets/images/`
- [ ] Update HubSpot Portal ID and Form ID
- [ ] Replace placeholder phone numbers
- [ ] Add Google Analytics tracking code
- [ ] Test all forms and contact methods

### Netlify Setup
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Set up custom domain
- [ ] Test serverless functions
- [ ] Configure redirects

### SEO Setup
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Business Profile
- [ ] Configure Google Analytics goals
- [ ] Test structured data markup
- [ ] Verify page speed scores

## 🔧 Configuration

### Environment Variables (Netlify)
```
HUBSPOT_PORTAL_ID=your_portal_id_here
HUBSPOT_FORM_ID=your_form_id_here
```

### HubSpot Integration
1. Create HubSpot form with fields: firstname, lastname, email, phone, message
2. Get Portal ID and Form ID from HubSpot
3. Update environment variables in Netlify
4. Test form submission

## 📊 SEO Features

- **Structured Data:** Hotel, LocalBusiness, and Review schemas
- **Meta Tags:** Optimized titles and descriptions for each page
- **Sitemap:** Auto-generated XML sitemap
- **Core Web Vitals:** Optimized for speed and user experience
- **Mobile-First:** Responsive design throughout
- **Local SEO:** Google Business Profile integration ready

## 🎨 Design System

### Color Palette
- **Primary Red:** #e74c3c (from Dallas skyline mural)
- **Primary Purple:** #8e44ad (from Dallas skyline mural)  
- **Primary Yellow:** #f39c12 (from Dallas skyline mural)
- **Primary Orange:** #e67e22 (from Dallas skyline mural)

### Typography
- **Primary Font:** Inter (fallback to system fonts)
- **Headings:** 700 weight for impact
- **Body:** 400 weight for readability
- **CTA Buttons:** 600 weight for emphasis

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px  
- **Desktop:** > 1024px

## 🧪 Testing

### Manual Testing Checklist
- [ ] All pages load correctly
- [ ] Forms submit successfully  
- [ ] Mobile navigation works
- [ ] Images load and display properly
- [ ] All links function correctly
- [ ] Contact methods work

### Performance Testing
- [ ] Google PageSpeed Insights score > 90
- [ ] Core Web Vitals pass
- [ ] Images optimized for web
- [ ] JavaScript and CSS minified

## 📈 Analytics & Tracking

### Key Metrics to Monitor
- **Organic Traffic:** Google Analytics
- **Keyword Rankings:** Google Search Console
- **Conversion Rate:** Form submissions to bookings
- **Page Speed:** Core Web Vitals
- **Local Visibility:** Google Business Profile insights

### Goals Setup
- **Primary Goal:** Direct bookings via CloudBeds link
- **Secondary Goal:** Lead form submissions
- **Micro Goals:** Phone calls, email clicks

## 🔒 Security

- **Headers:** Security headers configured in Netlify
- **HTTPS:** Enforced via Netlify
- **Form Protection:** HubSpot spam filtering
- **Environment Variables:** Secure storage of sensitive data

## 📞 Support

For technical issues or questions:
- **Developer:** [Your contact information]
- **Property Manager:** CityPlace BnB team
- **Hosting:** Netlify support

## 📄 License

Copyright © 2025 CityPlace BnB. All rights reserved.

---

**Last Updated:** January 2025  
**Version:** 1.0.0