import json

# Load the original JSON data from a file
with open('card-data.json', 'r') as f:
    cards = json.load(f)

# Define dictionaries to store unique actions and effects
unique_actions = {}
unique_effects = {}
action_id_counter = 1
effect_id_counter = 1

# Assign unique IDs to actions and effects, and update cards JSON
for card in cards:
    action = card.get('Action')
    if action:
        # Create a unique key for each action to identify duplicates
        action_key = json.dumps(action, sort_keys=True)
        if action_key not in unique_actions:
            unique_action_id = f"ACTION_{action_id_counter}"
            unique_actions[action_key] = {"actionID": unique_action_id, "action": action}
            action_id_counter += 1
        
        # Replace the full action with a reference to the action ID
        card['actionID'] = unique_actions[action_key]['actionID']
        del card['Action']
    
    # Process Effects array if it exists
    effects = action.get('Effects', [])
    new_effect_ids = []
    for effect in effects:
        effect_key = json.dumps(effect, sort_keys=True)
        if effect_key not in unique_effects:
            unique_effect_id = f"EFFECT_{effect_id_counter}"
            unique_effects[effect_key] = {"effectID": unique_effect_id, "effect": effect}
            effect_id_counter += 1
        new_effect_ids.append(unique_effects[effect_key]['effectID'])
    
    # Replace the effects with a reference to effect IDs, if applicable
    if effects:
        card['effectIDs'] = new_effect_ids

# Write the updated cards JSON to a new file
with open('updated_cards.json', 'w') as f:
    json.dump(cards, f, indent=4)

# Create a separate file for actions and effects
actions_data = {
    "actions": [{"actionID": value["actionID"], "action": value["action"]} for value in unique_actions.values()],
    "effects": [{"effectID": value["effectID"], "effect": value["effect"]} for value in unique_effects.values()]
}

with open('Actions.json', 'w') as f:
    json.dump(actions_data, f, indent=4)

print("Extraction completed: updated_cards.json and Actions.json created.")
