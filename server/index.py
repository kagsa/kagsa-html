from flask import Flask,request
from flask_cors import CORS
import random,os


app = Flask(__name__)
cors = CORS(app,resources={r'*' : {'origins':'*'} })

@app.route('/')
def run ():
    try:
        CODE = request.args.get('code',default='',type=str).replace('&amp;','&')
    except:
        return ''
    # Create random file name
    fn  = ''.join(random.sample('qwertyuioplkjhgfdsazxcvbnmPOIUYTREWQASDFGHJKLMNBVCXZ12345678900987654321',12))
    kg  = fn + '.kg'
    txt = fn + '.txt'
    # Write to file
    kgfile = open(kg,'w')
    kgfile.write('delvar System;delvar File;\n'+CODE)
    kgfile.close()
    # Run
    try:
        os.system(f'kagsa {kg} > {txt}')
        x   = open(txt,'r')
        out = x.read().replace('\n','<br>').replace(kg,'(file)').replace('\x1b[1;31m','').replace('\x1b[0m','').replace('\x1b[0;36m','').replace('\x1b[0;33m','')
        x.close()
        os.remove(kg)
        os.remove(txt)
        return out
    except Exception as e:
        print('='*40)
        print(e)
        print('='*40)
        return 'error: unknown error'


app.run()