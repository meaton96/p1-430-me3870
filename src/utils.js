const convertCardToCSV = (card) => {
    const {
        Team,
        Duplication,
        Target,
        SectorsAffected,
        TargetAmount,
        Title,
        AssetInfo,
        Cost,
        FlavourText,
        Description,
        GUID,
        Action,
        DoomEffect,
    } = card;

    const convertEffects = (effects) => {
        if (!Array.isArray(effects)) {
            return 'None';
        }

        let effectString = '';

        const effectTypes = [];
        const effectTargets = [];
        let mag;

        effects.forEach((effect) => {
            const effectPieces = effect.split('-');
            if (effectPieces.length === 1) {
                effectTypes.push(effectPieces[0].charAt(0).toUpperCase()
                    + effectPieces[0].slice(1));
            } else {
                const [type, target, magnitude] = effectPieces;
                let typePiece = type;
                if (type === 'modpn') {
                    typePiece = type.slice(0, -1);
                    mag = `-${magnitude}`;
                } else if (type === 'modppt') {
                    mag = `-${magnitude}`;
                } else {
                    mag = magnitude;
                }
                effectTypes.push(typePiece);
                effectTargets.push(target);
            }
        });

        // Remove duplicates from effectTypes
        const uEffectTypes = [...new Set(effectTypes)];

        effectString += `${uEffectTypes.join('&')};`;
        if (effectTargets.length > 0) effectString += `${effectTargets.join('&')};${mag}`;
        else {
            return effectString.slice(0, -1); // remove trailing semicolon
        }
        return effectString;
    };

    // Create CSV line based on the image structure you provided
    let csvLine = `${Team},${Duplication},${Action.Method},${Target},${SectorsAffected},`;
    csvLine += `${TargetAmount},${Title},${AssetInfo.imgRow},${AssetInfo.imgCol},${AssetInfo.bgCol},${AssetInfo.bgRow},`;
    csvLine += `${Action.MeeplesChanged},${Action.MeepleIChange},`;
    csvLine += `${Cost.BlueCost},${Cost.BlackCost},${Cost.PurpleCost},0,`;
    csvLine += `${Action.CardsDrawn},${Action.CardsRemoved},${Action.EffectCount > 0 ? convertEffects(Action.Effects) : 'None'},`;
    csvLine += `${Action.EffectCount},${Action.PrerequisiteEffect},${Action.Duration},`;
    csvLine += `${DoomEffect ? 'TRUE' : 'FALSE'},${Action.DiceRoll},${FlavourText},`;
    csvLine += `${Description},images/${AssetInfo.imgLocation},${GUID}`;

    return csvLine;
};
const convertAllCardsToCSV = (cards) => {
    let csvHeaders = 'Team,Duplication,Method,Target,SectorsAffected,TargetAmount,';
    csvHeaders += 'Title,imgRow,imgCol,bgCol,bgRow,MeeplesChanged,MeepleIChange,';
    csvHeaders += 'BlueCost,BlackCost,PurpleCost,FacilityPoint,CardsDrawn,';
    csvHeaders += 'CardsRemoved,Effect,EffectCount,PrerequisiteEffect,Duration,';
    csvHeaders += 'DoomEffect,DiceRoll,FlavourText,Description,imgLocation,GUID\n';
    return csvHeaders + cards.map((card) => convertCardToCSV(card)).join('\n');
};

