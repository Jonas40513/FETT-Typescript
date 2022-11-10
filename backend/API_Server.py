import sys
import time
from datetime import datetime
import threading

import requests
from flask import Flask
from flask import json
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, messaging

app = Flask(__name__)
CORS(app)
UPDATE_DELAY = 10
emergencies = []
last_update = -1

# Change Path
firebase_cred = credentials.Certificate(
    "S:\\5BHIF\\NVS\\MobileComputing\\Project\\FETT-Typescript\\Backend\\service.json")
firebase_app = firebase_admin.initialize_app(firebase_cred)


def load_emergencies():
    while True:
        if app.debug:
            print('Loading data')
        old_emergencies = emergencies
        emergencies.clear()
        ff = requests.request("GET", "https://intranet-x.ooelfv.at/webext2/rss/json_2tage.txt").json()
        for k, v in ff['einsaetze'].items():
            emergency = v['einsatz']
            emergencies.append({"id": v['einsatz']["num1"],
                                "start": parse_date(emergency['startzeit']),
                                "end": parse_date(emergency['inzeit']),
                                "level": int(emergency['alarmstufe']),
                                "type": str(emergency['einsatzart']),
                                "subtype": str(emergency['einsatzsubtyp']['text']).strip(),
                                "location": str(emergency['adresse']['default']).strip().replace('None', 'null'),
                                "town": str(emergency['adresse']['earea']).strip(),
                                "district": str(emergency['bezirk']['text']).strip(),
                                "longitude": float(emergency['wgs84']['lng']),
                                "latitude": float(emergency['wgs84']['lat']),
                                "departments": get_departments(emergency)})

        new_emergencies = get_new_emergencies(old_emergencies, emergencies)
        for i in new_emergencies:
            print("Send")
            send_topic_push("Neuer Einsatz", "Neuer Einsatz", i.town)
        time.sleep(60)


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


def get_new_emergencies(old_emergencies, new_emergencies):
    return [em for em in new_emergencies if em not in old_emergencies]


def send_topic_push(title, body, topic_name):
    topic = topic_name
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body
        ),
        topic=topic
    )
    messaging.send(message)


@app.route('/emergencies')
def emergencies_route():
    response = app.response_class(
        response=json.dumps(emergencies),
        mimetype='application/json'
    )

    return response


def check_debug():
    commands = set(['-d', '-debug'])
    return len(commands - set(sys.argv)) < len(commands)


if __name__ == '__main__':
    print("Test")
    x = threading.Thread(target=load_emergencies, daemon=True)
    x.start()
    print("Test")
    app.run(host='0.0.0.0', port=1220, debug=True)
