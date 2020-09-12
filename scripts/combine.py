import os
import json
import glob

parent_dir = "./asset/"

chain_list = []
for file in os.listdir(parent_dir):
    with open(os.path.join(parent_dir, file), "r") as f:
        if (file == 'asset.json'):
            continue
        d = json.load(f)
        chain_list.append(d)

print(chain_list)

with open(os.path.join(parent_dir, 'asset.json'), "w") as asset:
    json.dump(chain_list, asset)