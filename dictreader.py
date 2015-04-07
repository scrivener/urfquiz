import re
import pandas as pd
import ast
import os
import pickle
#read json and write out a dataframe
filelist=os.listdir("dataCollection/")
all_dictionaries=[]
for datafile in filelist:
    urfdatapath="dataCollection/"+datafile
    with open(urfdatapath,"rb") as f:
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
                                pId=dict2[u'participantId']
                                teamId=dict2[u'teamId']
                                personalId=str(pId)+str(teamId)
                                idkey=personalId+key2
                                dfdict[idkey]=entry2
                            else:
                                #not dealing with this for the moment, has ind data.
                                pass
            else:
                print("this shouldn't happen...")
    all_dictionaries.append(dfdict)
print "here is the first entry"
print all_dictionaries[0]
print "is there a second entry I hope"
print all_dictionaries[1]
finaldf=pd.DataFrame(all_dictionaries)
pickle.dump(finaldf, open("finaldf.p","wb"))
print finaldf.head()
            
