import { React, useState } from 'react';
import EditableField from './EditableField';
import EditableTextArea from './EditableTextArea';
import ClipLoader from "react-spinners/ClipLoader";
import './styles/CardModal.css';
import { getNestedValue, getChangedFields, getCardDeepCopy, isSameImage } from './utils/utils.js';
import { Checkmark } from 'react-checkmark';

function CardModal({ card,
    onClose,
    onDelete,
    effectList,
    onCardEdit,
    isAddingNewCard,
    setIsAddingNewCard,
    isEditing,
    setIsEditing,
    cardAssetNames }) {
    if (!card) return null; // Don't render anything if no card is selected
    // const [isEditing, setIsEditing] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [error, setError] = useState('');
    const [cardDeleted, setCardDeleted] = useState(false);
    const [editedCard, setEditedCard] = useState(getCardDeepCopy(card)); // Copy of the card for editing
    const [loading, setLoading] = useState(false);
    const [saveCompleted, setSaveCompleted] = useState(false);
    const [_card, setCard] = useState(card);
    const [fieldChanged, setFieldChanged] = useState(false);


    const effectMap = {
        "ModifyPoints": "Modify Points",
        "ModifyPointsPerTurn": "Modify Points Per Turn",

    }
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
        setFieldChanged(false);

        const method = isAddingNewCard ? 'POST' : 'PUT'; // POST if adding a new card, PUT if updating
        const url = isAddingNewCard ? '/api/cards' : `/api/cards/${editedCard.GUID}`;
        const changes = getChangedFields(card, editedCard); // create the json object for only the updated properties

        if (Object.keys(changes).length === 0 && !isAddingNewCard) {
            setIsEditing(false);
            return;
        }

        setLoading(true);

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: isAddingNewCard ? JSON.stringify(editedCard) : JSON.stringify(changes),
        })
            .then((response) => {
                if (response.ok) { // 200
                    setSaveCompleted(true); // Show checkmark
                    setTimeout(() => {
                        setIsAddingNewCard(false); // Reset adding new card state
                        setLoading(false); // Hide loading modal
                        setSaveCompleted(false); // Reset checkmark state
                        setCard(editedCard); // update modal with new card data
                        onCardEdit(editedCard); // Pass the updated card to parent
                    }, 1750);
                } else {
                    setError('Failed to save card with status: ' + response.status);
                    setLoading(false);
                }
            })
            .catch((error) => {
                setError('Failed to save card: ' + error.message);
                setLoading(false);
            })
            .finally(() => {
                // Set editing state after the request completes
                setIsEditing(false);
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
        setFieldChanged(true);
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


    const getImageSource = (imgLocation) => {
        if (imgLocation && imgLocation.trim()) {
            return `/api/assets/cards/${imgLocation.replace('.png', '.webp')}`;
        }
        return 'https://craftypixels.com/placeholder-image/300.png/';
    };


    const renderLoadingModal = () => (
        <div className="loading-modal">
            <div className="modal-content has-text-centered">
                <div className="box">
                    {saveCompleted ? (
                        <Checkmark size="large" />
                    ) : (
                        <ClipLoader size={40} color={"#3498db"} loading={true} />
                    )}
                </div>
            </div>
        </div>
    );
    //show the card data as un editable text
    const renderCardData = () => {
        return (<>
            <h2 className="title">{_card.Title || 'Untitled'}</h2>
            <img className='is-flex is-align-items-center is-justify-content-center m-auto mb-3'
                src={getImageSource(editedCard.AssetInfo.imgLocation)}
                alt="Card Image"
                style={{ width: '50%' }}></img>
            <p className="mt-2">
                <strong>Description:</strong> {_card.Description || 'No description available.'}
            </p>
            <p>
                <strong>Flavour Text:</strong> {_card.FlavourText || 'None'}
            </p>
            <p>
                <strong>Team:</strong> {_card.Team}
            </p>
            <p>
                <strong>Duplication:</strong> {_card.Duplication}
            </p>
            <p>
                <strong>Method:</strong> {_card.Action?.Method || 'None'}
            </p>
            <p>
                <strong>Target:</strong> {_card.Target}
            </p>
            <p>
                <strong>Sectors Affected:</strong> {_card.SectorsAffected}
            </p>
            <p>
                <strong>Target Amount:</strong> {_card.TargetAmount}
            </p>
            <p>
                <strong>Blue Cost:</strong> {_card.Cost?.BlueCost}
            </p>
            <p>
                <strong>Black Cost:</strong> {_card.Cost?.BlackCost}
            </p>
            <p>
                <strong>Purple Cost:</strong> {_card.Cost?.PurpleCost}
            </p>
            <p>
                <strong>Facility Point:</strong> {_card.Action?.FacilityPoint || 0}
            </p>
            <p>
                <strong>Cards Drawn:</strong> {_card.Action?.CardsDrawn || 0}
            </p>
            <p>
                <strong>Cards Removed:</strong> {_card.Action?.CardsRemoved || 0}
            </p>

            <p>
                <strong>Prerequisite Effect:</strong> {_card.Action?.PrerequisiteEffect || 'None'}
            </p>
            <p>
                <strong>Duration:</strong> {_card.Action?.Duration || 0}
            </p>
            <p>
                <strong>Doom Effect:</strong> {_card.DoomEffect ? 'Yes' : 'No'}
            </p>
            <p>
                <strong>Dice Roll:</strong> {_card.Action?.DiceRoll || 0}
            </p>
            <p>
                <strong>GUID:</strong> {_card.GUID}
            </p>
            <p>
                <strong>Effect Count:</strong> {_card.Action?.EffectCount || 0}
            </p>

            {_card.Action?.Effects && _card.Action.Effects.length > 0 && (
                <div>
                    <strong>Effects:</strong>
                    <div className="mt-1 is-flex">
                        {_card.Action.Effects.map((effectID, index) => {
                            const effect = effectList.find(e => e.EffectID === effectID);

                            if (!effect) {
                                return (
                                    <div key={index} className="effect-item p-1 my-1 mb-1">
                                        {`${index + 1}. Unknown effect: ${effectID}`}
                                    </div>
                                );
                            }

                            const { EffectType, EffectPointTarget, EffectMagnitude } = effect.Effect;

                            return (
                                <div key={index} className="effect-item has-text-centered p-1 m-1">
                                    {effectMap[EffectType] || EffectType
                                    }

                                    {EffectPointTarget && (
                                        <>
                                            ,&nbsp;
                                            <span>{EffectPointTarget}</span>
                                        </>
                                    )}
                                    {EffectMagnitude && (
                                        <>
                                            ,&nbsp;
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
                <button style={{ width: "10rem" }} className="button is-primary m-1" onClick={() => setIsEditing(!isEditing)}>Edit Card</button>
                <button style={{ width: "10rem" }} className="button is-danger m-1" onClick={handleDeleteCardClick}>Delete Card</button>
            </div>
        </>);
    }

    const renderEditCardData = () => {
        const fieldDefinitions = [
            { label: "Title", field: "Title", type: "text" },
            // { label: "Team", field: "Team", type: "text" },
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
            { label: "Prerequisite Effect", field: "Action.PrerequisiteEffect", type: "text" },
            { label: "Duration", field: "Action.Duration", type: "number" },
            { label: "Dice Roll", field: "Action.DiceRoll", type: "number" },
            { label: "GUID", field: "GUID", type: "text", readonly: true }
        ];

        // Remove an effect from the card when clicking on it
        const handleRemoveEffect = (index) => {
            const updatedEffects = [...editedCard.Action.Effects];
            updatedEffects.splice(index, 1); // Remove the effect at the given index

            setEditedCard((prev) => ({
                ...prev,
                Action: {
                    ...prev.Action,
                    Effects: updatedEffects,
                    EffectCount: prev.Action.EffectCount - 1, // Decrease the EffectCount
                },
            }));
        };


        // Add an effect to the card
        const handleAddEffect = (effectID) => {
            if (!editedCard.Action.Effects.includes(effectID)) {
                setEditedCard((prev) => ({
                    ...prev,
                    Action: {
                        ...prev.Action,
                        Effects: [...prev.Action.Effects, effectID], // Add the new effect
                        EffectCount: prev.Action.EffectCount + 1, // Increase the EffectCount
                    },
                }));
            }
        };

        const teams = [
            { val: 'Blue', textVal: 'Blue' },
            { val: 'Red', textVal: 'Red' },
            { val: 'White;Negative', textVal: 'Negative White' },
            { val: 'White;Positive', textVal: 'Positive White' },];


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
                <div className="field is-flex columns">
                    <div className="column is-half has-text-centered">
                        <label className="label">Team: {editedCard.Team}</label>
                    </div>
                    <div className='column is-half has-text-centered'>
                        <div className="control">
                            <div className="select">
                                <select onChange={(e) => handleInputChange(e, 'Team')}
                                    value={editedCard.Team || ""}>
                                    <option value="" disabled>Select Team</option>
                                    {teams.map((teamName) => (
                                        <option key={teamName.val} value={teamName.val}>
                                            {teamName.textVal}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                {/*Image*/}
                <div className="field is-flex columns">
                    <div className="column is-half has-text-centered">
                        <label className="label">Image Name: {editedCard.AssetInfo.imgLocation}</label>
                    </div>
                    <div className='column is-half has-text-centered'>
                        <div className="control">
                            <div className="select">
                                <select onChange={(e) => handleInputChange(e, 'AssetInfo.imgLocation')}
                                    value={editedCard.AssetInfo.imgLocation || ""}>
                                    <option value="" disabled>Select Image</option>
                                    {cardAssetNames.map((imageName) => {
                                        const displayName = imageName.split('.')[0]; // Get the name without extension
                                        const pngImageName = `${displayName}.png`;   
                                            
                                        return (
                                            <option key={displayName} value={pngImageName}>
                                                {displayName}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>


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

                {/*{ label: "Effect Count", field: "Action.EffectCount", type: "number", readonly: true }*/}
                <EditableField
                    key={"Action.EffectCount"}
                    label={"Effect Count"}
                    type={"number"}
                    value={getNestedValue(editedCard, "Action.EffectCount")}
                    onChange={(e) => handleInputChange(e, "Action.EffectCount")}
                    readonly={true}
                />


                {/* Current Effects */}
                <div className="field">
                    <label className="label">Current Effects</label>
                    <div className="mt-1 is-flex">
                        {editedCard.Action?.Effects.map((effectID, index) => {
                            const effect = effectList.find(e => e.EffectID === effectID);

                            if (!effect) {
                                return (
                                    <div
                                        key={index}
                                        className="effect-item p-1 my-1 mb-1"
                                        onClick={() => handleRemoveEffect(index)}
                                    >
                                        {`${index + 1}. Unknown effect: ${effectID} (click to remove)`}
                                    </div>
                                );
                            }

                            const { EffectType, EffectPointTarget, EffectMagnitude } = effect.Effect;

                            return (
                                <div
                                    key={index}
                                    className="effect-item-edit has-text-centered p-1 m-1"
                                    onClick={() => handleRemoveEffect(index)}
                                >
                                    {effectMap[EffectType] || EffectType}
                                    {' : '}
                                    {EffectPointTarget && <span className="has-font-weight-bold">{EffectPointTarget}</span>}
                                    {EffectMagnitude && <span className="has-font-weight-bold"> {EffectMagnitude}</span>}
                                    <br />
                                    <small>(click to remove)</small>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Add New Effect */}
                <div className="field">
                    <label className="label">Add Effect</label>
                    <div className="control">
                        <div className="select">
                            <select onChange={(e) => handleAddEffect(e.target.value)} value="">
                                <option value="" disabled>Select an effect</option>
                                {effectList.map((effect) => (
                                    <option key={effect.EffectID} value={effect.EffectID}>
                                        {effect.EffectID} - {effect.Effect.EffectType}
                                    </option>
                                ))}
                            </select>
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
                        {fieldChanged ? "Save Changes" : "Exit Edit Mode"}
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
        <>
            {loading && renderLoadingModal()} {/* Show the loading spinner/modal if loading */}
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
        </>
    );
}


export default CardModal;
