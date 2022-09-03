from flask import Flask,jsonify
from flask_cors import CORS
import random,os,base64

'''

Don't Forget To Change SERVER in kagsa.js

'''

app = Flask(__name__)
cors = CORS(app,resources={r'/run/*' : {'origins':'*'} })
module_dir = os.path.abspath(os.path.dirname(__file__))

@app.route('/')
def main():
    return '<h2>KAGSA API Project</h2><p>KAGSA Framework for Frontend , Visit <a href="https://github.com/kagsa/kagsa-web" >Github</a></p>'


@app.route('/run/<CODE>')
def run (CODE):
    # Decode The code from base64 to normal text
    CODE = CODE.encode("ascii")
    B64 = base64.b64decode(CODE)
    CODE = B64.decode("ascii")

    # Create random file name
    fn  = str(random.randint(10000,99999))
    kg  = fn + '.kg'
    txt = fn + '.txt'

    # Check if System/File modules is in code
    if 'File' in CODE:
        return jsonify(state='400',code='error: "File" module is not allowed')
    if 'System' in CODE:
        return jsonify(state='400',code='error: "System" module is not allowed')

    # Write to file
    kgfile = open(kg,'w')
    kgfile.write(CODE)
    kgfile.close()

    # Run
    try:
        os.system(f'kagsa {kg} > {txt}')
        x   = open(txt,'r')
        out = x.read().replace(kg,'(stdin)').replace('<file>','(file)').replace('\x1b[1;31m','').replace('\x1b[0m','').replace('\x1b[0;36m','').replace('\x1b[0;33m','')
        x.close()
        S = '200'
        if out.startswith('error catched [ (stdin)'):
            S = '400'
        os.remove(kg)
        os.remove(txt)
        return jsonify(state=S,code=out)
    except Exception as e:
        etype = type(e)
        etext = str(e)

        er = open(os.path.join(module_dir, "/home/kagsa/mysite/error.log"),'a')
        er.write('\n\n' + CODE + '\n' + f'{etype} : {etext}')
        er.close()
        return jsonify(state='400',code='error: unknown error')

