from flask import Flask
import json
import pymongo
import pystache
import os
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

@app.route('/wishes')
def list():
	db = mongo.pizzr
	db.wishes
	return ''

if __name__ == "__main__":
	app.debug = True
	app.run()