import hashlib

def make_cache_key(key):
    return hashlib.sha1(key).hexdigest()