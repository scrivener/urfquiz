#!/usr/bin/python

# This script hits the Riot API endpoint for URF game stats,
# grabs all the games known about that we don't yet have, and
# pulls them down, storing them.
import yaml
import sys
import requests
import json
from datetime import datetime, timedelta

keys = yaml.load(open('keys.yaml'))
apiKey = keys['riot_api_key']
if (apiKey == None):
  print "No api key."
  sys.exit(-1)

def getEpochSecondsEightHoursAgo():
  eightHoursAgo = datetime.now() + timedelta(hours=-8)
  roundedOff = eightHoursAgo - timedelta(minutes=eightHoursAgo.minute % 5,
                                         seconds=eightHoursAgo.second,
                                         microseconds=eightHoursAgo.microsecond)
  epoch = datetime.utcfromtimestamp(0)
  delta = roundedOff - epoch
  return delta.total_seconds()

def getGameIDList():
  beginDate = getEpochSecondsEightHoursAgo()
  gameIDsURL = 'https://na.api.pvp.net/api/lol/na/v4.1/game/ids?api_key=%s&beginDate=%d' % (apiKey, beginDate)
  results = requests.get(gameIDsURL)
  data = json.loads(results.text)
  print data
    
def main():
  getGameIDList()



if __name__ == '__main__':
  main()
