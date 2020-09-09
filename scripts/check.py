import os
import sys
import json

parent_dir = "./asset/"
SYMBOL_NOT_PRESENT_ERROR = "json does not have 'symbol' key"
NAME_NOT_PRESENT_ERROR = "json does not have 'name' key"
CAPIP20_NOT_PRESENT_ERROR = "json does not have 'capip-20' key"
IOV_NAME_SERVICE_URI_NOT_PRESENT_ERROR = "json does not have 'iov-name-service-uri' key"
SYMBOL_FILENAME_MATCH_ERROR = "asset name does not match with filename. Name the file as {assetname}.json"
IOV_NAME_SERVICE_URI_DOES_NOT_MATCH_ERROR = "'iov-name-service-uri' should be in the form 'asset:{assetname}'"

def error(error_message, d):
  print(error_message)
  print(json.dumps(d, indent=4))
  sys.exit(1)

def check_format(d):
  if "symbol" not in d:
    error(SYMBOL_NOT_PRESENT_ERROR, d)
  if "name" not in d:
    error(NAME_NOT_PRESENT_ERROR, d)
  if "caip-20" not in d:
    error(CAPIP20_NOT_PRESENT_ERROR, d)
  if "iov-name-service-uri" not in d:
    error(IOV_NAME_SERVICE_URI_NOT_PRESENT_ERROR, d)

for file in os.listdir(parent_dir):
  with open(os.path.join(parent_dir, file), "r") as f:
    d = json.load(f)
    check_format(d)
    asset = file[:-5]
    if d['symbol'].lower() != asset:
      error(SYMBOL_FILENAME_MATCH_ERROR, d)
    if d['iov-name-service-uri'] != ('asset:'+asset):
      error(IOV_NAME_SERVICE_URI_DOES_NOT_MATCH_ERROR, d)

sys.exit()


