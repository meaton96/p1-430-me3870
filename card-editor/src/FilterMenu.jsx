import React, { useEffect, useState } from 'react';
import { fetchJsonEndpoint } from './utils/ajax.js';

const VALID_FILTER_NAMES = [
    'Team',
    'Action.Method',
    'Target',
    'Cost.BlueCost',
    'Cost.BlackCost',
    'Cost.PurpleCost',
    'Action.EffectCount',
    'Action.PrerequisiteEffect',
];
const FILTER_HEADERS = [
    'Team',
    'Method',
    'Target',
    'Blue Cost',
    'Black Cost',
    'Purple Cost',
    'Effect Count',
    'Prerequisite Effect',
]

const PLAIN_TEXT_FIELD_MAP = {
    "DrawAndDiscardCards": "Draw and Discard Cards",
    "ShuffleAndDrawCards": "Shuffle and Draw Cards",
    "ReturnHandToDeckAndDraw": "Return Hand to Deck and Draw",
    "ReduceCardCost": "Reduce Card Cost",
    "AddEffect": "Add Effect",
    "SelectFacilitiesAddRemoveEffect": "Select Facilities",
    "RemoveEffect": "Remove Effect",
    "SpreadEffect": "Spread Effect",
    "NWChangePhysPointsDice": "Change Sector Physical Points",
    "NWChangeFinPointsDice": "Change Sector Financial Points",
    "NWChangeMeepleAmtDice": "Change Sector Meeple Amount",
    "NWChangePhysPointsDice;NWChangeFinPointsDice": "Change Sector Phys/Fin Points",
    "NWChangeMeepleEach": "Change Single Sector Meeple",
    "NWChangeMeepleChoice": "Change Sector Meeple Choice",
    "NWIncOvertimeAmount": "Increase Overtime Amount",
    "NWShuffleFromDiscard": "Shuffle from Discard",
    "ReduceRemainingTurns": "Reduce Remaining Turns",
}
const PLAIN_TEXT_NAME_MAP = {
    "White;Negative": "Negative White",
    "White;Positive": "Positive White",
}

function FilterMenu({ selectedFilters, setSelectedFilters }) {
    const [filterData, setFilterData] = useState({});

    useEffect(() => {
        const getFilterData = async () => {
            try {
                const data = await fetchJsonEndpoint('/api/cards/all');
                const filterValues = {};
                
                // Iterate over valid filter names
                for (const field of VALID_FILTER_NAMES) {
                    const valueCounts = {};

                    // Iterate over each card
                    for (const card of data) {
                        let cardFieldValue;

                        // Handle nested fields using dot notation
                        const fieldParts = field.split('.');
                        if (fieldParts.length === 2) {
                            // For fields like "Action.Method" or "Cost.BlueCost"
                            cardFieldValue = card[fieldParts[0]]?.[fieldParts[1]];
                        } else {
                            // For non-nested fields like "Team" or "Target"
                            cardFieldValue = card[field];
                        }

                        if (cardFieldValue != null) {
                            valueCounts[cardFieldValue] = (valueCounts[cardFieldValue] || 0) + 1;
                        }
                    }

                    // Set the filter values
                    filterValues[field] = valueCounts;
                }

                setFilterData(filterValues);
            } catch (err) {
                console.error('Error:', err);
            }
        };
        getFilterData();
    }, []);

    // Handle checkbox changes
    const handleCheckboxChange = (field, value, isChecked) => {
        // Update the selected filters
        setSelectedFilters(prev => {
            const prevValues = prev[field] || [];
            const newValues = isChecked
                ? [...prevValues, value]
                : prevValues.filter(v => v !== value);
            return { ...prev, [field]: newValues };
        });
    };

    return (
        <div className='column is-one-quarter'>
            <h2 className='title'>Filters</h2>
            <ul className="menu-list">
                {Object.keys(filterData).map((header, index) => (
                    <div key={`${header}-${index}`}>
                        <p className="menu-label is-size-5 has-text-weight-bold has-text-white">{FILTER_HEADERS[index]}</p>
                        <ul>
                            {Object.entries(filterData[header]).map(([value, count]) => (
                                <li key={`${header}-${value}`}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters[header]?.includes(value) || false}
                                            onChange={(e) =>
                                                handleCheckboxChange(header, value, e.target.checked)
                                            }
                                        />
                                        <span className='px-1'>{PLAIN_TEXT_FIELD_MAP[value] || PLAIN_TEXT_NAME_MAP[value] || value}</span> ({count})
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default FilterMenu;
