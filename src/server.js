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
