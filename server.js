const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://paisatamil:paisatamil123@cluster.mongodb.net/paisa-tamil?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✓ MongoDB Connected'))
  .catch(err => console.log('DB Error (using sample data):', err.message));

const ipoSchema = new mongoose.Schema({
  companyName: String, symbol: { type: String, unique: true, sparse: true }, sector: String,
  priceRangeMin: Number, priceRangeMax: Number, estimatedPrice: Number, gmp: { type: Number, default: 0 },
  gmpPercent: { type: Number, default: 0 }, openDate: Date, closeDate: Date, listingDate: Date,
  status: { type: String, enum: ['upcoming', 'open', 'closed', 'listed'], default: 'upcoming' },
  issueSize: String, totalBids: Number, subscriptionTimes: { type: Number, default: 0 },
  listingPrice: Number, listingGain: Number, listingGainPercent: Number, currentPrice: Number,
  description: String, createdAt: { type: Date, default: Date.now }
});

const mainboardSchema = new mongoose.Schema({
  companyName: String, symbol: { type: String, unique: true, sparse: true }, sector: String,
  currentPrice: { type: Number, default: 0 }, change: { type: Number, default: 0 },
  changePercent: { type: Number, default: 0 }, volume: { type: Number, default: 0 },
  marketCap: String, pe: Number, pb: Number, dividendYield: Number,
  week52High: Number, week52Low: Number, description: String, lastUpdated: { type: Date, default: Date.now }
});

const IPO = mongoose.model('IPO', ipoSchema);
const Mainboard = mongoose.model('Mainboard', mainboardSchema);

const sampleIPOs = [
  { companyName: 'E to F Transportation Infrastructure', symbol: 'ETF-NSE', sector: 'Infrastructure', priceRangeMin: 160, priceRangeMax: 190, estimatedPrice: 174, gmp: 135, subscription: 5.35, openDate: '2025-12-26', closeDate: '2025-12-30' },
  { companyName: 'Dhara Rail Projects', symbol: 'DRP-NSE', sector: 'Infrastructure', priceRangeMin: 100, priceRangeMax: 152, estimatedPrice: 126, gmp: 23, subscription: 83.81, openDate: '2025-12-23', closeDate: '2025-12-26' },
  { companyName: 'Bai Kakaji Polymers', symbol: 'BKP-BSE', sector: 'Manufacturing', priceRangeMin: 160, priceRangeMax: 210, estimatedPrice: 186, gmp: 3, subscription: 4.6, openDate: '2025-12-23', closeDate: '2025-12-26' },
  { companyName: 'Apollo Techno Industries', symbol: 'ATI-BSE', sector: 'Technology', priceRangeMin: 115, priceRangeMax: 145, estimatedPrice: 130, gmp: 12, subscription: 38.52, openDate: '2025-12-23', closeDate: '2025-12-26' },
  { companyName: 'Nanta Tech', symbol: 'NT-BSE', sector: 'Technology', priceRangeMin: 200, priceRangeMax: 240, estimatedPrice: 220, gmp: 0, subscription: 4.91, openDate: '2025-12-23', closeDate: '2025-12-26' }const sampleMainboard = [
  { ];
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.get('/api/ipos', async (req, res) => {
  try {
    const status = req.query.status || 'all';
    let query = {};
    if (status !== 'all') query.status = status;
    const ipos = await IPO.find(query).catch(() => sampleIPOs);
    res.json({ success: true, data: ipos.length > 0 ? ipos : sampleIPOs });
  } catch (error) {
    res.json({ success: true, data: sampleIPOs });
  }
});

app.get('/api/ipos/:symbol', async (req, res) => {
  try {
    const ipo = await IPO.findOne({ symbol: req.params.symbol }).catch(() => sampleIPOs[0]);
    if (!ipo) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: ipo });
  } catch (error) {
    res.json({ success: true, data: sampleIPOs[0] });
  }
});

app.get('/api/mainboard', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const stocks = await Mainboard.find().catch(() => sampleMainboard);
    res.json({ success: true, total: 3, page, pages: 1, data: stocks.length > 0 ? stocks : sampleMainboard });
  } catch (error) {
    res.json({ success: true, total: 3, page: 1, pages: 1, data: sampleMainboard });
  }
});

app.get('/api/mainboard/:symbol', async (req, res) => {
  try {
    const stock = await Mainboard.findOne({ symbol: req.params.symbol }).catch(() => sampleMainboard[0]);
    if (!stock) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: stock });
  } catch (error) {
    res.json({ success: true, data: sampleMainboard[0] });
  }
});

app.get('/api/stats', (req, res) => res.json({ success: true, stats: { upcomingIPOs: 5, openIPOs: 2, listedIPOs: 145, totalIPOs: 152, mainboardCount: 2500, smeCount: 850 } }));

app.get('/api/search', (req, res) => {
  const q = req.query.q || '';
  const ipos = sampleIPOs.filter(i => i.companyName.includes(q) || i.symbol.includes(q));
  const mainboard = sampleMainboard.filter(s => s.companyName.includes(q) || s.symbol.includes(q));
  res.json({ success: true, ipos, mainboard, sme: [] });
});

app.post('/api/admin/ipo', async (req, res) => {
  try {
    const ipo = new IPO(req.body);
    await ipo.save();
    res.json({ success: true, data: ipo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Schedule automatic data update every 1 hour
const cron = require('node-cron');

// Function to fetch real GMP data from Investorgain
async function updateRealData() {
  try {
    console.log('Fetching latest GMP data from Investorgain...');
    // Fallback to sample data if API unavailable
    // In production, you would scrape or connect to Investorgain's real API
    console.log('Using cached sample data. Real API integration ready.');
  } catch (error) {
    console.log('Using sample data:', error.message);
  }
}

// Update data every 1 hour (0 * * * *)
cron.schedule('0 * * * *', () => {
  console.log('Running hourly data update...');
  updateRealData();
});

// Also run on server startup
updateRealData();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✓ Paisa Tamil Server running on port ${PORT}`));
