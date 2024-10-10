import { React, useState } from 'react';

function CardModal({ card, onClose, onDelete }) {
    if (!card) return null; // Don't render anything if no card is selected
    const [isEditing, setIsEditing] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [error, setError] = useState('');
    const [cardDeleted, setCardDeleted] = useState(false);

    const handleDeleteCardClick = () => {
        if (window.confirm('Are you sure you want to delete this card?')) {
            fetch(`/api/cards/${card.GUID}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) { //204
                        setCardDeleted(true); 
                        onDelete(card.GUID);
                    } else {
                        setDeleteError(true);
                        setError('Failed to delete card with status: ' + response.status);
                    }
                })
                .catch((error) => {
                    setDeleteError(true);
                    setError('Failed to delete card: ' + error.message);
                });
        }
    }

    const renderCardData = () => {
        return (<>
            <h2 className="title">{card.Title || 'Untitled'}</h2>
            <img className='is-flex is-align-items-center is-justify-content-center m-auto mb-3'
                src={`/api/assets/cards/${card.imgLocation.replace('.png', '.webp')}`}
                alt="Card Image"
                style={{ width: '50%' }}></img>
            <p className='mt-2'>
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
            <div className='is-flex is-align-items-center is-justify-content-center'>
                <button style={{ width: "10rem" }} className="button is-primary m-1" onClick={onClose}>Edit Card</button>
                <button style={{ width: "10rem" }} className="button is-danger m-1" onClick={handleDeleteCardClick}>Delete Card</button>
            </div>
        </>);
    }

     // Render the modal content based on the card state
     const renderModalContent = () => {
        if (cardDeleted) {
            return (
                <div className="has-text-centered">
                    <button className="button is-primary" style={{width:"100%"}} onClick={onClose}>
                        Card deleted successfully.
                    </button>
                </div>
            );
        } else if (deleteError) {
            return (
                <div className="notification is-danger has-text-centered">
                    {error}
                    <button className="button is-primary mt-3" onClick={onClose}>
                        Close
                    </button>
                </div>
            );
        } else {
            return renderCardData();
        }
    };

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
                    {renderModalContent()}
                </div>
            </div>
        </div>
    );
}

export default CardModal;
