import simplejson
import re
import pandas as pd
import ast
#make file JSON-parseable
with open("1780549587","rb") as f:
    rf=f.read()
dictf=ast.literal_eval(rf)
dfdict={}
#outermost level: level 1
for key in dictf.keys():
    entry=dictf[key]
    if type(entry) != list:
        dfdict[key]=entry
    else:
        #level 2: dict within dict
        if len(entry) == 2:
            #this is the dictionary of team stats for each team
            for dict2 in entry:
                teamId=dict2[u'teamId']
                for key2 in dict2.keys():
                    entry2=dict2[key2]
                    if type(entry2) != list:
                        idkey2=str(teamId)+'_'+key2
                        dfdict[idkey2]=entry2
                    else:
                        #these are the bans
                        for ban in entry2
                        print entry2
testdf=pd.DataFrame([dfdict])
print testdf
            
