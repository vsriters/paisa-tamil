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
  { companyName: 'TechVision India', symbol: 'TECHVISION', sector: 'IT', priceRangeMin: 100, priceRangeMax: 120, estimatedPrice: 110, gmp: 25, gmpPercent: 22.7, openDate: new Date('2025-01-15'), closeDate: new Date('2025-01-17'), listingDate: new Date('2025-01-22'), status: 'upcoming', issueSize: '₹500 Cr', totalBids: 45000000, subscriptionTimes: 12.5, description: 'Leading IT Services' },
  { companyName: 'GreenEnergy Solutions', symbol: 'GREENENERGY', sector: 'Energy', priceRangeMin: 80, priceRangeMax: 100, estimatedPrice: 90, gmp: 15, gmpPercent: 16.7, openDate: new Date('2025-01-20'), closeDate: new Date('2025-01-22'), listingDate: new Date('2025-01-27'), status: 'open', issueSize: '₹300 Cr', totalBids: 32000000, subscriptionTimes: 8.3, description: 'Renewable Energy' },
  { companyName: 'FinServe India', symbol: 'FINSERVE', sector: 'Finance', priceRangeMin: 150, priceRangeMax: 180, estimatedPrice: 165, gmp: 40, gmpPercent: 24.2, openDate: new Date('2025-02-01'), closeDate: new Date('2025-02-03'), listingDate: new Date('2025-02-08'), status: 'upcoming', issueSize: '₹750 Cr', totalBids: 60000000, subscriptionTimes: 15.2, description: 'Financial Services' }
];

const sampleMainboard = [
  { companyName: 'Reliance Industries', symbol: 'RIL', sector: 'Energy', currentPrice: 2500, change: 45, changePercent: 1.83, volume: 50000000, marketCap: '₹17,50,000 Cr', pe: 24.5, dividendYield: 1.2 },
  { companyName: 'TCS', symbol: 'TCS', sector: 'IT', currentPrice: 3800, change: -25, changePercent: -0.65, volume: 35000000, marketCap: '₹14,40,000 Cr', pe: 26.3, dividendYield: 1.8 },
  { companyName: 'HDFC Bank', symbol: 'HDFCBANK', sector: 'Banking', currentPrice: 1650, change: 30, changePercent: 1.85, volume: 80000000, marketCap: '₹10,00,000 Cr', pe: 19.5, dividendYield: 2.1 }
];

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✓ Paisa Tamil Server running on port ${PORT}`));
