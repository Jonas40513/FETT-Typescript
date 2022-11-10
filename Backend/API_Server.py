import sys
import time
from datetime import datetime

import requests
from flask import Flask
from flask import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
UPDATE_DELAY = 10
emergencies = []
last_update = -1


def load_emergencies():
    global last_update
    if app.debug:
        print('Loading data')
    emergencies.clear()
    last_update = time.time()
    ff = requests.request("GET", "https://intranet-x.ooelfv.at/webext2/rss/json_2tage.txt").json()
    for k, v in ff['einsaetze'].items():
        emergency = v['einsatz']
        emergencies.append({"id": v['einsatz']["num1"],
                            "start": parse_date(emergency['startzeit']),
                            "end": parse_date(emergency['inzeit']),
                            "level": int(emergency['alarmstufe']),
                            "type": str(emergency['einsatzart']),
                            "subtype": str(emergency['einsatzsubtyp']['text']).strip(),
                            "location": str(emergency['adresse']['default']).strip().replace('None','null'),
                            "town": str(emergency['adresse']['earea']).strip(),
                            "district": str(emergency['bezirk']['text']).strip(),
                            "longitude": float(emergency['wgs84']['lng']),
                            "latitude": float(emergency['wgs84']['lat']),
                            "departments": get_departments(emergency)})


def get_departments(emergency):
    departments = []
    for k, v in emergency['feuerwehrenarray'].items():
        departments.append({"name": v["fwname"]})
    return departments


def parse_date(date):
    if date == "":
        return None
    a = datetime.strptime(date, '%a, %d %b %Y %H:%M:%S %z')
    return str(a).replace(" ", "T")


@app.route('/emergencies')
def emergencies_route():
    global last_update
    if last_update + UPDATE_DELAY <= time.time():
        load_emergencies()
    response = app.response_class(
        response=json.dumps(emergencies),
        mimetype='application/json'
    )
    
    return response


def check_debug():
    commands = set(['-d', '-debug'])
    return len(commands - set(sys.argv)) < len(commands)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1220, debug=check_debug())
