import requests
import json
from bs4 import BeautifulSoup
import os
import glob

parent_dir = "./asset/"
URL = 'https://docs.iov.one/for-developers/tutorial/symbol-list'
table_class = 'table-0f56c2d8'


def create_data(data):
  path = os.path.join(parent_dir, data['asset'])
  if not os.path.exists(path):
    os.mkdir(path)
  data_json = json.dumps(d)
  print(data_json)
  with open(os.path.join(path,'index.json'), 'w') as fp:
    fp.write(data_json)
    print('Created index.json for', data['asset'])


if not os.path.exists(parent_dir):
  os.mkdir(parent_dir)

page = requests.get(URL)
soup = BeautifulSoup(page.content, 'html.parser')
table = soup.find_all('table', class_=table_class)
for tr in table[0].find_all('tr')[1:]:
    td = tr.find_all('td')
    asset = td[1].text.strip()
    name = td[0].text.strip(u'\u200b').strip()
    d = {
        'asset': asset,
        'name': name,
        'chainId': ''
    }
    create_data(d)


