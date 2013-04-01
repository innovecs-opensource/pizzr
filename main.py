from flask import Flask, request
import json
import pymongo
import pystache
import os
from bson import json_util
from pymongo import MongoClient

mongo = MongoClient() 
app = Flask( __name__ )

def importtpls( tpldir ):
	tpls = {}
	for filename in os.listdir( tpldir ):
	    f = open( os.path.join( tpldir, filename ), "r" )
	    tpls[ os.path.splitext( filename )[0] ] = "\n".join( f.readlines() )
	return tpls

TPL = importtpls( 'tpl' )

@app.route('/')
def hello():
	print TPL
	return TPL['index']

@app.route('/wish', methods = ['GET', 'POST'])
def list():
	db = mongo.pizzr

	if request.method == 'POST':
		obj = json_util.loads( request.data )
		db.wishes.insert( obj )

	wishes = []
	for wish in db.wishes.find():
		wishes.append(wish)
	return json_util.dumps( wishes )



if __name__ == "__main__":
	app.debug = True
	app.run()