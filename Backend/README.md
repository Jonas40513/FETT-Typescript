# Explanation:
This Python Flask Server gets the data from the offical [website of the "Oö. Landes-Feuerwehrverband"](https://intranet-x.ooelfv.at/webext2/rss/json_taeglich.txt).

We parse the original JSON data that looks like this:
```json
einsatz: {
    "num1": "Einsatznummer",
    "einsatzort": "Bezirk - Ort",
    "startzeit": "Wed, 26 Jan 2022 16:32:14 +0100",
    "inzeit": "",
    "status": "offen",
    "alarmstufe": 1,
    "einsatzart": "TEE",
    "einsatztyp": {
        "id": "ALKLEIN",
        "text": "KLEINALARM FEUERWEHREINSATZ (AL-MITTEL REDUZIERT)"
    },
    "einsatzsubtyp": {
        "id": "1-TELEFON",
        "text": "KLEINALARM"
    },
    "adresse": {
        "default": "Ort Hausnummer",
        "earea": "Ort",
        "emun": "Ort",
        "efeanme": "Ort",
        "estnum": "Hausnummer",
        "ecompl": "Mehr Infos"
    },
    "wgs84": {
        "lng": longitude,
        "lat": latitude
    },
    "bezirk": {
        "id": Bezirk ID,
        "text": "Bezirk"
    },
    "cntfeuerwehren": 1,
    "feuerwehren": {
        "Feuerwehr ID": {
            "feuerwehr": "Feuerwehrname"
        }
    },
    "feuerwehrenarray": {
        "0": {
            "fwnr": "Feuerwehr ID",
            "fwname": "Feuerwehrname"
        }
    }
}
```

into this format: 
```json
{
    "id": "Einsatznummer",
    "start": "2022-01-26T16:32:14+01:00",
    "end": null,
    "level": 1,
    "type": "TEE",
    "subtype": "KLEINALARM",
    "location": "Ort Hausnummer",
    "town": "Ort",
    "district": "Bezirk",
    "longitude": longitude,
    "latitude": latitude,
    "departments": [
        {
            "name": "Feuerwehrname"
        }
    ]
}
```
We do this because the original one has too much information, and also the JSON format is not the best.

# Start Server

First of all we have to install the requirements.
```shell
pip install -r requirements.txt
```
Next step is to run the program.
```shell
python API_Server.py
```
Or run the programm in Debug-Mode.
```shell
python API_Server.py -d
```

