const fs = require('fs');
const path = require('path');
const util = require('./utils.js');
const { Pool } = require('pg');
const cardsPath = path.resolve(__dirname, 'data/card-data.json');
const effectPath = path.resolve(__dirname, 'data/effects.json');
const effectJson = fs.readFileSync(effectPath);
const jsonString = fs.readFileSync(cardsPath);
//const AAAcards = JSON.parse(jsonString);
const effects = JSON.parse(effectJson);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgres://u1j5jajvgken6t:pc80a3f310d76b14b58c2d699f5507d4d45e7afdcb7275d483d41dba777a2c2e4@c6sfjnr30ch74e.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/da2or6ps8nv90c`,
    ssl: {
        rejectUnauthorized: false,
    },
});

const  getValidFields = async () => {
    const cardRes = await pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = \'card\'');
    const actionRes = await pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = \'action\'');
    const effectRes = await pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = \'effect\'');
    const costRes = await pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = \'cost\'');
    const assetRes = await pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = \'asset_info\'');
    
    

    return res.rows.map(row => row.column_name);
};
const VALID_FIELD_NAMES = getValidFields();

const VALID_FILTER_NAMES = [
    'team',
    'method',
    'target',
    'bluecost',
    'blackcost',
    'purplecost',
    'effectcount',
    'prerequisiteeffect',
];
const jsonToDbMap = {
    'Team': 'team',
    'Duplication': 'duplication',
    'Target': 'target',
    'SectorsAffected': 'sectors_affected',
    'TargetAmount': 'target_amount',
    'Title': 'title',
    'FlavourText': 'flavour_text',
    'Description': 'description',
    'GUID': 'guid',
    'DoomEffect': 'doom_effect',
    'Method': 'method',
    'MeeplesChanged': 'meeples_changed',
    'MeepleIChange': 'meeple_i_change',
    'PrerequisiteEffect': 'prerequisite_effect',
    'Duration': 'duration',
    'CardsDrawn': 'cards_drawn',
    'CardsRemoved': 'cards_removed',
    'DiceRoll': 'dice_roll',
    'BlueCost': 'blue_cost',
    'BlackCost': 'black_cost',
    'PurpleCost': 'purple_cost',
    'imgLocation': 'img_location',
    'imgRow': 'img_row',
    'imgCol': 'img_col',
    'bgCol': 'bg_col',
    'bgRow': 'bg_row',

}
const convertDBCardToJSON = (card, action, effects, cost, assetInfo) => {
    const result = {};

    // From card
    result.Team = card.team;
    result.Duplication = card.duplication;
    result.Target = card.target;
    result.SectorsAffected = card.sectors_affected;
    result.TargetAmount = card.target_amount;
    result.Title = card.title;
    result.FlavourText = card.flavour_text;
    result.Description = card.description;
    result.GUID = card.guid;
    result.DoomEffect = card.doom_effect;

    result.AssetInfo = {
        imgLocation: assetInfo.img_location,
        imgRow: assetInfo.img_row,
        imgCol: assetInfo.img_col,
        bgCol: assetInfo.bg_col,
        bgRow: assetInfo.bg_row
    };

    // Cost
    result.Cost = {
        BlueCost: cost.blue_cost,
        BlackCost: cost.black_cost,
        PurpleCost: cost.purple_cost
    };

    // Action
    result.Action = {
        Method: action.method,
        MeeplesChanged: action.meeples_changed,
        MeepleIChange: action.meeple_i_change,
        PrerequisiteEffect: action.prerequisite_effect,
        Duration: action.duration,
        CardsDrawn: action.cards_drawn,
        CardsRemoved: action.cards_removed,
        DiceRoll: action.dice_roll,
    };

    // Effects
    if (effects && effects.length > 0) {
        result.Action.EffectCount = effects.length;
        result.Action.Effects = effects.map(effect => effect.effect_type_id);
    } else {
        result.Action.EffectCount = 0;
        result.Action.Effects = [];
    }

    // Output the result
    //console.log(JSON.stringify(result, null, 4));
    return result;
};
const convertJSONFieldToDBField = (field) => {
    return jsonToDbMap[field];
};
const convertAllDBCardsToJSON = (cards, actions, effects, costs, assetInfos) => {
    const result = [];

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const action = actions[i];
        const effect = effects[i];
        const cost = costs[i];
        const assetInfo = assetInfos[i];

        result.push(convertDBCardToJSON(card, action, effect, cost, assetInfo));
    }
    //console.log(result);

    return result;
}

