import React from 'react';

function CardSimple({ card }) {
    // Helper to get team color
    const getTeamColor = (team) => {
        switch ((team || '').toLowerCase()) {
            case 'blue':
                return '#e6f2ff';
            case 'red':
                return '#ffe6e6';
            case 'white':
                return '#f9f9f9';
            default:
                return '#ffffff';
        }
    };

    const imgPath = "https://craftypixels.com/placeholder-image/300.png/";

    return (
        <div className="card">
            <div className="card-title" style={{ backgroundColor: getTeamColor(card.Team) }}>
                {card.Title || 'Untitled'}
            </div>
            <div className="card-img">
                <img src={imgPath} alt="Card Image" style={{ width: '100%' }} />
            </div>
            <div className="card-cost">
                {parseInt(card.BlueCost) > 0 && <span className="cost-item" style={{ backgroundColor: '#add8e6' }}>Blue: {card.BlueCost}</span>}
                {parseInt(card.BlackCost) > 0 && <span className="cost-item" style={{ backgroundColor: '#d3d3d3' }}>Black: {card.BlackCost}</span>}
                {parseInt(card.PurpleCost) > 0 && <span className="cost-item" style={{ backgroundColor: '#e6e6fa' }}>Purple: {card.PurpleCost}</span>}
            </div>
            <div className={`description-box ${card.DoomEffect === 'TRUE' ? 'doom-bg' : ''}`}>
                {card.Description || 'No description available.'}
            </div>
            <div className="flavor-box">
                <div className="flavour-text">{card.FlavourText || ''}</div>
            </div>
        </div>
    );
}

export default CardSimple;
