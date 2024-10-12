console.log('RSS.js loaded');

async function fetchRSSFeed(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        return xmlDoc;
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return null;
    }
}

function parseRSSFeed(xmlDoc) {
    const items = xmlDoc.getElementsByTagName('item');
    const feedItems = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        feedItems.push({
            title: item.getElementsByTagName('title')[0].textContent,
            link: item.getElementsByTagName('link')[0].textContent,
            description: item.getElementsByTagName('description')[0].textContent,
        });
    }
    return feedItems;
}

function displayRSSFeed(feedItems) {
    const rssNewsElement = document.getElementById('rss-news');
    const newsContent = document.createElement('div');
    newsContent.innerHTML = '<h2>RSS News</h2>';
    const newsList = document.createElement('ul');
    feedItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a>`;
        newsList.appendChild(listItem);
    });
    newsContent.appendChild(newsList);
    rssNewsElement.innerHTML = '';
    rssNewsElement.appendChild(newsContent);
}

export async function initializeRSSFeed() {
    console.log('Initializing RSS feed');
    const rssUrl = 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml'; // Example RSS feed URL
    const xmlDoc = await fetchRSSFeed(rssUrl);
    if (xmlDoc) {
        const feedItems = parseRSSFeed(xmlDoc);
        displayRSSFeed(feedItems);
        console.log('RSS feed initialized');
    } else {
        console.error('Failed to initialize RSS feed');
    }
}

// Remove the DOMContentLoaded event listener, as we'll handle initialization in main.js
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', initializeRSSFeed);
// } else {
//     initializeRSSFeed();
// }