const getXMLCard = (card) => {
    let xml = '<card>\n';
    xml += `<Team>${card.Team}</Team>\n`;
    xml += `<Duplication>${card.Duplication}</Duplication>\n`;
    xml += `<Target>${card.Target}</Target>\n`;
    xml += `<SectorsAffected>${card.SectorsAffected}</SectorsAffected>\n`;
    xml += `<TargetAmount>${card.TargetAmount}</TargetAmount>\n`;
    xml += `<Title>${card.Title}</Title>\n`;

    xml += '<AssetInfo>\n';
    xml += `<imgRow>${card.AssetInfo.imgRow}</imgRow>\n`;
    xml += `<imgCol>${card.AssetInfo.imgCol}</imgCol>\n`;
    xml += `<bgRow>${card.AssetInfo.bgRow}</bgRow>\n`;
    xml += `<bgCol>${card.AssetInfo.bgCol}</bgCol>\n`;
    xml += `<imgLocation>${card.AssetInfo.imgLocation}</imgLocation>\n`;
    xml += '</AssetInfo>\n';

    xml += '<Cost>\n';
    xml += `<BlueCost>${card.Cost.BlueCost}</BlueCost>\n`;
    xml += `<BlackCost>${card.Cost.BlackCost}</BlackCost>\n`;
    xml += `<PurpleCost>${card.Cost.PurpleCost}</PurpleCost>\n`;
    xml += '</Cost>\n';

    xml += `<FlavourText>${card.FlavourText}</FlavourText>\n`;
    xml += `<Description>${card.Description}</Description>\n`;
    xml += `<GUID>${card.GUID}</GUID>\n`;

    xml += '<Action>\n';
    xml += `<Method>${card.Action.Method}</Method>\n`;
    xml += `<MeeplesChanged>${card.Action.MeeplesChanged}</MeeplesChanged>\n`;
    xml += `<MeepleIChange>${card.Action.MeepleIChange}</MeepleIChange>\n`;
    xml += `<PrerequisiteEffect>${card.Action.PrerequisiteEffect}</PrerequisiteEffect>\n`;
    xml += `<Duration>${card.Action.Duration}</Duration>\n`;
    xml += `<CardsDrawn>${card.Action.CardsDrawn}</CardsDrawn>\n`;
    xml += `<CardsRemoved>${card.Action.CardsRemoved}</CardsRemoved>\n`;
    xml += `<DiceRoll>${card.Action.DiceRoll}</DiceRoll>\n`;
    xml += `<EffectCount>${card.Action.EffectCount}</EffectCount>\n`;

    xml += '<Effects>\n';
    card.Action.Effects.forEach((effect) => {
        xml += `<EffectID>${effect.EffectID}</EffectID>\n`;
    });
    xml += '</Effects>\n';

    xml += `<DoomEffect>${card.DoomEffect}</DoomEffect>\n`;
    xml += '</Action>\n';

    xml += '</card>';

    return xml;
};
// helper function to merge objects for PUT operations only the deeply nested json objects
const deepMerge = (target, source) => {
    Object.keys(source).forEach((key) => {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], deepMerge(target[key], source[key]));
        }
    });
    return { ...target, ...source };
};
const getCardDeepCopy = (card) => {
    const cardCopy = {};
    cardCopy.Team = card.Team;
    cardCopy.Duplication = card.Duplication;
    cardCopy.Target = card.Target;
    cardCopy.SectorsAffected = card.SectorsAffected;
    cardCopy.TargetAmount = card.TargetAmount;
    cardCopy.Title = card.Title;
    cardCopy.FlavourText = card.FlavourText;
    cardCopy.Description = card.Description;
    cardCopy.GUID = card.GUID;
    cardCopy.DoomEffect = card.DoomEffect;
    cardCopy.AssetInfo = { ...card.AssetInfo };
    cardCopy.Cost = { ...card.Cost };
    cardCopy.Action = {
        Method: card.Action.Method,
        MeeplesChanged: card.Action.MeeplesChanged,
        MeepleIChange: card.Action.MeepleIChange,
        PrerequisiteEffect: card.Action.PrerequisiteEffect,
        Duration: card.Action.Duration,
        CardsDrawn: card.Action.CardsDrawn,
        CardsRemoved: card.Action.CardsRemoved,
        DiceRoll: card.Action.DiceRoll,
        EffectCount: card.Action.EffectCount,
        Effects: card.Action.Effects.map((effect) => effect), // just a string
    };
    return cardCopy;
};
const convertCardsToXML = (cards) => `<cards>\n${cards.map((card) => getXMLCard(card)).join('')}\n</cards>`;

module.exports = {
    convertAllCardsToCSV,
    getXMLCard,
    convertCardToCSV,
    deepMerge,
    getCardDeepCopy,
    convertCardsToXML,
};
