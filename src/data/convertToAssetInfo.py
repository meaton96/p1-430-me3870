import json
import psycopg2

# Load your JSON data
with open('card-data.json', 'r') as f:
    cards = json.load(f)

# Connect to your PostgreSQL database
conn = psycopg2.connect(
    dbname="da2or6ps8nv90c",
    user="u1j5jajvgken6t",
    password="pc80a3f310d76b14b58c2d699f5507d4d45e7afdcb7275d483d41dba777a2c2e4",
    host="c6sfjnr30ch74e.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com",
    port="5432"
)
cur = conn.cursor()

# Function to insert asset info into the database
def insert_asset_info(card_id, img_row, img_col, bg_row, bg_col, img_location):
    query = """
    INSERT INTO asset_info (card_id, img_row, img_col, bg_row, bg_col, img_location)
    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING asset_info_id;
    """
    cur.execute(query, (card_id, img_row, img_col, bg_row, bg_col, img_location))
    asset_info_id = cur.fetchone()[0]
    return asset_info_id

# Loop through the cards and insert asset info
for card in cards:
    # Extract the asset info from the card
    asset_info = card.get("AssetInfo", {})
    img_row = asset_info.get("imgRow", None)
    img_col = asset_info.get("imgCol", None)
    bg_row = asset_info.get("bgRow", None)
    bg_col = asset_info.get("bgCol", None)
    img_location = asset_info.get("imgLocation", "")

    # Here you would need the card_id from the 'card' table.
    # Assuming you have a way to retrieve the card_id based on the card GUID or another identifier.
    guid = card["GUID"]
    
    # Fetch the card_id from the card table
    cur.execute("SELECT card_id FROM card WHERE guid = %s", (guid,))
    card_id_result = cur.fetchone()
    
    if card_id_result:
        card_id = card_id_result[0]

        # Insert the asset info into the asset_info table
        asset_info_id = insert_asset_info(card_id, img_row, img_col, bg_row, bg_col, img_location)
        print(f"Inserted asset info with ID {asset_info_id} for card {card['Title']}")
    else:
        print(f"No card found with GUID {guid}")

# Commit the transaction and close the connection
conn.commit()
cur.close()
conn.close()