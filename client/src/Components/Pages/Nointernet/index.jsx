import React, { useState, useEffect } from 'react';
import './OfflinePage.css'; // ملف CSS الخاص بالصفحة
const Nointernet = () => {
  return (
    <div className="offline-container">
      <h1 className="offline-title"> No internet connection </h1>
      <p className="offline-message"> Please make sure you are connected to the internet and try again </p>
      <img src="./pngwing.com (74).png" alt="No internet connection" className="offline-image" />
    </div>
  );
};

export default Nointernet;
