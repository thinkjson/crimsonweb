import os
import sys
sys.path.insert(1, os.path.join(os.path.abspath('.'), 'lib'))

from esv import get_passage
from flask import Flask, jsonify
from flask_cache import Cache
import json
import logging
import os
import utils
import time

app = Flask('crimson')
cache = Cache(app, config={
	"CACHE_TYPE": 'gaememcached'
})

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))

@app.route("/api/")
def index():
    return "API documentation"

@cache.memoize(timeout=84600)
@app.route("/api/books")
def books():
	with open(os.path.join(__location__, 'data/books.json')) as f:
		return jsonify(json.load(f))

@app.route("/api/read/<reference>")
def read(reference):
	cache_key = utils.make_cache_key('read_%s' % reference)
	passage = cache.get(cache_key)
	cached = True
	if passage is None:
		cached = False
		passage = get_passage(reference)
		cache.set(cache_key, passage, 86400)
	response = jsonify({
		"cached": cached,
		"fetched": time.time() * 1000,
		"text": passage
	})
	response.cache_control.max_age = 300
	return response

if __name__ == "__main__":
    app.run()