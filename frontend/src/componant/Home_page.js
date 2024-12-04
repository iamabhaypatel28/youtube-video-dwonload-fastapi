import React, { useState } from 'react';
import './styles/style.css';

const HomePage = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL; // FastAPI endpoint from .env file

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!url) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch the video download link from FastAPI
      const response = await fetch(`${apiUrl}${new URLSearchParams({ url })}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download the video.');
      }

      // Extract filename from the Content-Disposition header
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = "RK-YTDownload.mp4";
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = filename;
      a.click();
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message || "Something went wrong while downloading.");
    }
  };

  return (
    <div className="container-fluid home-page text-center">
      {/* Header Section */}
      <div className="row">
        <div className="col-12">
          <header className="py-4">
            <h1 className="display-3">RK-YTDownload</h1>
          </header>
        </div>
      </div>

      {/* Input and Button Section */}
      <div className="row justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="col-md-8 mx-auto">
          <h3 className="lead mb-4"><b>Download your favorite YouTube videos quickly and easily!</b></h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control text-center"
                placeholder="Enter YouTube URL"
                aria-label="YouTube URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Downloading...' : 'Download'}
              </button>
            </div>
            {error && <div className="mt-3 text-danger">{error}</div>}
          </form>
        </div>
      </div>

      {/* About Section */}
      <footer>
        <div className="text-center">
          <h5>About Me</h5>
          <p>Hi! I'm RK, a passionate developer creating cool tools to make your life easier.</p>
          <p>
            <a
              href="https://www.instagram.com/iamabhaypatel28/"
              target="_blank"
              rel="noopener noreferrer"
              className="me-3 text-dark"
            >
              <i className="fab fa-instagram"></i> Instagram
            </a>
            <a
              href="https://www.youtube.com/channel/UCTXDB8FSDOuZ7Ok-Z7wufzQ"
              target="_blank"
              rel="noopener noreferrer"
              className="me-3 text-dark"
            >
              <i className="fab fa-youtube"></i> YouTube
            </a>
            <a
              href="mailto:your_email@example.com"
              className="me-3 text-dark"
            >
              <i className="fas fa-envelope"></i> Email
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
