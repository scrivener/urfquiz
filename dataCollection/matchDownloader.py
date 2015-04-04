#!/usr/bin/python

# This script hits the Riot API endpoint for URF game stats,
# grabs all the games known about that we don't yet have, and
# pulls them down, storing them.
import yaml
import sys
import requests
import json
import pprint
import time
from retrying import retry
from datetime import datetime, timedelta

keys = yaml.load(open('../keys.yaml'))
apiKey = keys['riot_api_key']
if (apiKey == None):
  print "No api key."
  sys.exit(-1)

def getRoundedEpochSecsEightHoursAgo():
  eightHoursAgo = datetime.utcnow() + timedelta(hours=-8)
  roundedOff = eightHoursAgo - timedelta(minutes=eightHoursAgo.minute % 5,
                                         seconds=eightHoursAgo.second,
                                         microseconds=eightHoursAgo.microsecond)
  unixEpoch = datetime.utcfromtimestamp(0)
  return (roundedOff - unixEpoch).total_seconds()

def getNextTimeSliceToDownload():
  possibleSlice = getRoundedEpochSecsEightHoursAgo() 

  # List of already downloaded times is in the textfile slicesDownloaded.txt
  # Care the entries have newlines at the end.
  # This makes sure we don't replicate downloads 
  try:
    with open("slicesDownloaded.txt", "r") as downloadedSliceFile:
      downloadedSlices = set([line.strip() for line in downloadedSliceFile.readlines()])
  except IOError as e:
      downloadedSlices = []

  while str(possibleSlice) in downloadedSlices:
    possibleSlice = possibleSlice + 300
  if datetime.utcfromtimestamp(possibleSlice) > datetime.utcnow():
    print 'We have retrieved all games up to the present. Sleeping for an hour.'
    time.sleep(3600)
  return possibleSlice

@retry(wait_exponential_multiplier=1500, wait_exponential_max=15000)
def getGameIDsForTimeSlice(beginDate):
  gameIDsURL = 'https://na.api.pvp.net/api/lol/na/v4.1/game/ids?api_key=%s&beginDate=%d' % (apiKey, beginDate)
  results = requests.get(gameIDsURL)
  data = json.loads(results.text)
  if (results.status_code == 200):
    return data
  else:
    print 'Failure to retrieve game ID list with status code: %d' % (results.status_code)
    print results.text
    raise IOError('(retrying) Failure to retrieve game ID list with status code: %d' % (results.status_code))

@retry(wait_exponential_multiplier=1500, wait_exponential_max=15000)
def getMatch(matchid):
  url = 'https://na.api.pvp.net/api/lol/na/v2.2/match/%d?api_key=%s' % (matchid, apiKey)
  results = requests.get(url)
  data = json.loads(results.text)
  if results.status_code == 200:
      return data
  else:
    print 'Failure to download match details with status code: %d' % (results.status_code)
    print results.text
    raise IOError('(retrying) Failed to download match details with status code: %d' % (results.status_code))

    
def main():
  while True:
    beginDate = getNextTimeSliceToDownload()
    matchids = getGameIDsForTimeSlice(beginDate)

    print 'Downloading %d matches from time slice %d (%s)' % (len(matchids), 
                                                              beginDate, 
                                                              datetime.utcfromtimestamp(beginDate))
    # Record that we've downloaded this slice.
    with open("slicesDownloaded.txt", "a+") as slicesFile:
      slicesFile.write(str(beginDate))
      slicesFile.write('\n')

    for matchid in matchids:
      filename = str(matchid)
      with open(filename, "w") as matchfile:
        print 'Downloading match %d' % (matchid,)
        matchfile.write(str(getMatch(matchid)))

      time.sleep(1.5)

if __name__ == '__main__':
  main()
