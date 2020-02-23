import glob
import os
import re

underscore = re.compile(r"[ -]+", re.IGNORECASE)

def process(name):
    name = underscore.sub('_', name)
    name = name.replace('piglette', 'pig')
    name = name.replace('_a', '_')
    return name.strip().lower()

for filename in glob.iglob('music/**/*.ogg', recursive=True):
    print(filename)
    os.rename(filename, process(filename))