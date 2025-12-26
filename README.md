# Paisa Tamil - IPO & GMP Tracking Platform

## வரவேற்கம் (Welcome)!

Paisa Tamil is a comprehensive IPO and stock market tracking platform in Tamil language. It provides real-time GMP (Grey Market Premium) tracking, IPO data, mainboard & SME stock information.

## Features

✅ **Real-Time GMP Tracking** - Track Grey Market Premium from multiple sources
✅ **IPO Calendar** - Upcoming, ongoing, and listed IPOs
✅ **Mainboard Stocks** - Track BSE/NSE listed companies
✅ **SME Board Stocks** - Small and Medium Enterprise listings
✅ **Market Statistics** - NIFTY 50, SENSEX, and market data
✅ **Multi-Source Data Integration** - NSE, BSE, Investorgain, MoneyControl APIs
✅ **GMP History** - Track GMP trends over time
✅ **Tamil UI** - Complete Tamil language support

## Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Frontend**: HTML5 + CSS3 + JavaScript + Bootstrap
- **APIs**: NSE, BSE, Investorgain, Alpha Vantage
- **Deployment**: Heroku, Render, Railway

## Installation & Deployment

### Option 1: Deploy on Render (Recommended - Free)

1. **Fork/Clone this repository**
2. **Go to https://render.com**
3. **Click "New" -> "Web Service"**
4. **Connect your GitHub account**
5. **Select `paisa-tamil` repository**
6. **Configure:**
   - Name: `paisa-tamil`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
7. **Add Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://paisatamil:paisatamil123@cluster.mongodb.net/paisa-tamil
   NODE_ENV=production
   ```
8. **Click "Create Web Service"**
9. **Your app will be live at**: `https://paisa-tamil.onrender.com`

### Option 2: Deploy on Heroku

1. **Create Heroku account at https://heroku.com**
2. **Install Heroku CLI**
3. **Run these commands**:
   ```bash
   heroku login
   heroku create paisa-tamil
   heroku config:set MONGODB_URI=your_mongodb_uri
   git push heroku main
   ```
4. **Your app will be live at**: `https://paisa-tamil.herokuapp.com`

### Option 3: Deploy on Railway

1. **Go to https://railway.app**
2. **Click "New Project"**
3. **Select "Deploy from GitHub"**
4. **Connect repository**
5. **Add environment variables**
6. **Deploy!**

## Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/paisa-tamil.git
cd paisa-tamil

# Install dependencies
npm install

# Create .env file
echo 'MONGODB_URI=mongodb+srv://paisatamil:paisatamil123@cluster.mongodb.net/paisa-tamil' > .env
echo 'PORT=5000' >> .env

# Start server
npm start

# Visit http://localhost:5000
```

## API Endpoints

### IPO Routes
- `GET /api/ipos` - Get all IPOs
- `GET /api/ipos/:symbol` - Get specific IPO
- `GET /api/ipos?status=upcoming|open|closed|listed` - Filter by status

### Stock Routes
- `GET /api/mainboard` - Get mainboard stocks (paginated)
- `GET /api/mainboard/:symbol` - Get specific stock
- `GET /api/sme` - Get SME stocks

### GMP Routes
- `GET /api/gmp-history/:symbol` - Get GMP history
- `POST /api/admin/gmp` - Update GMP data

### General Routes
- `GET /api/stats` - Market statistics
- `GET /api/search?q=query` - Search IPOs & stocks

## Real Data Sources

The application integrates with:
- **NSE API** - https://www.nseindia.com/api/
- **BSE Website** - https://www.bseindia.com
- **Investorgain** - https://www.investorgain.com/ipo-gmp/
- **IPO Watch** - https://www.ipowatch.in/ipo-gmp/
- **Alpha Vantage** - Stock market data

## GMP Data Tracking

The platform automatically fetches GMP data from multiple sources:
1. Investorgain.com
2. IPOWatch.in
3. BlueSalt GMP Tracker
4. Market Express IPO GMP

## Environment Variables

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=production
```

## File Structure

```
paisa-tamil/
├── server.js              # Main backend server
├── gmp-service.js         # GMP tracking service
├── package.json           # Dependencies
├── Procfile              # Heroku deployment
├── public/               # Frontend files
│   ├── index.html
│   ├── ipos.html
│   ├── mainboard.html
│   ├── css/
│   └── js/
└── README.md
```

## Live Demo

**Your Paisa Tamil URL**: https://paisa-tamil.onrender.com

## Support

For issues or feature requests, create an issue on GitHub.

## License

MIT License - feel free to use this for commercial or personal projects.

---

**Created with ❤️ for Tamil Finance Enthusiasts**
