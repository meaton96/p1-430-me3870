import React, { useState } from 'react';
import FilterMenu from './FilterMenu';
import CardContainer from './CardContainer';

function CardViewer() {
	const [selectedFilters, setSelectedFilters] = useState({});
	const [apiUrl, setApiUrl] = useState(''); 

	return (
		<div className='container'>
			<h1 className='title has-text-centered py-2'>Card Viewer</h1>
			<p style={{marginTop:"-2rem", marginBottom:"-.5rem"}}>{apiUrl}</p>
			<hr />
			
			<div className='columns'>
				<FilterMenu selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
				<CardContainer
					selectedFilters={selectedFilters}
					setSelectedFilters={setSelectedFilters}
					setApiUrl={setApiUrl} />

			</div>
		</div>
	);
}

export default CardViewer;
