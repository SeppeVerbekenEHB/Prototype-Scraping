# Prototype-Scraping

A web-based application that scrapes and displays shoe data from [Torfs](https://www.torfs.be) and allows users to browse and search various shoe categories. This prototype demonstrates how to gather information dynamically from an external e-commerce website using Puppeteer.

## Features

- **Scraping Data from Torfs**: Retrieves up-to-date information on shoes directly from the Torfs website, including product names, prices, images, and links.
- **Category Selection**: Users can select between men’s and women’s shoe categories.
- **Real-Time Search**: Allows users to search for shoes by name within the displayed items.
- **Dynamic Data Presentation**: Displays scraped shoe data in a responsive, user-friendly format.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Web Scraping**: Puppeteer, for efficient scraping of JavaScript-rendered pages
- **Deployment**: Local server setup with Express

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/SeppeVerbekenEHB/Prototype-Scraping.git
   cd prototype-scraping```

2. **Install Dependencies**
   ```bash
   npm install```

3. **Run the Server**
Make sure you are inside of the **src** folder and run the server.
    ```bash
    node server.js```
The server will start on `http:localhost:3000`.

## Usage

1. Open your web browser and navigate to `http:localhost:3000`.
2. Select a gender (e.g., "Heren" for men or "Dames" for women).
3. Choose a shoe category (e.g., "Sneakers", "Boots").
4. Click "Get Latest Products" to scrape and display data.
5. Use the search bar to filter displayed items by name.

## Project Structure

- `public/`: Contains the HTML, CSS and JavaScript files for the frontend.
  - `html`: All HTML files.
    - `index.html`: Main frontend interface.
  - `css`: All CSS files.
    - `Style.css`: Main stylesheet.
  - `js`: All Javascript files.
    - `index.js`: Main Javascript for the frontend interface.
- `src`: Other Javascript files
  - `server.js`: Sets up the express server and manages scrape requests.
  - `scrapeTorfs.js`: Puppeteer script to perform scraping on Torfs.

## Code overview

- **index.js**: Handles dropdowns, triggers scraping requests, and updates the UI with retrieved product data.
- **server.js**: Routes requests, dynamically generates the URL for scraping, executes the scraper script, and returns scraped data
  to the frontend.
- **scrapeTorfs.js**: Uses Puppeteer to access the Torfs site, navigates through pages, and extracts relevant shoe data.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments

- Torfs website for providing data.
- Puppeteer team for the powerfull web scraping tool.