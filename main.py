from flask import Flask, request
import json
import pymongo
import pystache
import os
import time
from bson import json_util
from pymongo import MongoClient
from threading import Timer

db = MongoClient().pizzr 
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

@app.route('/is_updated/<since>')
def checkupdate( since ):
	ts_obj = db.items.find_one('timestamp')
	ts = ts_obj['time']
	if ts - float( since ) > 0.01:
		return str(ts)
	else:
		return since

# get list and save new
@app.route('/wish', methods = ['GET', 'POST'])
def list():
	if request.method == 'POST':
		ret = json_util.loads( request.data )
		db.wishes.insert( ret )
	else:
		ret = []
		for wish in db.wishes.find():
			ret.append(wish)

	return json_util.dumps( ret )

# delete by id
@app.route('/wish/<id>', methods = ['DELETE', 'PUT'])
def one( id ):
	db.wishes.remove( {'_id': id} )
	ret = 'OK'

	if request.method == 'PUT':
		ret = json_util.loads( request.data )
		db.wishes.insert( ret )

	db.items.remove({'_id': 'timestamp'})
	db.items.insert({
		'_id': 'timestamp',
		'time': time.time()
	}) 

	return json_util.dumps( ret )

if __name__ == "__main__":
	app.debug = True
	app.run()