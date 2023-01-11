import sys
import time
from datetime import datetime
import threading

import requests
from flask import Flask, request
from flask import json
from flask_cors import CORS
from pywebpush import webpush, WebPushException

app = Flask(__name__)
CORS(app)
UPDATE_DELAY = 10
emergencies = []
last_update = -1
subscriptions = []


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
                                "location": check_location(str(emergency['adresse']['default'])),
                                "town": str(emergency['adresse']['earea']).strip(),
                                "district": str(emergency['bezirk']['text']).strip(),
                                "longitude": float(emergency['wgs84']['lng']),
                                "latitude": float(emergency['wgs84']['lat']),
                                "departments": get_departments(emergency)})

        new_emergencies = get_new_emergencies(old_emergencies, emergencies)
        for i in new_emergencies:
            print("Send")
            sendToAll(i.town, i.id)
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


def check_location(location):
    location = location.strip()
    if location == "" or location == "None":
        return None
    return location


def get_new_emergencies(old_emergencies, new_emergencies):
    return [em for em in new_emergencies if em not in old_emergencies]


def sendToAll(name, id):
    for i in subscriptions:
        print(i)
        sendNotification(name,id, i)


def sendNotification(name,id, subscription_info):
    try:
        webpush(
            subscription_info=subscription_info,
            data=json.dumps({"title": "Neuer Einsatz", "body": str(name),"id":str(id)}),
            vapid_private_key="QJaFsqMp6ODGVJZCfSQOcEEvgO-bffRytvO0HUxI5Ww",
            vapid_claims={
                "sub": "mailto:example@yourdomain.org",
            }
        )
    except WebPushException as ex:
        # Mozilla returns additional information in the body of the response.
        if ex.response and ex.response.json():
            extra = ex.response.json()
            print("Remote service replied with a {}:{}, {}",
                  extra.code,
                  extra.errno,
                  extra.message
                  )
            subscriptions.remove(subscription_info)


@app.route('/emergencies')
def emergencies_route():
    response = app.response_class(
        response=json.dumps(emergencies),
        mimetype='application/json'
    )

    return response


@app.route("/subscribe", methods=['POST'])
def notification_subscribe():
    data = request.data
    data = str(data).replace('"expirationTime":null,', "").replace("b'", "").replace("'", "")
    a = json.loads(data)
    if a not in subscriptions:
        print("Append")
        subscriptions.append(a)
    return '', 204


@app.route("/test")
def sendTest():
    sendToAll("FF Lungitz","E230100799")
    return '', 204


def check_debug():
    commands = set(['-d', '-debug'])
    return len(commands - set(sys.argv)) < len(commands)


if __name__ == '__main__':
    print("Test")
    x = threading.Thread(target=load_emergencies, daemon=True)
    x.start()
    print("Test")
    app.run(host='0.0.0.0', port=1220, debug=True)
