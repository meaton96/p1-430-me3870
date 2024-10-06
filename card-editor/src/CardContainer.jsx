import React, { useEffect, useState } from 'react';
import CardSimple from './CardSimple';

function CardContainer() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/all-cards');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCards(data);
      } catch (err) {
        console.error('Error:', err);
        setError(`Failed to load card data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) {
    return <div id="loading">Loading card data...</div>;
  }

  if (error) {
    return <div id="error" style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="card-container">
      {cards.map((card, index) => (
        <CardSimple key={index} card={card} />
      ))}
    </div>
  );
}

export default CardContainer;
