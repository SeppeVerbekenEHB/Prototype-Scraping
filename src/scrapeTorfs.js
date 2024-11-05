const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Define the URL of the category page you want to scrape
const CATEGORY_URL = 'https://www.torfs.be/nl/heren/schoenen/boots/';

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // Set to false for debugging
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36');

    try {
        console.log(`Navigating to ${CATEGORY_URL}`);
        await page.goto(CATEGORY_URL, { waitUntil: 'networkidle2' });

        const cookieBtn = await page.$("#onetrust-reject-all-handler");
        await cookieBtn?.click();

        let currentPageNr = 0;
        const limit = Infinity;
        while (currentPageNr < limit) {
            // Wait for the next button to appear
            const nextButton = await page.$(".btn.btn-primary.px-5");
            if (!nextButton) {
                console.log("No more next button available, stopping the loop.");
                break;
            }

            // Use evaluate method to scroll into view and click the next button
            await page.evaluate(() => {
                const nextButton = document.querySelector(".btn.btn-primary.px-5");
                if (nextButton) {
                    nextButton.scrollIntoView();
                    nextButton.click();
                }
            });

            // Wait for navigation or changes after clicking the next button
            await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
            currentPageNr++;
        }


        // Extract product data
        const products = await page.evaluate(() => {
            const productElements = document.querySelectorAll('.product-tile-wrapper');
            const productList = [];

            productElements.forEach(product => {
                const nameElement = product.querySelector('.content__name .pdp-link');
                const name = nameElement ? nameElement.innerText.trim() : 'Name not found';

                const priceElement = product.querySelector('.price__sales.false .value');
                const price = priceElement ? priceElement.getAttribute('content').trim() : 'Price not found';

                const linkElement = product.querySelector('.pdp-link.brand a');
                const relativeLink = linkElement ? linkElement.getAttribute('href') : null;
                const link = relativeLink ? `https://www.torfs.be${relativeLink}` : 'Link not found';

                const image = product.querySelector('.tile-image')?.getAttribute('data-src') 
                || product.querySelector('.tile-image')?.getAttribute('src') || 'Image not found';

                if (name && price && link) {
                    productList.push({ name, price, link, image: image || 'Image not found' });
                }
            });

            return productList;
        });

        // Save data to a JSON file
        const outputPath = path.resolve(__dirname, '../output/torfs_data.json');
        fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf-8');

        console.log(`Data scraped and saved to ${outputPath}`);
    } catch (error) {
        console.error('An error occurred during scraping:', error);
    } finally {
        await browser.close();
    }
})();