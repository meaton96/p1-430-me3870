import { React, useState } from 'react';
import EditableField from './EditableField';
import EditableTextArea from './EditableTextArea';
import './styles/CardModal.css';

function CardModal({ card, onClose, onDelete }) {
    if (!card) return null; // Don't render anything if no card is selected
    const [isEditing, setIsEditing] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [error, setError] = useState('');
    const [cardDeleted, setCardDeleted] = useState(false);
    const [editedCard, setEditedCard] = useState({ ...card }); // Copy of the card for editing

    //todo add all effects 
    const predefinedEffects = [
        { EffectType: 'ModifyPoints', EffectTarget: 'All', EffectMagnitude: '1' },
        { EffectType: 'ReduceCost', EffectTarget: 'Facility', EffectMagnitude: '2' },
    ];

    //handles pressing the delete button
    const handleDeleteCardClick = () => {
        //create a confirmation dialog
        if (window.confirm('Are you sure you want to delete this card?')) {
            //send a DELETE request to the server
            fetch(`/api/cards/${card.GUID}`, {
                method: 'DELETE',
            })
                .then((response) => {//check if the request was successful
                    if (response.ok) { //204
                        setCardDeleted(true);
                        onDelete(card.GUID); //pass state to parent
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

    //handles pressing the save button
    const handleSaveCard = () => {
        setIsEditing(false);
        return;
        //TODO:
        // Validate the card data if necessary
        fetch(`/api/cards/${editedCard.GUID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedCard),
        })
            .then((response) => {
                if (response.ok) {
                    // Update was successful
                    setIsEditing(false);
                    // Optionally, update the parent component or state
                } else {
                    // Handle error
                    setError('Failed to save card with status: ' + response.status);
                }
            })
            .catch((error) => {
                setError('Failed to save card: ' + error.message);
            });
    };
    const handleInputChange = (e, field) => {
        let value;
        if (e.target.type === 'number') {
            value = parseFloat(e.target.value) || 0;
        } else if (e.target.type === 'checkbox') {
            value = e.target.checked;
        } else {
            value = e.target.value;
        }
        setEditedCard((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleEffectChange = (idx, field, value) => {
        const updatedEffects = [...editedCard.Effects];
        updatedEffects[idx] = {
            ...updatedEffects[idx],
            [field]: value,
        };
        setEditedCard((prev) => ({
            ...prev,
            Effects: updatedEffects,
        }));
    };

    const getImageSource = (imgLocation) => {
        if (imgLocation) {
            return `/api/assets/cards/${card.imgLocation.replace(
                '.png',
                '.webp'
            )}`;
        }
        return 'https://craftypixels.com/placeholder-image/300.png/';

    }

    //show the card data as un editable text
    const renderCardData = () => {
        return (<>
            <h2 className="title">{card.Title || 'Untitled'}</h2>
            <img className='is-flex is-align-items-center is-justify-content-center m-auto mb-3'
                src={getImageSource(card.imgLocation.replace('.png', '.webp'))}
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
                <button style={{ width: "10rem" }} className="button is-primary m-1" onClick={handleToggleEdit}>Edit Card</button>
                <button style={{ width: "10rem" }} className="button is-danger m-1" onClick={handleDeleteCardClick}>Delete Card</button>
            </div>
        </>);
    }

    const renderEditCardData = () => {
        const fieldDefinitions = [
            { label: "Title", field: "Title", type: "text" },
            // { label: "Flavour Text", field: "FlavourText", type: "text" },
            { label: "Team", field: "Team", type: "text" },
            { label: "Duplication", field: "Duplication", type: "number" },
            { label: "Method", field: "Method", type: "text" },
            { label: "Target", field: "Target", type: "text" },
            { label: "Sectors Affected", field: "SectorsAffected", type: "text" },
            { label: "Target Amount", field: "TargetAmount", type: "number" },
            { label: "Blue Cost", field: "BlueCost", type: "number" },
            { label: "Black Cost", field: "BlackCost", type: "number" },
            { label: "Purple Cost", field: "PurpleCost", type: "number" },
            { label: "Facility Point", field: "FacilityPoint", type: "number" },
            { label: "Cards Drawn", field: "CardsDrawn", type: "number" },
            { label: "Cards Removed", field: "CardsRemoved", type: "number" },
            { label: "Effect Count", field: "EffectCount", type: "number" },
            { label: "Prerequisite Effect", field: "PrerequisiteEffect", type: "text" },
            { label: "Duration", field: "Duration", type: "number" },
            { label: "Dice Roll", field: "DiceRoll", type: "number" },
            { label: "GUID", field: "GUID", type: "text", readonly: true }
        ];

        const generateNewGUID = () => {
            const newGUID = crypto.randomUUID(); // Generates a new GUID using the built-in Web API
            setEditedCard((prev) => ({
                ...prev,
                GUID: newGUID,
            }));
        };

        return (
            <>
                <h2 className="title">Edit Card</h2>

                {/* Use EditableField for all input fields */}
                {fieldDefinitions.map(({ label, field, type, readonly }) => (
                    <EditableField
                        key={field}
                        label={label}
                        type={type}
                        value={editedCard[field] || ''}
                        onChange={(e) => handleInputChange(e, field)}
                        readonly={readonly}
                    />
                ))}

                {/* Description as a TextArea */}
                <EditableTextArea
                    label="Description"
                    value={editedCard.Description || ''}
                    onChange={(e) => handleInputChange(e, 'Description')}
                />
                <EditableTextArea
                    label="Flavour Text"
                    value={editedCard.FlavourText || ''}
                    onChange={(e) => handleInputChange(e, 'FlavourText')}
                />

                {/* Doom Effect checkbox */}
                <div className="field is-horizontal">
                    <div className="field-label is-normal">
                        <label className="label">Doom Effect</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <div className="control">
                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={editedCard.DoomEffect || false}
                                        onChange={(e) => handleInputChange(e, 'DoomEffect')}
                                    />
                                    &nbsp;Is Doom Effect
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Effects */}
                {editedCard.Effects && editedCard.Effects.length > 0 && (
                    <div>
                        <strong>Effects:</strong>
                        {editedCard.Effects.map((effect, index) => (
                            <div key={index} className="box">
                                <EditableField
                                    label="Effect Type"
                                    type="text"
                                    value={effect.EffectType || ''}
                                    onChange={(e) => handleEffectChange(index, 'EffectType', e.target.value)}
                                />
                                <EditableField
                                    label="Effect Target"
                                    type="text"
                                    value={effect.EffectTarget || ''}
                                    onChange={(e) => handleEffectChange(index, 'EffectTarget', e.target.value)}
                                />
                                <EditableField
                                    label="Effect Magnitude"
                                    type="number"
                                    value={effect.EffectMagnitude || 0}
                                    onChange={(e) => handleEffectChange(index, 'EffectMagnitude', e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="is-flex is-align-items-center is-justify-content-center">
                    <button
                        style={{ width: '10rem' }}
                        className="button is-primary m-1"
                        onClick={handleSaveCard}
                    >
                        Save Card
                    </button>
                    <button
                        style={{ width: '10rem' }}
                        className="button is-danger m-1"
                        onClick={handleDeleteCardClick}
                    >
                        Delete Card
                    </button>
                </div>
            </>
        );
    };

    // Render the modal content based on the card state
    const renderModalContent = () => {
        if (cardDeleted) {
            return (
                <div className="has-text-centered">
                    <button
                        className="button is-primary"
                        style={{ width: '100%' }}
                        onClick={onClose}
                    >
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
        } else if (isEditing) {
            return renderEditCardData();
        } else {
            return renderCardData();
        }
    };

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className={`modal-content`}>
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
