import React from 'react';
import { useState } from 'react';
import './styles/CardSimple.css';

function CardSimple({ card, onClick }) {
	const cardImagePath = `/api/assets/cards/${card.AssetInfo.imgLocation.replace(
		'.png',
		'.webp'
	)}`;

	const imgPath =
		card.AssetInfo.imgLocation !== ''
			? cardImagePath
			: 'https://craftypixels.com/placeholder-image/300.png/';

	return (
		<div
			className="card cell"
			style={{ minHeight: '600px', cursor: 'pointer' }}
			onClick={onClick}
		>
			<div className="card-header">
				<div className="card-title card-header-title">
					{card.Title || 'Untitled'}
				</div>
				<div className="cost-container">
					<div className="circle blueMeeple">{card.Cost.BlueCost}</div>
					<div className="circle blackMeeple">{card.Cost.BlackCost}</div>
					<div className="circle purpleMeeple">{card.Cost.PurpleCost}</div>
				</div>
			</div>
			<div className="card-image">
				<img src={imgPath} alt="Card Image" style={{ width: '100%' }} />
			</div>
			<div className="card-content">
				<div
					className={`description-box ${
						card.DoomEffect === 'TRUE' ? 'doom-bg' : ''
					}`}
				>
					{card.Description || 'No description available.'}
				</div>
			</div>
			<div className="flavor-box card-footer">
				<div className="flavour-text">{card.FlavourText || ''}</div>
			</div>
		</div>
	);
}

export default CardSimple;