// PUBLIC METHODS
// GET
//const getAllCards = () => cards.map((card) => util.getCardDeepCopy(card));
const getAllCards = async () => {
    const cards = await pool.query('SELECT * FROM card');
    const actions = await pool.query('SELECT * FROM action');
    const effects = await pool.query('SELECT * FROM effect');
    const costs = await pool.query('SELECT * FROM cost');
    const assetInfos = await pool.query('SELECT * FROM asset_info');

    return convertAllDBCardsToJSON(cards.rows, actions.rows, effects.rows, costs.rows, assetInfos.rows);

};
//const getAllEffects = () => effects.map((effect) => ({ ...effect }));
const getAllEffects = async () => {
    const res = await pool.query('SELECT * FROM effect');
    return res.rows;
}
// Get a card by GUID
// const getCardById = (guid) => {
//     const card = cards.find((_card) => _card.GUID === guid);
//     return card ? util.getCardDeepCopy(card) : null;
// };
const getCardByGUID = async (guid) => {
    const res = await pool.query('SELECT card_id FROM card WHERE guid = $1', [guid]);
    if (res != null) {
        const id = res.rows[0].card_id;
        return getCardByDBID(id);
    }
    return null;
};
const getFirstID = async () => {
    const res = await pool.query('SELECT card_id FROM card ORDER BY card_id ASC LIMIT 1');
    return res.rows[0].card_id;
};
const getLastID = async () => {
    const res = await pool.query('SELECT card_id FROM card ORDER BY card_id DESC LIMIT 1');
    return res.rows[0].card_id;
}

const getCardByDBID = async (id) => {
    const cardRes = await pool.query('SELECT * FROM card WHERE card_id = $1', [id]);
    const actionRes = await pool.query('SELECT * FROM action WHERE card_id = $1', [id]);
    if (actionRes == null)
        return null;

    const actionID = actionRes.rows[0].action_id;
    const assetRes = await pool.query('SELECT * FROM asset_info WHERE card_id = $1', [id]);
    const effectRes = await pool.query('SELECT * FROM effect WHERE action_id = $1', [actionID]);
    const costRes = await pool.query('SELECT * FROM cost WHERE card_id = $1', [id]);
    const card = cardRes.rows[0];

    if (card == null)
        return null;

    const effects = effectRes.rows;
    const actions = actionRes.rows[0];
    const costs = costRes.rows[0];
    const assetInfo = assetRes.rows[0];

    return convertDBCardToJSON(card, actions, effects, costs, assetInfo);
};

const getEffectById = async (id) => {
    // const effect = effects.find((_effect) => _effect.EffectID === id);
    // return effect ? { ...effect } : null;
    const res = await pool.query('SELECT * FROM effect WHERE effect_id = $1', [id]);
    return res.rows[0] || null;
};
// Get the last card in the list
const getRecentCard = async () => {
    // const card = cards.slice(-1)[0];
    // return card ? util.getCardDeepCopy(card) : null;
    const id = await getLastID();
    return getCardByDBID(id);
};

// Get a random card
const getRandomCard = async () => {
    // const card = cards[Math.floor(Math.random() * cards.length)];
    // return card ? util.getCardDeepCopy(card) : null;
    const first = await getFirstID();
    const last = await getLastID();
    const id = Math.floor(Math.random() * (last - first + 1)) + first;
    return getCardByDBID(id);
};
// const getPartialNameMatches = (name) => getAllCards()
//     .filter((card) => card.Title.toLowerCase()
//         .includes(name.toLowerCase()));
const getCardsByField = (fieldName, value) => {
    const dbField = convertJSONFieldToDBField(fieldName);
    if (dbField == null)
        return null;

}


