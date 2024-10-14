const getChangedFields = (original, updated) => {
	//console.log(original);
//	console.log(updated);
	let changes = {};

	// Helper function to merge nested changes
	function mergeNestedChange(changes, field, subField, value) {
		if (!changes[field]) {
			changes[field] = {}; // Create the nested object if it doesn't exist
		}

		changes[field][subField] = value; // Assign the new value
		//console.log(changes);
	}

	// Top-level fields
	if (original.Team !== updated.Team) changes.Team = updated.Team;
	if (original.Duplication !== updated.Duplication) changes.Duplication = updated.Duplication;
	if (original.Target !== updated.Target) changes.Target = updated.Target;
	if (original.SectorsAffected !== updated.SectorsAffected) changes.SectorsAffected = updated.SectorsAffected;
	if (original.TargetAmount !== updated.TargetAmount) changes.TargetAmount = updated.TargetAmount;
	if (original.Title !== updated.Title) changes.Title = updated.Title;
	if (original.FlavourText !== updated.FlavourText) changes.FlavourText = updated.FlavourText;
	if (original.Description !== updated.Description) changes.Description = updated.Description;
	if (original.GUID !== updated.GUID) changes.GUID = updated.GUID;
	if (original.DoomEffect !== updated.DoomEffect) changes.DoomEffect = updated.DoomEffect;

	// Nested object fields: AssetInfo
	if (original.AssetInfo.imgRow !== updated.AssetInfo.imgRow)
		mergeNestedChange(changes, "AssetInfo", "imgRow", updated.AssetInfo.imgRow);
	if (original.AssetInfo.imgCol !== updated.AssetInfo.imgCol)
		mergeNestedChange(changes, "AssetInfo", "imgCol", updated.AssetInfo.imgCol);
	if (original.AssetInfo.bgCol !== updated.AssetInfo.bgCol)
		mergeNestedChange(changes, "AssetInfo", "bgCol", updated.AssetInfo.bgCol);
	if (original.AssetInfo.bgRow !== updated.AssetInfo.bgRow)
		mergeNestedChange(changes, "AssetInfo", "bgRow", updated.AssetInfo.bgRow);
	if (original.AssetInfo.imgLocation !== updated.AssetInfo.imgLocation)
		mergeNestedChange(changes, "AssetInfo", "imgLocation", updated.AssetInfo.imgLocation);

	// Nested object fields: Cost
	if (original.Cost.BlueCost !== updated.Cost.BlueCost)
		mergeNestedChange(changes, "Cost", "BlueCost", updated.Cost.BlueCost);
	if (original.Cost.BlackCost !== updated.Cost.BlackCost)
		mergeNestedChange(changes, "Cost", "BlackCost", updated.Cost.BlackCost);
	if (original.Cost.PurpleCost !== updated.Cost.PurpleCost)
		mergeNestedChange(changes, "Cost", "PurpleCost", updated.Cost.PurpleCost);

	// Nested object fields: Action
	if (original.Action.Method !== updated.Action.Method)
		mergeNestedChange(changes, "Action", "Method", updated.Action.Method);
	if (original.Action.MeeplesChanged !== updated.Action.MeeplesChanged)
		mergeNestedChange(changes, "Action", "MeeplesChanged", updated.Action.MeeplesChanged);
	if (original.Action.MeepleIChange !== updated.Action.MeepleIChange)
		mergeNestedChange(changes, "Action", "MeepleIChange", updated.Action.MeepleIChange);
	if (original.Action.PrerequisiteEffect !== updated.Action.PrerequisiteEffect)
		mergeNestedChange(changes, "Action", "PrerequisiteEffect", updated.Action.PrerequisiteEffect);
	if (original.Action.Duration !== updated.Action.Duration)
		mergeNestedChange(changes, "Action", "Duration", updated.Action.Duration);
	if (original.Action.CardsDrawn !== updated.Action.CardsDrawn)
		mergeNestedChange(changes, "Action", "CardsDrawn", updated.Action.CardsDrawn);
	if (original.Action.CardsRemoved !== updated.Action.CardsRemoved)
		mergeNestedChange(changes, "Action", "CardsRemoved", updated.Action.CardsRemoved);
	if (original.Action.DiceRoll !== updated.Action.DiceRoll)
		mergeNestedChange(changes, "Action", "DiceRoll", updated.Action.DiceRoll);
	if (original.Action.EffectCount !== updated.Action.EffectCount)
		mergeNestedChange(changes, "Action", "EffectCount", updated.Action.EffectCount);

	// Nested array: Effects in Action
	if (original.Action.Effects.length !== updated.Action.Effects.length ||
		!original.Action.Effects.every((effect, index) => effect === updated.Action.Effects[index])) {
		mergeNestedChange(changes, "Action", "Effects", updated.Action.Effects);
	}


	//console.log(changes);


	return changes;
};
// Function to the field value from the obj object even if its a nested field
const getNestedValue = (obj, field) => field.
	split('.').
	reduce((o, key) => (o && o[key] !== undefined) ? o[key] : '', obj);

const getCardDeepCopy = (card) => {
	let cardCopy = {};
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
		Effects: card.Action.Effects.map(effect => effect)//just a string
	}
	return cardCopy;
}

const isSameImage = (imgName1, imgName2) => {

	return imgName1.split('.')[0] === imgName2.split('.')[0];
}

export { getChangedFields, getNestedValue, getCardDeepCopy, isSameImage };