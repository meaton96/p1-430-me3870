import React, { useEffect, useReducer, useState } from 'react';
import CardSimple from './CardSimple';
import { fetchJsonEndpoint } from './utils/ajax.js';


function FilterMenu() {
	const [filterHeaders, setFilterHeaders] = useState([]);

	useEffect(() => {
		const getFilterHeaders = async () => {
			try {
				const data = await fetchJsonEndpoint('/api/cards/filters');
				setFilterHeaders(data);
				
			} catch (err) {
				console.error('Error:', err);
			}
		};
		getFilterHeaders();
	}, []);

	return (
		<div className='column is-one-quarter'>
			<h2 className='title'>Filters</h2>
			<ul className="menu-list">
				{filterHeaders.map((header, index) => (
					<p className="menu-label" key={`${header}-${index}`}>{header}</p>
				))}
			</ul>
		</div>
	);
}


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
		<div className='container'>
			<h1 className='title has-text-centered py-2'>Card Viewer</h1>
			<hr />
			<div className='columns'>
				<FilterMenu />
				<div className='column is-three-quarters'>
					<div className="card-container grid is-col-min-12">
						{cards.map((card, index) => (
							<CardSimple key={index} card={card} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default CardContainer;
