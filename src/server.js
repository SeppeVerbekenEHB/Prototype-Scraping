const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the "public" directory (which contains html, css, js)
app.use(express.static(path.join(__dirname, '../public')));

// Serve index.html when the root URL is accessed
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html', 'index.html'));
});

// Route to trigger scraping
app.get('/scrape', (req, res) => {

    // Get the selected category from query params
    const category = req.query.category || 'sneakers';
    const gender = req.query.gender || 'heren';
    console.log(`Scraping category: ${category} for gender: ${gender}`);

    // Modify the URL based on the selected category
    const CATEGORY_URLS = {
        heren: {
            'sneakers': 'https://www.torfs.be/nl/heren/schoenen/sneakers/',
            'geklede-schoenen': 'https://www.torfs.be/nl/heren/schoenen/geklede-schoenen/',
            'lage-schoenen': 'https://www.torfs.be/nl/heren/schoenen/lage-schoenen/',
            'hoge-schoenen': 'https://www.torfs.be/nl/heren/schoenen/hoge-schoenen/',
            'boots': 'https://www.torfs.be/nl/heren/schoenen/boots/',
            'pantoffels': 'https://www.torfs.be/nl/heren/schoenen/pantoffels/',
            'outdoorschoenen': 'https://www.torfs.be/nl/heren/schoenen/outdoorschoenen/',
            'sandalen-en-slippers': 'https://www.torfs.be/nl/heren/schoenen/sandalen-en-slippers/'
        },
        dames: {
            'sneakers': 'https://www.torfs.be/nl/dames/schoenen/sneakers/',
            'enkellaarsjes': 'https://www.torfs.be/nl/dames/schoenen/enkellaarsjes/',
            'lage-schoenen': 'https://www.torfs.be/nl/dames/schoenen/lage-schoenen/',
            'pumps': 'https://www.torfs.be/nl/dames/schoenen/pumps/',
            'laarzen': 'https://www.torfs.be/nl/dames/schoenen/laarzen/',
            'boots': 'https://www.torfs.be/nl/dames/schoenen/boots/',
            'pantoffels': 'https://www.torfs.be/nl/dames/schoenen/pantoffels/',
            'outdoorschoenen': 'https://www.torfs.be/nl/dames/schoenen/outdoorschoenen/',
            'sandalen': 'https://www.torfs.be/nl/dames/schoenen/sandalen/',
            'slippers': 'https://www.torfs.be/nl/dames/schoenen/slippers/'
        }
    };

    const categoryUrl = CATEGORY_URLS[gender][category];
    console.log('Category URL:', categoryUrl);

    // Ensure the category URL exists
    if (!categoryUrl) {
        return res.status(400).json({ message: 'Invalid category selected' });
    }


    const scrapeScriptPath = path.resolve(__dirname, 'scrapeTorfs.js');

    exec(`node ${scrapeScriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing scrape: ${error.message}`);
            return res.status(500).json({ message: 'Scraping failed', error: error.message });
        }
        console.log('Scraping completed successfully');

        // Correct path for JSON data file after scraping, within the 'output' folder
        const dataPath = path.resolve(__dirname, '../output', 'torfs_data.json');

        // Confirm the file exists before reading
        if (!fs.existsSync(dataPath)) {
            console.error('File does not exist:', dataPath);
            return res.status(500).json({ message: 'Data file not found' });
        }

        // Read and return the JSON data
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading data:', err);
                return res.status(500).json({ message: 'Failed to load data' });
            }

            try {
                const products = JSON.parse(data); // Parse JSON data
                res.json(products); // Send parsed JSON response
            } catch (parseError) {
                console.error('Error parsing JSON data:', parseError);
                res.status(500).json({ message: 'Data format error', error: parseError.message });
            }
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
