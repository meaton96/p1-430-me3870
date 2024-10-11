import { React, useState } from 'react';
import EditableField from './EditableField';
import EditableTextArea from './EditableTextArea';
import './styles/CardModal.css';

function CardModal({ card, onClose, onDelete, effectList }) {
    if (!card) return null; // Don't render anything if no card is selected
    const [isEditing, setIsEditing] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [error, setError] = useState('');
    const [cardDeleted, setCardDeleted] = useState(false);
    const [editedCard, setEditedCard] = useState({ ...card }); // Copy of the card for editing

    // Function to the field value from the obj object even if its a nested field
    const getNestedValue = (obj, field) => field.
        split('.').
        reduce((o, key) => (o && o[key] !== undefined) ? o[key] : '', obj);



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
        setIsEditing(false); //TODO: remove after implementing endpoint
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

    //handles changing the input fields
    const handleInputChange = (e, field) => {
        let value;
        if (e.target.type === 'number') {
            value = parseFloat(e.target.value) || 0;
        } else if (e.target.type === 'checkbox') {
            value = e.target.checked;
        } else {
            value = e.target.value;
        }

        const fieldParts = field.split('.');

        setEditedCard((prev) => {
            let updatedCard = { ...prev };
            let currentField = updatedCard;


            for (let i = 0; i < fieldParts.length - 1; i++) {
                currentField = currentField[fieldParts[i]];
            }

            currentField[fieldParts[fieldParts.length - 1]] = value;

            return updatedCard;
        });
    };


    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleEffectChange = (idx, field, value) => {
        const updatedEffects = [...(editedCard.Action?.Effects || [])];
        updatedEffects[idx] = {
            ...updatedEffects[idx],
            [field]: value,
        };
        setEditedCard((prev) => ({
            ...prev,
            Action: { ...prev.Action, Effects: updatedEffects },
        }));
    };


    const getImageSource = (imgLocation) => {
        if (imgLocation) {
            return `/api/assets/cards/${card.AssetInfo.imgLocation.replace(
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
                src={getImageSource(card.AssetInfo.imgLocation.replace('.png', '.webp'))}
                alt="Card Image"
                style={{ width: '50%' }}></img>
            <p className="mt-2">
                <strong>Description:</strong> {card.Description || 'No description available.'}
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
                <strong>Method:</strong> {card.Action?.Method || 'None'}
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
                <strong>Blue Cost:</strong> {card.Cost?.BlueCost}
            </p>
            <p>
                <strong>Black Cost:</strong> {card.Cost?.BlackCost}
            </p>
            <p>
                <strong>Purple Cost:</strong> {card.Cost?.PurpleCost}
            </p>
            <p>
                <strong>Facility Point:</strong> {card.Action?.FacilityPoint || 0}
            </p>
            <p>
                <strong>Cards Drawn:</strong> {card.Action?.CardsDrawn || 0}
            </p>
            <p>
                <strong>Cards Removed:</strong> {card.Action?.CardsRemoved || 0}
            </p>
            <p>
                <strong>Effect Count:</strong> {card.Action?.EffectCount || 0}
            </p>
            <p>
                <strong>Prerequisite Effect:</strong> {card.Action?.PrerequisiteEffect || 'None'}
            </p>
            <p>
                <strong>Duration:</strong> {card.Action?.Duration || 0}
            </p>
            <p>
                <strong>Doom Effect:</strong> {card.DoomEffect ? 'Yes' : 'No'}
            </p>
            <p>
                <strong>Dice Roll:</strong> {card.Action?.DiceRoll || 0}
            </p>
            <p>
                <strong>GUID:</strong> {card.GUID}
            </p>

            {card.Action?.Effects && card.Action.Effects.length > 0 && (
                <div>
                    <strong>Effects:</strong>
                    <div className="mt-1 is-flex">
                        {card.Action.Effects.map((effectID, idx) => {
                            const effect = effectList.find(e => e.EffectID === effectID);

                            if (!effect) {
                                return (
                                    <div key={idx} className="effect-item p-1 my-1 mb-1">
                                        {`${idx + 1}. Unknown effect: ${effectID}`}
                                    </div>
                                );
                            }

                            const { EffectType, EffectPointTarget, EffectMagnitude } = effect.Effect;
                            const isNegative = parseInt(EffectMagnitude, 10) < 0;

                            return (
                                <div key={idx} className={`effect-item ${isNegative ? 'negative-effect' : 'positive-effect'}`}>
                                    <strong>{idx + 1}.</strong> {EffectType}
                                    {EffectPointTarget && (
                                        <>
                                            {' on '}
                                            <span className="effect-target">{EffectPointTarget}</span>
                                        </>
                                    )}
                                    {EffectMagnitude && (
                                        <>
                                            {' '}
                                            <span className="has-font-weight-bold">{EffectMagnitude}</span>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
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
            { label: "Team", field: "Team", type: "text" },
            { label: "Number in Deck", field: "Duplication", type: "number" },
            { label: "Method", field: "Action.Method", type: "text" },
            { label: "Target", field: "Target", type: "text" },
            { label: "Sectors Affected", field: "SectorsAffected", type: "text" },
            { label: "Target Amount", field: "TargetAmount", type: "number" },
            { label: "Blue Cost", field: "Cost.BlueCost", type: "number" },
            { label: "Black Cost", field: "Cost.BlackCost", type: "number" },
            { label: "Purple Cost", field: "Cost.PurpleCost", type: "number" },
            { label: "Facility Point", field: "Action.FacilityPoint", type: "number" },
            { label: "Cards Drawn", field: "Action.CardsDrawn", type: "number" },
            { label: "Cards Removed", field: "Action.CardsRemoved", type: "number" },
            { label: "Effect Count", field: "Action.EffectCount", type: "number" },
            { label: "Prerequisite Effect", field: "Action.PrerequisiteEffect", type: "text" },
            { label: "Duration", field: "Action.Duration", type: "number" },
            { label: "Dice Roll", field: "Action.DiceRoll", type: "number" },
            { label: "GUID", field: "GUID", type: "text", readonly: true }
        ];

        return (
            <>
                <h2 className="title">Edit Card</h2>

                {fieldDefinitions.map(({ label, field, type, readonly }) => (
                    <EditableField
                        key={field}
                        label={label}
                        type={type}
                        value={getNestedValue(editedCard, field)}
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
