import React from 'react';

function CardModal({ card, onClose }) {
    if (!card) return null; // Don't render anything if no card is selected

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-content">
                <div className="box">
                    <button
                        className="modal-close is-large"
                        aria-label="close"
                        onClick={onClose}
                    ></button>
                    <h2 className="title">{card.Title || 'Untitled'}</h2>
                    <img
                        src={`/api/assets/cards/${card.imgLocation.replace('.png', '.webp')}`}
                        alt="Card Image"
                        style={{ width: '100%' }}></img>
                    <p>
                        <strong>Description:</strong>{' '}
                        {card.Description || 'No description available.'}
                    </p>
                    <p>
                        <strong>Flavour Text:</strong> {card.FlavourText || 'None'}
                    </p>
                    <p>
                        <strong>Team:</strong> {card.Team}
                    </p>
                    <p>
                        <strong>Duplication:</strong> {card.Duplication}
                    </p>
                    <p>
                        <strong>Method:</strong> {card.Method}
                    </p>
                    <p>
                        <strong>Target:</strong> {card.Target}
                    </p>
                    <p>
                        <strong>Sectors Affected:</strong> {card.SectorsAffected}
                    </p>
                    <p>
                        <strong>Target Amount:</strong> {card.TargetAmount}
                    </p>
                    <p>
                        <strong>Blue Cost:</strong> {card.BlueCost}
                    </p>
                    <p>
                        <strong>Black Cost:</strong> {card.BlackCost}
                    </p>
                    <p>
                        <strong>Purple Cost:</strong> {card.PurpleCost}
                    </p>
                    <p>
                        <strong>Facility Point:</strong> {card.FacilityPoint}
                    </p>
                    <p>
                        <strong>Cards Drawn:</strong> {card.CardsDrawn}
                    </p>
                    <p>
                        <strong>Cards Removed:</strong> {card.CardsRemoved}
                    </p>
                    <p>
                        <strong>Effect Count:</strong> {card.EffectCount}
                    </p>
                    <p>
                        <strong>Prerequisite Effect:</strong> {card.PrerequisiteEffect}
                    </p>
                    <p>
                        <strong>Duration:</strong> {card.Duration}
                    </p>
                    <p>
                        <strong>Doom Effect:</strong> {card.DoomEffect ? 'Yes' : 'No'}
                    </p>
                    <p>
                        <strong>Dice Roll:</strong> {card.DiceRoll}
                    </p>
                    <p>
                        <strong>GUID:</strong> {card.GUID}
                    </p>
                    {card.Effects && card.Effects.length > 0 && (
                        <div>
                            <strong>Effects:</strong>
                            <ul>
                                {card.Effects.map((effect, idx) => (
                                    <li key={idx}>
                                        {Object.entries(effect).map(([key, value]) => (
                                            <div key={key}>
                                                <strong>{key}:</strong> {value}
                                            </div>
                                        ))}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CardModal;
