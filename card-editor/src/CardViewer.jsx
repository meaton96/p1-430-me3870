import React, { useEffect, useState } from 'react';
import FilterMenu from './FilterMenu';
import CardContainer from './CardContainer';
import { fetchJsonEndpoint } from './utils/ajax';

function CardViewer() {
	const [selectedFilters, setSelectedFilters] = useState({});
	const [apiUrl, setApiUrl] = useState('');
	const [searchString, setSearchString] = useState('');
	const [isAddingNewCard, setIsAddingNewCard] = useState(false);
	const [selectedCard, setSelectedCard] = useState(null);
	const [isEditing, setIsEditing] = useState(false); // State for editing a card
	const [defaultCard, setDefaultCard] = useState(null);

	useEffect(() => {
		const fetchDefault = async () => {
			try {
				const data = await fetchJsonEndpoint('/api/cards/default');
				if (data) {
					//console.log(data);
					setDefaultCard(data);
				}
				else {
					console.error('Failed to load default card data');
				}

			} catch (err) {
				console.error('Error:', err);
			}
			
		};
		fetchDefault();

	}, []);

	const handleAddNewCardClick = () => {
		//console.log(defaultCard);
		setSelectedCard(defaultCard); 
		setIsEditing(true);
		setIsAddingNewCard(true); 
	};
	

	return (
		<div className='container'>
			
			{/* <h1 className='title has-text-centered py-2'>Card Viewer</h1> */}
			<div className='columns is-flex p-2 m-1'>
				<span className='column is-one-third mx-1 is-flex is-align-items-center'>{apiUrl}</span>
				<span className='column is-one-third mx-1 has-text-centered'>
					<button
						className='button is-primary mx-2'
						onClick={handleAddNewCardClick}>Add New Card
						</button>
						<button
						className='button is-secondary mx-2'
						onClick={() => setSelectedFilters([])}>Clear Filters
						</button>
				</span>
				<span className='column is-one-third mx-1'>
					<input
						className='input has-text-right mr-4'
						type='text'
						placeholder='Search by title'
						onChange={(e) => setSearchString(e.target.value)}
						
					/>
				</span>
			</div>
			

			<div className='columns'>
				<FilterMenu selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
				<CardContainer
					selectedFilters={selectedFilters}
					setSelectedFilters={setSelectedFilters}
					selectedCard={selectedCard}
					setSelectedCard={setSelectedCard}
					setApiUrl={setApiUrl}
					searchString={searchString}
					isAddingNewCard={isAddingNewCard}
					setIsAddingNewCard={setIsAddingNewCard}
					isEditing={isEditing}
					setIsEditing={setIsEditing} />

			</div>
		</div>
	);
}

export default CardViewer;
