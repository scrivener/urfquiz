##to read dataframe

import pickle
import pandas as pd

#load pickled dataframe with matchdata
mydf=pickle.load(open("finaldf.p",'rb'))
pd.set_option('display.max_columns',200)

#make winlist


#apparently ids aren't just straight from 1-124, who knew
#fetch champion ids from keyfile, which contains champion ids extracted
#from static riot data
with open("keys.txt","rb") as keyfile:
    keylist1=keyfile.readlines()
keylist=[eval(item.strip()) for item in keylist1]
print keylist

#make a list of lists with [winnum, totalgames]
winlist=[]
i=0
for champion in keylist:
    print champion
    winlist.append([0,0])
    for index,row in mydf.iterrows():
        if row['100_winner']:
            if row['1100championId']==champion or row['2100championId']==champion \
            or row['3100championId']==champion or row['4100championId']==champion \
            or row['5100championId']==champion:
                winlist[i][0]+=1
                winlist[i][1]+=1
            elif row['6200championId']==champion or row['7200championId']==champion \
            or row['8200championId']==champion or row['9200championId']==champion \
            or row['10200championId']==champion:
                winlist[i][1]+=1
            else:
                pass
        else:
            if row['1100championId']==champion or row['2100championId']==champion \
            or row['3100championId']==champion or row['4100championId']==champion \
            or row['5100championId']==champion:
                winlist[i][1]+=1
            elif row['6200championId']==champion or row['7200championId']==champion \
            or row['8200championId']==champion or row['9200championId']==champion \
            or row['10200championId']==champion:
                winlist[i][0]+=1
                winlist[i][1]+=1
            else:
                pass
    i+=1

#tie winrates to champnames using json of championdata
import json
f=open("champion.json","rb")
fread=f.read()
champdict=json.loads(fread)
champdict1=champdict[u'data']
champnamekeydict={}
for key in champdict1.keys():
    champnamekeydict[eval(champdict1[key][u'key'])]=key.encode('ascii','replace')

#ok so we have key: name in champnamekeydict
#winlist [[wongames,totalgames]]
#keylist [champid]
from __future__ import division
i=0
parseablelist=[]
for item in winlist:
    parseablelist.append([champnamekeydict[keylist[i]], item[0]/item[1],item[1]])
    i+=1
