import os
import sys
sys.path.insert(1, os.path.join(os.path.abspath('.'), 'lib'))

from flask import Flask, jsonify
from flask_cache import Cache
import logging
from esv import get_passage

app = Flask('crimson')
cache = Cache(app, config={
	"CACHE_TYPE": 'gaememcached'
})

@app.route("/api/")
def index():
    return "API documentation"

@app.route("/api/read/<passage>")
def read(passage):
	cache_key = 'read_%s' % passage
	text = cache.get(cache_key)
	cached = True
	if text is None:
		cached = False
		text = get_passage(passage)
		cache.set(cache_key, text)
	response = jsonify({
		"cached": cached,
		"text": text
	})
	response.cache_control.max_age = 300
	return response

if __name__ == "__main__":
    app.run()