import React, { useEffect, useState } from 'react';
import CardSimple from './CardSimple';
import CardModal from './CardModal'; 
import { fetchJsonEndpoint } from './utils/ajax.js';

function CardContainer({ selectedFilters, 
						setSelectedFilters, 
						setApiUrl,
						selectedCard,
						setSelectedCard,
						isAddingNewCard,
						isEditing,
						setIsEditing,
						setIsAddingNewCard,
						searchString, 
						}) {
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	
	// const [selectedCard, setSelectedCard] = useState(null); // State for the selected card
	const [effects, setEffectList] = useState([]); // State for the list of effects

	// Fetch the cards based on the selected filters
	useEffect(() => {
		const fetchCards = async () => {
			setLoading(true);
			try {
				// Construct a query URL from the selected filters
				const queryParams = new URLSearchParams();
				for (const [field, values] of Object.entries(selectedFilters)) {
					if (values.length > 0) {
						queryParams.append(field, values.join(','));
					}
				}
				// Convert query params to URL query string
				const url = queryParams.toString()
					? `/api/cards?${queryParams.toString()}`
					: '/api/cards/all';
				const data = await fetchJsonEndpoint(url); 
				setApiUrl(url); // Set the API URL to display
				setCards(data);
			} catch (err) {
				console.error('Error:', err);
				setError(`Failed to load card data: ${err.message}`);
			} finally {
				setLoading(false);
			}
		};
		fetchCards();
	}, [selectedFilters]);

	// Fetch the list of effects
	useEffect(() => {
		const fetchEffects = async () => {
			try {
				const data = await fetchJsonEndpoint('/api/effects/all');
				if (data) {
					setEffectList(data);
				}
				else {
					console.error('Error: No effect data found');
				}
			} catch (err) {
				console.error('Error:', err);
			}
		}
		fetchEffects();
	}, [])

	// Handle removing a filter by clicking on it
	const handleRemoveFilter = (field, value) => {
		setSelectedFilters((prevFilters) => {
			const updatedFilters = { ...prevFilters };
			updatedFilters[field] = updatedFilters[field].filter((v) => v !== value);
			return updatedFilters;
		});
	};

	// Remove a card from the displayed list when deleted
	const handleDeleteCard = (guid) => {
		setCards((prevCards) => prevCards.filter((card) => card.GUID !== guid));

	};
	//update the card viewer when a card is edited
	const handleCardEdit = (updatedCard) => {
		setCards((prevCards) =>
			prevCards.map((card) =>
				card.GUID === updatedCard.GUID ? updatedCard : card
			)
		);
	};

	// Display active filters as clickable elements
	const renderActiveFilters = () => {
		const filters = Object.entries(selectedFilters).flatMap(([field, values]) =>
			values.map((value) => (
				<span
					key={`${field}-${value}`}
					className="tag is-info is-light"
					style={{ marginRight: '5px', cursor: 'pointer' }}
					onClick={() => handleRemoveFilter(field, value)}
				>
					{field}: {value} &times;
				</span>
			))
		);
		return filters.length > 0 ? (
			<div className="mb-4">
				<h4>Active Filters:</h4>
				<div>{filters}</div>
			</div>
		) : null;
	};

	if (loading) {
		return <div id="loading">Loading card data...</div>;
	}

	if (error) {
		return (
			<div id="error" style={{ color: 'red' }}>
				{error}
			</div>
		);
	}

	return (
		<div className="container">
			{renderActiveFilters()}
			<div className="card-container columns is-multiline">
				{cards && cards.length > 0 ? (
					cards.map((card, index) => (
						<div className="column is-one-third" key={index}>
							<CardSimple
								card={card}
								onClick={() => setSelectedCard(card)} // Set selected card on click
							/>
						</div>
					))
				) : (
					<div>
						<h2 className="subtitle">No cards found</h2>
					</div>
				)}
			</div>
			<CardModal
				card={selectedCard}
				onClose={() => {
					setSelectedCard(null);
					setIsEditing(false);
					setIsAddingNewCard(false);
				}}
				onDelete={handleDeleteCard}
				effectList={effects} 
				onCardEdit={handleCardEdit}
				isAddingNewCard={isAddingNewCard}
				isEditing={isEditing}
				setIsEditing={setIsEditing}
				setIsAddingNewCard={setIsAddingNewCard}
				/>
		</div>
	);
}

export default CardContainer;
