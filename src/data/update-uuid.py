import json
import uuid

# Read the JSON data from the file
with open('./card-data.json', 'r') as file:
    data = json.load(file)

# Update each object's GUID with a new UUID
for item in data:
    item['GUID'] = str(uuid.uuid4())

# Write the updated data back to the file
with open('./card-data.json', 'w') as file:
    json.dump(data, file, indent=4)