import json

# Read the data from the lakes.json file
with open("lakes.json", "r") as file:
    lakes_data = json.load(file)

# Modify the url key in the dictionaries
for lake in lakes_data:
    lake["url"] = lake["url"].replace("https://zvejogidas.lt/", "")

    # Split the URL and create new keys
    url_parts = lake["url"].split("/")
    if url_parts[0] == "ezeras":
        lake["lake"] = True
        lake["river"] = False
        lake["name"] = url_parts[1]
    else:
        lake["lake"] = False
        lake["river"] = True
        lake["name"] = url_parts[0]
    lake.pop("url")

# Write the modified data to a new JSON file
with open("modified_lakes.json", "w") as file:
    json.dump(lakes_data, file, indent=2)