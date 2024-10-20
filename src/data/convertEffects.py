import json
import psycopg2
from psycopg2 import sql

# Database connection details
conn = psycopg2.connect(
    dbname="da2or6ps8nv90c",
    user="u1j5jajvgken6t",
    password="pc80a3f310d76b14b58c2d699f5507d4d45e7afdcb7275d483d41dba777a2c2e4",
    host="c6sfjnr30ch74e.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com",
    port="5432"
)
# JSON data
json_data = [
    {
        "EffectID": "modp-net-1",
        "Effect": {
            "EffectType": "ModifyPoints",
            "EffectPointTarget": "Network",
            "EffectMagnitude": "1"
        }
    },
    {
        "EffectID": "modp-phys-1",
        "Effect": {
            "EffectType": "ModifyPoints",
            "EffectPointTarget": "Physical",
            "EffectMagnitude": "1"
        }
    },
    {
        "EffectID": "modp-fin-1",
        "Effect": {
            "EffectType": "ModifyPoints",
            "EffectPointTarget": "Financial",
            "EffectMagnitude": "1"
        }
    },
    {
        "EffectID": "mod-all-1",
        "Effect": {
            "EffectType": "ModifyPoints",
            "EffectPointTarget": "All",
            "EffectMagnitude": "1"
        }
    },
    {
        "EffectID": "fortify",
        "Effect": {
            "EffectType": "Fortify"
        }
    },
    {
        "EffectID": "remove",
        "Effect": {
            "EffectType": "Remove"
        }
    },
    {
        "EffectID": "backdoor",
        "Effect": {
            "EffectType": "Backdoor"
        }
    },
    {
        "EffectID": "modpn-net-1",
        "Effect": {
            "EffectType": "ModifyPoints",
            "EffectPointTarget": "Network",
            "EffectMagnitude": "-1"
        }
    },
    {
        "EffectID": "modpn-phys-1",
        "Effect": {
            "EffectType": "ModifyPoints",
            "EffectPointTarget": "Physical",
            "EffectMagnitude": "-1"
        }
    },
    {
        "EffectID": "modpn-fin-1",
        "Effect": {
            "EffectType": "ModifyPoints",
            "EffectPointTarget": "Financial",
            "EffectMagnitude": "-1"
        }
    },
    {
        "EffectID": "modn-all-1",
        "Effect": {
            "EffectType": "ModifyPoints",
            "EffectPointTarget": "All",
            "EffectMagnitude": "-1"
        }
    },
    {
        "EffectID": "modp-net-2",
        "Effect": {
            "EffectType": "ModifyPoints",
            "EffectPointTarget": "Network",
            "EffectMagnitude": "2"
        }
    },
    {
        "EffectID": "modp-phys-2",
        "Effect": {
            "EffectType": "ModifyPoints",
            "EffectPointTarget": "Physical",
            "EffectMagnitude": "2"
        }
    },
    {
        "EffectID": "modp-fin-2",
        "Effect": {
            "EffectType": "ModifyPoints",
            "EffectPointTarget": "Financial",
            "EffectMagnitude": "2"
        }
    },
    {
        "EffectID": "mod-all-2",
        "Effect": {
            "EffectType": "ModifyPoints",
            "EffectPointTarget": "All",
            "EffectMagnitude": "2"
        }
    },
    {
        "EffectID": "modpn-net-2",
        "Effect": {
            "EffectType": "ModifyPoints",
            "EffectPointTarget": "Network",
            "EffectMagnitude": "-2"
        }
    },
    {
        "EffectID": "modpn-phys-2",
        "Effect": {
            "EffectType": "ModifyPoints",
            "EffectPointTarget": "Physical",
            "EffectMagnitude": "-2"
        }
    },
    {
        "EffectID": "modpn-fin-2",
        "Effect": {
            "EffectType": "ModifyPoints",
            "EffectPointTarget": "Financial",
            "EffectMagnitude": "-2"
        }
    },
    {
        "EffectID": "modn-all-2",
        "Effect": {
            "EffectType": "ModifyPoints",
            "EffectPointTarget": "All",
            "EffectMagnitude": "-2"
        }
    },
    {
        "EffectID": "modppt-all-1",
        "Effect": {
            "EffectType": "ModifyPointsPerTurn",
            "EffectPointTarget": "All",
            "EffectMagnitude": "-1"
        }
    },
    {
        "EffectID": "modppt-net-1",
        "Effect": {
            "EffectType": "ModifyPointsPerTurn",
            "EffectPointTarget": "Network",
            "EffectMagnitude": "-1"
        }
    },
    {
        "EffectID": "modppt-fin-1",
        "Effect": {
            "EffectType": "ModifyPointsPerTurn",
            "EffectPointTarget": "Financial",
            "EffectMagnitude": "-1"
        }
    },
    {
        "EffectID": "modppt-phys-1",
        "Effect": {
            "EffectType": "ModifyPointsPerTurn",
            "EffectPointTarget": "Physical",
            "EffectMagnitude": "-1"
        }
    },
    {
        "EffectID": "honey-pot",
        "Effect": {
            "EffectType": "HoneyPot"
        }
    },
    {
        "EffectID": "temp-max-phys-1",
        "Effect": {
            "EffectType": "TempMaxPoints",
            "EffectPointTarget": "Physical",
            "EffectMagnitude": "1"
        }
    },
    {
        "EffectID": "temp-max-net-1",
        "Effect": {
            "EffectType": "TempMaxPoints",
            "EffectPointTarget": "Network",
            "EffectMagnitude": "1"
        }
    },
    {
        "EffectID": "temp-max-fin-1",
        "Effect": {
            "EffectType": "TempMaxPoints",
            "EffectPointTarget": "Financial",
            "EffectMagnitude": "1"
        }
    }
]
cur = conn.cursor()
# Process each item in the JSON data
for item in json_data:
    effect_id = item.get('EffectID')
    effect = item.get('Effect', {})
    effect_type = effect.get('EffectType')
    effect_point_target = effect.get('EffectPointTarget')
    effect_magnitude = effect.get('EffectMagnitude')

    # Convert effect_magnitude to integer if it's not None
    if effect_magnitude is not None:
        try:
            effect_magnitude = int(effect_magnitude)
        except ValueError:
            print(f"Invalid effect_magnitude '{effect_magnitude}' for effect_id '{effect_id}'")
            effect_magnitude = None

    # Prepare the SQL INSERT statement with placeholders
    insert_query = """
    INSERT INTO effect_type (effect_id, effect_type, effect_point_target, effect_magnitude)
    VALUES (%s, %s, %s, %s)
    ON CONFLICT (effect_id) DO NOTHING
    """

    # Execute the query
    try:
        cur.execute(insert_query, (effect_id, effect_type, effect_point_target, effect_magnitude))
    except Exception as e:
        print(f"Error inserting effect_id '{effect_id}': {e}")

# Commit the transaction
conn.commit()

# Close the cursor and connection
cur.close()
conn.close()