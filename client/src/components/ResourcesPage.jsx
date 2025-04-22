import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = '9439032c76e7429f8607e0b8965ea5e0'; // ← Replace this

const disasterKeywords = [
  'disaster', 'hurricane', 'storm', 'flood', 'tornado', 'wildfire',
  'earthquake', 'emergency', 'evacuation', 'rescue'
];

export default function ResourcesPage({ onNavigate }) {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const hotlines = [
    { name: 'FEMA Disaster Assistance', number: '1-800-621-3362' },
    { name: 'Red Cross Emergency Info', number: '1-800-733-2767' },
    { name: 'National Emergency Number (USA)', number: '911' },
    { name: 'Suicide & Crisis Lifeline', number: '988' },
  ];

  useEffect(() => {
    const loc = localStorage.getItem('userLocation') || 'USA';
    setLocation(loc);
    fetchNews(loc, 1, true);
  
    //Sync location periodically
    const syncLocation = () => {
      const newLoc = localStorage.getItem('userLocation');
      if (newLoc && newLoc !== loc) {
        setLocation(newLoc);
        fetchNews(newLoc, 1, true);
      }
    };
  
    const interval = setInterval(syncLocation, 1000);
    return () => clearInterval(interval);
  }, []);
  

  //Fetch news articles based on location and page
  const fetchNews = async (loc, pageNumber, replace = false) => {
    setLoading(true);
    setError('');
  
    if (replace) {
      setArticles([]); // Clear current articles before refetching
    }
  
    const timestamp = new Date().toISOString(); // Cache-busting param
  
    const query = encodeURIComponent(loc);
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=5&page=${pageNumber}&apiKey=${API_KEY}&_=${timestamp}`
      );
  
      const fetched = response.data.articles;
  
      if (replace) {
        setArticles(fetched);
      } else {
        setArticles((prev) => [...prev, ...fetched]);
      }
  
      setPage(pageNumber);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news articles.');
    }
  
    setLoading(false);
  };
  
  //Reset to page 1 and replace all articles
  const handleRefresh = () => {
    const loc = localStorage.getItem('userLocation') || 'USA';
    fetchNews(loc, 1, true);
  };
  
  //Load next page
  const handleLoadMore = () => {
    fetchNews(location, page + 1);
  };

  //Front end jsx code
  return (
    <div style={{ padding: '20px' }}>
      <h2>News & Resources for {location}</h2>

      <button onClick={handleRefresh} disabled={loading} style={{ marginBottom: '20px' }}>
        {loading ? 'Refreshing...' : '🔄 Refresh News'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section style={{ marginBottom: '30px' }}>
        {articles.length === 0 && !loading && <p>No news articles found.</p>}

        {articles.map((article, idx) => (
          <div key={idx} style={{ marginBottom: '20px', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}>
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '200px',
                  objectFit: 'cover',
                  borderRadius: '5px'
                }}
              />
            )}
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read full article →
            </a>
          </div>
        ))}

        {articles.length > 0 && (
          <button onClick={handleLoadMore} disabled={loading}>
            {loading ? 'Loading...' : '⬇️ Load More'}
          </button>
        )}
      </section>

      <h3>Emergency Hotlines</h3>
      <ul>
        {hotlines.map((line, idx) => (
          <li key={idx}>
            <strong>{line.name}:</strong> {line.number}
          </li>
        ))}
      </ul>
    </div>
  );
}
