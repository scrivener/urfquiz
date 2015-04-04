import simplejson
import re
import pandas as pd
import ast

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
                        #going to add to df with and without teamid
                        for ban in entry2:                              
                            banidkey=str(teamId)+'_'+str(ban[u'pickTurn'])+'ban'
                            dfdict[banidkey]=ban[u'championId']
        elif len(entry)== 10:
            #this is the per player data.
            #One list just contains participantids1-10; don't look at it.
            if len(entry[0].keys()) == 1:
                pass
            else:
            #the other list has ALL the player data.
                for dict2 in entry:
                    for key2 in dict2.keys():
                        entry2=dict2[key2]
                        if type(entry2) != list:
                            print key2,entry2
                        else:
                            print('imalist')
        else:
            print("this shouldn't happen...")
                            
testdf=pd.DataFrame([dfdict])
print testdf.head()
            
