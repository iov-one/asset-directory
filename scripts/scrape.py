import requests
import json
from bs4 import BeautifulSoup
import os
import glob

parent_dir = "./asset/"
URL = 'https://docs.iov.one/for-developers/tutorial/symbol-list'
table_class = 'table-0f56c2d8'
available_chains = [
    { "id": "atom", "name": "ATOM", "asset": "atom" },
    { "id": "iris", "name": "IRIS", "asset": "iris" },
    {
      "id": "cosmos-binance-chain-tigris",
      "name": "Binance Chain",
      "asset": "bnb"
    },
    { "id": "kava", "name": "KAVA", "asset": "kava" },
    { "id": "band", "name": "Band Protocol", "asset": "band" },
    { "id": "okb", "name": "OKB", "asset": "okb" },
    { "id": "ethereum", "name": "Ethereum", "asset": "eth" },
    { "id": "bitcoin", "name": "Bitcoin", "asset": "btc" },
    { "id": "tezos", "name": "Tezos", "asset": "xtz" },
    { "id": "litecoin", "name": "Litecoin", "asset": "ltc" },
    { "id": "bitcoin-cash", "name": "Bitcoin Cash", "asset": "bch" },
    { "id": "savitar-token", "name": "SavitarToken", "asset": "svt" },
    { "id": "tether", "name": "Tether", "asset": "usdt" }
  ]

non_interecting_chains = [
  {
    'symbol': 'SVT',
    'name': 'Savitar Token',
    'iov-name-service-uri': 'asset:svt',
    'caip-20': ''
  }
]

def matches_available_chains(d):
  """
  d1 is the data scrapped
  d2 is the data from available_chains
  """
  ticker = d['symbol'].lower()
  for chain in available_chains:
    if chain['asset'].lower() == ticker:
      return True
  return False

def create_data(data):
  data_json = json.dumps(data)
  print(data_json)
  with open(os.path.join(parent_dir,data['symbol'].lower()+'.json'), 'w') as fp:
    fp.write(data_json)
    print('Created index.json for', data['symbol'])


if not os.path.exists(parent_dir):
  os.mkdir(parent_dir)

page = requests.get(URL)
soup = BeautifulSoup(page.content, 'html.parser')
table = soup.find_all('table', class_=table_class)
for tr in table[0].find_all('tr')[1:]:
    td = tr.find_all('td')
    symbol = td[1].text.strip()
    name = td[0].text.strip(u'\u200b').strip()
    d = {
        'symbol': symbol,
        'name': name,
        'iov-name-service-uri': 'asset:'+symbol.lower(),
        'caip-20': ''
    }
    if matches_available_chains(d):
      create_data(d)

for chain in non_interecting_chains:
  create_data(chain)

