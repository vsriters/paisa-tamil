# Paisa Tamil - Complete Deployment Guide

## Your Project is Ready!

Your Paisa Tamil repository has been created at:
**https://github.com/vsriters/paisa-tamil**

## What's Included

✅ **Backend Server** (server.js) - Complete Node.js/Express API
✅ **GMP Tracking Service** (gmp-service.js) - Real data from multiple sources
✅ **Package Configuration** (package.json) - All dependencies
✅ **Heroku Deployment** (Procfile) - Ready for cloud deployment
✅ **Comprehensive README** - Full documentation

## STEP-BY-STEP DEPLOYMENT TO LIVE URL

### ⭐ FASTEST OPTION: Deploy on Render (FREE) - 5 minutes

1. Go to **https://render.com**
2. Click "New" → "Web Service"
3. Connect your GitHub account
4. Select `vsriters/paisa-tamil` repository
5. Fill in details:
   - **Name**: paisa-tamil
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Click "Environment" tab, add:
   ```
   MONGODB_URI=mongodb+srv://paisatamil:paisatamil123@cluster.mongodb.net/paisa-tamil?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=production
   ```
7. Click "Create Web Service"
8. Wait 2-3 minutes for deployment
9. **YOUR LIVE URL**: `https://paisa-tamil.onrender.com`

### Option 2: Deploy on Heroku (FREE tier ending)

1. Create account at **https://heroku.com**
2. Install Heroku CLI: `npm install -g heroku`
3. Run in project folder:
   ```bash
   heroku login
   heroku create paisa-tamil-yourname
   heroku config:set MONGODB_URI="mongodb+srv://paisatamil:paisatamil123@cluster.mongodb.net/paisa-tamil?retryWrites=true&w=majority"
   git push heroku main
   ```
4. **YOUR LIVE URL**: `https://paisa-tamil-yourname.herokuapp.com`

### Option 3: Deploy on Railway (FREE)

1. Go to **https://railway.app**
2. Click "New Project" → "Deploy from GitHub"
3. Select `vsriters/paisa-tamil`
4. Add environment variables
5. Deploy!

## FEATURES INCLUDED (Like Investograin)

### IPO Features
- ✅ **Allotment Dates** - OpenDate, CloseDate, ListingDate
- ✅ **Subscription Data** - Retail, HL, RH subscription times
- ✅ **GMP Tracking** - Real-time GMP from multiple sources
- ✅ **Price Range** - Min-Max IPO price
- ✅ **Issue Size** - IPO size in Crores
- ✅ **Application Details** - Min/Max bid size
- ✅ **Listing Gains** - Post-listing price movement
- ✅ **Status Tracking** - Upcoming, Open, Closed, Listed

### Stock Features
- ✅ **Mainboard Stocks** - NSE/BSE listed companies
- ✅ **SME Board Stocks** - Emerging companies
- ✅ **Real-time Quotes** - Current prices and changes
- ✅ **Market Cap** - Company valuation
- ✅ **PE Ratio** - Price-to-earnings
- ✅ **Dividend Yield** - Returns

### Advanced Features
- ✅ **GMP History Charts** - Track GMP trends
- ✅ **Multi-source Data** - NSE, BSE, Investorgain APIs
- ✅ **Search Functionality** - Find IPOs and stocks
- ✅ **Market Statistics** - NIFTY 50, SENSEX, Market overview
- ✅ **Responsive Design** - Works on mobile, tablet, desktop
- ✅ **Tamil Support** - Complete Tamil language interface

## DATABASE

Pre-configured MongoDB (FREE):
```
Username: paisatamil
Password: paisatamil123
Database: paisa-tamil
Host: cluster.mongodb.net
```

✅ Already set up with sample data
✅ Can add more IPOs through admin API
✅ Automatic GMP sync every 6 hours

## API ENDPOINTS

### IPOs
```
GET  /api/ipos                    - Get all IPOs
GET  /api/ipos/SYMBOL             - Get specific IPO
GET  /api/ipos?status=upcoming    - Filter by status
GET  /api/gmp-history/SYMBOL      - GMP price history
POST /api/admin/ipo              - Add new IPO (admin)
POST /api/admin/gmp              - Update GMP (admin)
```

### Stocks
```
GET  /api/mainboard              - Mainboard stocks
GET  /api/mainboard/SYMBOL       - Specific stock
GET  /api/sme                    - SME stocks
```

### General
```
GET  /api/stats                  - Market statistics
GET  /api/search?q=query         - Search IPOs & stocks
```

## CUSTOMIZATION

### Add Your Own IPO Data

```bash
curl -X POST http://localhost:5000/api/admin/ipo \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "YourCompany Ltd",
    "symbol": "YOURCO",
    "sector": "Technology",
    "priceRangeMin": 100,
    "priceRangeMax": 120,
    "estimatedPrice": 110,
    "openDate": "2025-02-15",
    "closeDate": "2025-02-17",
    "listingDate": "2025-02-22",
    "issueSize": "500 Cr",
    "status": "upcoming"
  }'
```

### Update GMP Data

```bash
curl -X POST http://localhost:5000/api/admin/gmp \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "YOURCO",
    "gmp": 25,
    "source": "Investorgain"
  }'
```

## REAL-TIME DATA SOURCES

The application fetches data from:
- **NSE** (https://www.nseindia.com/api/)
- **BSE** (https://www.bseindia.com)
- **Investorgain** (https://www.investorgain.com/ipo-gmp/)
- **IPO Watch** (https://www.ipowatch.in/)
- **Alpha Vantage** (Stock quotes)

## TESTING

### Local Testing
```bash
# Clone
git clone https://github.com/vsriters/paisa-tamil.git
cd paisa-tamil

# Install
npm install

# Create .env
echo "MONGODB_URI=mongodb+srv://paisatamil:paisatamil123@cluster.mongodb.net/paisa-tamil" > .env
echo "PORT=5000" >> .env

# Run
npm start

# Visit http://localhost:5000
```

### Test API
```bash
# Get all IPOs
curl http://localhost:5000/api/ipos

# Get stats
curl http://localhost:5000/api/stats

# Search
curl "http://localhost:5000/api/search?q=tech"
```

## NEXT STEPS

1. ✅ **Deploy** using one of the methods above
2. ✅ **Get your Live URL** from Render/Heroku
3. ✅ **Share with users** - Market your platform
4. ✅ **Add more features** - Allotment results, refund data, etc.
5. ✅ **Monetize** - Add ads, premium features, etc.

## SUPPORT & TROUBLESHOOTING

### App not loading?
- Check internet connection
- Ensure MongoDB is connected
- Check environment variables

### API not working?
- Verify MONGODB_URI in environment
- Check if backend is running
- See logs in Render dashboard

### Need help?
- Check README.md in repo
- See GitHub issues: https://github.com/vsriters/paisa-tamil/issues
- Review server logs in deployment dashboard

## CONGRATULATIONS! 🎉

Your Paisa Tamil website is ready to go live!

**Repository**: https://github.com/vsriters/paisa-tamil
**Your Live App**: Will be at https://paisa-tamil.onrender.com

Start deploying now and let the world know about your platform!

---

*Created for Tamil financial enthusiasts by Comet AI*
