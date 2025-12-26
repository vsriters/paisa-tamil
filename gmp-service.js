// GMP & IPO Data Tracking Service with Real APIs
const axios = require('axios');
const cheerio = require('cheerio');

class GMPTracker {
  constructor() {
    this.gmpSources = [
      'https://www.investorgain.com/ipo-gmp/',
      'https://www.ipowatch.in/ipo-gmp/',
      'https://www.bluesalt.in/ipo-gmp-live-tracking/',
      'https://marketexpress.in/ipo-gmp/'
    ];
    this.ipOSources = [
      'https://www.bseindia.com/corporates/List_Scrips.aspx?page=1&expandable=4',
      'https://www.nseindia.com/ipo-calendar'
    ];
  }

  // Fetch GMP data from multiple sources
  async fetchGMPFromSources() {
    const gmpData = {};
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };

    for (const source of this.gmpSources) {
      try {
        console.log(`Fetching GMP from: ${source}`);
        const response = await axios.get(source, { headers, timeout: 8000 });
        const $ = cheerio.load(response.data);

        // Parse GMP table data
        $('table tbody tr').each((index, element) => {
          try {
            const cells = $(element).find('td');
            if (cells.length >= 3) {
              const ipoName = $(cells[0]).text().trim().toUpperCase();
              const gmpValue = parseInt($(cells[1]).text().replace(/[^0-9-]/g, '')) || 0;
              const gmpPercent = parseFloat($(cells[2]).text().replace(/[^0-9.-%]/g, '')) || 0;

              if (ipoName && gmpValue) {
                gmpData[ipoName] = {
                  gmp: gmpValue,
                  gmpPercent,
                  source,
                  timestamp: new Date(),
                  lastUpdated: new Date()
                };
              }
            }
          } catch (rowError) {
            console.log('Row parse error:', rowError.message);
          }
        });
      } catch (sourceError) {
        console.log(`Error fetching from ${source}:`, sourceError.message);
      }
    }

    return gmpData;
  }

  // Fetch NSE IPO data
  async fetchNSEIPOData() {
    try {
      const response = await axios.get('https://www.nseindia.com/api/ipo-calendar', {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.log('NSE IPO fetch error:', error.message);
      return null;
    }
  }

  // Fetch BSE IPO data
  async fetchBSEIPOData() {
    try {
      const response = await axios.get(
        'https://www.bseindia.com/investors/appFiles/EventNotices.html',
        { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 }
      );
      const $ = cheerio.load(response.data);
      const ipos = [];

      $('table tbody tr').each((index, element) => {
        const cells = $(element).find('td');
        if (cells.length >= 4) {
          ipos.push({
            companyName: $(cells[0]).text().trim(),
            issueSize: $(cells[1]).text().trim(),
            openDate: $(cells[2]).text().trim(),
            closeDate: $(cells[3]).text().trim()
          });
        }
      });

      return ipos;
    } catch (error) {
      console.log('BSE IPO fetch error:', error.message);
      return [];
    }
  }

  // Fetch real-time stock data from free API
  async fetchStockData(symbol) {
    try {
      // Using Alpha Vantage free API
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: 'demo' // Replace with actual API key
        },
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.log(`Stock data fetch error for ${symbol}:`, error.message);
      return null;
    }
  }

  // Fetch market indices (NIFTY 50, SENSEX)
  async fetchMarketIndices() {
    try {
      const response = await axios.get('https://www.nseindia.com/api/equity-indices?index=NIFTY%2050', {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 8000
      });
      return response.data;
    } catch (error) {
      console.log('Market indices fetch error:', error.message);
      return null;
    }
  }

  // Process and aggregate GMP data
  async processGMPData() {
    const gmpData = await this.fetchGMPFromSources();
    const processedData = {};

    for (const [ipoSymbol, data] of Object.entries(gmpData)) {
      processedData[ipoSymbol] = {
        gmp: data.gmp,
        gmpPercent: data.gmpPercent,
        source: data.source,
        timestamp: data.timestamp,
        reliability: 'medium'
      };
    }

    return processedData;
  }

  // Track GMP history
  async trackGMPHistory(ipoSymbol) {
    try {
      const gmpData = await this.fetchGMPFromSources();
      if (gmpData[ipoSymbol]) {
        return {
          success: true,
          data: gmpData[ipoSymbol],
          timestamp: new Date()
        };
      }
      return { success: false, message: 'IPO not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Fetch trending IPOs (Most subscribed, highest GMP)
  async getTrendingIPOs() {
    try {
      const gmpData = await this.fetchGMPFromSources();
      const sorted = Object.entries(gmpData)
        .sort((a, b) => b[1].gmp - a[1].gmp)
        .slice(0, 10);
      return sorted;
    } catch (error) {
      console.log('Trending IPO error:', error.message);
      return [];
    }
  }
}

module.exports = new GMPTracker();
