import os
import sys
import json

parent_dir = "./asset/"

def error():
  sys.exit(1)

def check_format(d):
  if "symbol" not in d or "name" not in d or "caip-20" not in d or "iov-name-service-uri" not in d:
    print('incorrect json')
    error()

for file in os.listdir(parent_dir):
  # print(file)
  with open(os.path.join(parent_dir, file), "r") as f:
    d = json.load(f)
    asset = file[:-5]
    if asset == 'asset':
      continue
    check_format(d)
    if d['symbol'].lower() != asset:
      error()
    if d['iov-name-service-uri'] != ('asset:'+asset):
      error()

sys.exit()


