import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const Cotesting = () => {

  const [incomess, setIncomess] = useState([]);
  const tokenoo = localStorage.getItem("token");

  useEffect(() => {
    const getIncomess = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/income/get-income`, {
          headers: { 'auth-company': tokenoo },
      })
      setIncomess(response.data)
      } catch (error) {console.error(error);}
      };
    getIncomess();
  }, []);

  const generatePDFincome = () => {
    const doc = new jsPDF();
    doc.text('Incomes', 14, 15);

    incomess.forEach((income, index) => {
      doc.text(`Income ${index + 1}: ${income.title } || ${income.amount} || ${income.createdAt}`, 10, 30 + (index * 10) , { encoding: 'unicode' });
    });

    doc.save('incomes.pdf');
  };
  
  return (
    <div>
      <button onClick={generatePDFincome}>Generate PDF</button>
    </div>
  );
};

export default Cotesting;
