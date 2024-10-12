import React, { useState } from 'react';
import FilterMenu from './FilterMenu';
import CardContainer from './CardContainer';

function CardViewer() {
	const [selectedFilters, setSelectedFilters] = useState({});
	const [apiUrl, setApiUrl] = useState('');
	const [searchString, setSearchString] = useState('');
	const [isAddingNewCard, setIsAddingNewCard] = useState(false);
	const [selectedCard, setSelectedCard] = useState(null);
	const [isEditing, setIsEditing] = useState(false); // State for editing a card

	const handleAddNewCardClick = () => {
		const defaultCard = {
			Team: 'Blue',
			Duplication: 0,
			Target: 'None',
			SectorsAffected: 'Any',
			TargetAmount: 0,
			Title: '',
			AssetInfo: {
				imgRow: 0,
				imgCol: 0,
				bgRow: 0,
				bgCol: 0,
				imgLocation: ''
			},
			Cost: {
				BlueCost: 0,
				BlackCost: 0,
				PurpleCost: 0
			},
			FlavourText: '',
			Description: '',
			GUID: '',
			Action: {
				Method: 'None',
				MeeplesChanged: 0,
				MeepleIChange: 0,
				PrerequisiteEffect: '',
				Duration: 0,
				CardsDrawn: 0,
				CardsRemoved: 0,
				DiceRoll: 0,
				EffectCount: 0,
				Effects: []
			},
			DoomEffect: false
		};
		setSelectedCard(defaultCard); 
		setIsEditing(true);
		setIsAddingNewCard(true); 
	};
	

	return (
		<div className='container'>
			{/* <h1 className='title has-text-centered py-2'>Card Viewer</h1> */}
			<div className='columns is flex pt-1'>
				<span className='column is-one-third mx-1'>{apiUrl}</span>
				<span className='column is-one-third mx-1 has-text-centered'>
					<button
						className='button is-primary'
						onClick={handleAddNewCardClick}>Add New Card</button>
				</span>
				<span className='column is-one-third mx-1'>
					<input
						className='input has-text-right'
						type='text'
						placeholder='Search by title'
						onChange={(e) => setSearchString(e.target.value)}
					/>
				</span>
			</div>
			<hr />

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