// Get cards by a specific field
// const getCardsByField = (fieldName, value) => cards
//     .filter((card) => {
//         const fieldValue = card[fieldName];
//         if (fieldValue !== undefined && fieldValue !== null) {
//             return fieldValue.toString().toLowerCase() === value.toString().toLowerCase();
//         }
//         return false;
//     })
//     .map((card) => util.getCardDeepCopy(card));

// Get cards by multiple filters, a list of field names and values
const getCardsByFilters = (filters) => AAAcards
    .filter((card) => Object.keys(filters).every((key) => {
        const filterValue = filters[key];
        // Handle partial matches for the card title
        // console.log(filterValue, typeof filterValue);
        if (key === 'Title') {
            const cardTitle = card.Title?.toString().toLowerCase();
            const filterTitle = filterValue[0].toString().toLowerCase();
            // console.log(cardTitle, filterTitle);
            return cardTitle && cardTitle.includes(filterTitle);
        }

        // Handle nested object properties and multiple values
        if (typeof filterValue === 'object' && filterValue !== null && !Array.isArray(filterValue)) {
            return Object.keys(filterValue).every((nestedKey) => {
                const nestedValues = filterValue[nestedKey]; // this is why we love javascript
                const nestedFieldValue = card[key]?.[nestedKey];

                if (nestedFieldValue !== undefined && nestedFieldValue !== null) {
                    // Check if nestedFieldValue matches any of the values in nestedValues
                    return Array.isArray(nestedValues)
                        ? nestedValues.some((nestedValue) => nestedFieldValue.toString()
                            .toLowerCase() === nestedValue.toString().toLowerCase())
                        : nestedFieldValue.toString().toLowerCase() === nestedValues
                            .toString().toLowerCase();
                }
                return false;
            });
        }

        const fieldValue = card[key];
        if (fieldValue !== undefined && fieldValue !== null) {
            // Handle multiple values for non-nested filters
            return Array.isArray(filterValue)
                ? filterValue.some((val) => fieldValue.toString().toLowerCase()
                    === val.toString().toLowerCase())
                : fieldValue.toString().toLowerCase()
                === filterValue.toString().toLowerCase();
        }
        return false;
    }))
    .map((card) => util.getCardDeepCopy(card));

// DELETE
const deleteCard = (guid) => {
    const index = AAAcards.findIndex((_card) => _card.GUID === guid);
    if (index !== -1) {
        AAAcards.splice(index, 1);
        // fs.writeFileSync(cardsPath, JSON.stringify(cards, null, 2));
        return true;
    }
    return false;
};
const updateCard = (guid, cardData) => {
    const index = AAAcards.findIndex((_card) => _card.GUID === guid);
    const oCard = AAAcards[index];
    //
    if (index !== -1) {
        const updatedCard = util.deepMerge(AAAcards[index], cardData);
        AAAcards[index] = updatedCard;

        if (oCard === updatedCard) {
            return null;
        }
        // fs.writeFileSync(cardsPath, JSON.stringify(cards, null, 2));
        return updatedCard;
    }
    return null;
};
const addCard = (card) => {
    // console.log(card);
    const guid = crypto.randomUUID();

    const newCard = util.getCardDeepCopy(card);
    newCard.GUID = guid;
    AAAcards.push(newCard);

    // console.log(cards);
    // fs.writeFileSync(cardsPath, JSON.stringify(cards, null, 2));
    return getCardByGUID(guid);
};

module.exports = {
    getAllCards,
    getCardById: getCardByGUID,
    getRecentCard,
    getRandomCard,
    getCardsByField,
    getCardsByFilters,
    deleteCard,
    getAllEffects,
    getEffectById,
    updateCard,
    addCard,
    getFirstID,
    getLastID,
    getCardByDBID,
    // getPartialNameMatches,
    VALID_FIELD_NAMES,
    VALID_FILTER_NAMES,
};
