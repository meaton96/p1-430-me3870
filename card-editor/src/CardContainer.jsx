import React, { useEffect, useState } from 'react';
import CardSimple from './CardSimple';
import { fetchJsonEndpoint } from './utils/ajax.js';
function CardContainer() {
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const getAllCards = async () => {
			try {
				const data = await fetchJsonEndpoint('/api/cards/all');
				setCards(data);
			} catch (err) {
				console.error('Error:', err);
				setError(`Failed to load card data: ${err.message}`);
			} finally {
				setLoading(false);
			}
		};
		getAllCards();
	}, []);


	if (loading) {
		return <div id="loading">Loading card data...</div>;
	}

	if (error) {
		return <div id="error" style={{ color: 'red' }}>{error}</div>;
	}

	return (
		<div className="card-container grid is-col-min-12">
			{cards.map((card, index) => (
				<CardSimple key={index} card={card} />
			))}
		</div>
	);
}

export default CardContainer;
