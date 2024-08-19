import React from 'react';
import './OfflinePage.css'; // ملف CSS الخاص بالصفحة
import { Link } from 'react-router-dom';

const Notfound = () => {
  return (
    <div className="not-found">
      <div>
      <h1>404 - Page not found</h1>
      <p>Sorry, we couldn't find the page you were looking for</p>
      <img src="./pngwing.com (77).png" alt="Page Not Found" />
      </div>
      <br></br>
      <br></br>

      <Link to="/" className="blue_btn" >Back to Home Page</Link>

    </div>
  );
};

export default Notfound;
