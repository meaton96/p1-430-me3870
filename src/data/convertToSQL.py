import psycopg2
import json

# Load JSON data from the file
with open('./card-data.json', 'r') as file:
    data = json.load(file)  # This loads the JSON content into the 'data' variable

# Database connection
conn = psycopg2.connect(
    dbname="da2or6ps8nv90c",
    user="u1j5jajvgken6t",
    password="pc80a3f310d76b14b58c2d699f5507d4d45e7afdcb7275d483d41dba777a2c2e4",
    host="c6sfjnr30ch74e.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com",
    port="5432"
)
cur = conn.cursor()

try:
    for card in data:
        # Extract card fields
        team = card.get("Team")
        duplication = card.get("Duplication")
        target = card.get("Target")
        sectors_affected = card.get("SectorsAffected")
        target_amount = card.get("TargetAmount")
        title = card.get("Title")
        flavour_text = card.get("FlavourText")
        description = card.get("Description")
        guid = card.get("GUID")
        doom_effect = card.get("DoomEffect")

        # Insert into card table
        card_insert_query = '''
            INSERT INTO card (team, duplication, target, sectors_affected, target_amount, title, flavour_text, description, guid, doom_effect)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING card_id
        '''
        card_values = (team, duplication, target, sectors_affected, target_amount, title, flavour_text, description, guid, doom_effect)
        cur.execute(card_insert_query, card_values)
        card_id = cur.fetchone()[0]

        # Insert into cost table
        cost = card.get("Cost", {})
        blue_cost = cost.get("BlueCost")
        black_cost = cost.get("BlackCost")
        purple_cost = cost.get("PurpleCost")

        cost_insert_query = '''
            INSERT INTO cost (card_id, blue_cost, black_cost, purple_cost)
            VALUES (%s, %s, %s, %s)
        '''
        cost_values = (card_id, blue_cost, black_cost, purple_cost)
        cur.execute(cost_insert_query, cost_values)

        # Insert into action table
        action = card.get("Action", {})
        method = action.get("Method")
        meeples_changed = action.get("MeeplesChanged")
        meeple_i_change = action.get("MeepleIChange")
        prerequisite_effect = action.get("PrerequisiteEffect")
        duration = action.get("Duration")
        cards_drawn = action.get("CardsDrawn")
        cards_removed = action.get("CardsRemoved")
        dice_roll = action.get("DiceRoll")

        action_insert_query = '''
            INSERT INTO action (card_id, method, meeples_changed, meeple_i_change, prerequisite_effect, duration, cards_drawn, cards_removed, dice_roll)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING action_id
        '''
        action_values = (card_id, method, meeples_changed, meeple_i_change, prerequisite_effect, duration, cards_drawn, cards_removed, dice_roll)
        cur.execute(action_insert_query, action_values)
        action_id = cur.fetchone()[0]

        # Insert into effect table
        effects = action.get("Effects", [])
        for effect_type_id in effects:
            effect_insert_query = '''
                INSERT INTO effect (action_id, effect_type_id)
                VALUES (%s, %s)
            '''
            effect_values = (action_id, effect_type_id)
            cur.execute(effect_insert_query, effect_values)

    # Commit the transaction
    conn.commit()

except Exception as e:
    print(f"An error occurred: {e}")
    conn.rollback()
finally:
    # Close the cursor and connection
    cur.close()
    conn.close()