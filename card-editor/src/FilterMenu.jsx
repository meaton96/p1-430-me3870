import React, { useEffect, useState } from 'react';
import { fetchJsonEndpoint } from './utils/ajax.js';

const VALID_FILTER_NAMES = [
    'Team',
    'Method',
    'Target',
    'BlueCost',
    'BlackCost',
    'PurpleCost',
    'EffectCount',
    'PrerequisiteEffect',
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

function FilterMenu({ selectedFilters, setSelectedFilters }) {
    const [filterData, setFilterData] = useState({});

    useEffect(() => {
        const getFilterData = async () => {
            try {
                const data = await fetchJsonEndpoint('/api/cards/all');
                // Extract unique values and counts
                const filterValues = {};
                //iterate valid filter names
                for (const field of VALID_FILTER_NAMES) {
                    const valueCounts = {};
                    //iterate over each card
                    for (const card of data) {
                        const cardFieldValue = card[field];
                        if (cardFieldValue != null) {
                            //split the values by semicolon
                            //const values = String(cardFieldValue).split(';').map(v => v.trim());
                            // let stringVal = '';
                            // if (values.length > 1) {

                            // }
                           // console.log(cardFieldValue);
                            valueCounts[cardFieldValue] = (valueCounts[cardFieldValue] || 0) + 1;
                            // //iterate over each value
                            // values.forEach(value => {
                            //     //increment the count of the value
                            //     valueCounts[value] = (valueCounts[value] || 0) + 1;
                            // });
                        }
                    }
                    //set the filter values
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
            //previous values or empty
            const prevValues = prev[field] || [];
            //if checked, add the value to the list, otherwise remove it
            const newValues = isChecked
                ? [...prevValues, value]
                : prevValues.filter(v => v !== value);
            return { ...prev, [field]: newValues }; //return the new selected filters to update the state
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
                                        <span className='px-1'>{value}</span> ({count})
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
