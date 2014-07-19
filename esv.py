import logging
import requests

def get_passage(passage):
	logging.info('Fetching text for %s' % passage)
	url = ("http://www.esvapi.org/v2/rest/passageQuery?key=IP&passage={passage}" + \
	"&include-audio-link=false" + \
	"&include-footnotes=false" + \
	"&include-headings=false" + \
	"&include-passage-references=false" + \
	"&include-short-copyright=false" + \
	"&include-subheadings=false" + \
	"&include-verse-numbers=false").format(
		passage=passage)
	response = requests.get(url)
	return response.text