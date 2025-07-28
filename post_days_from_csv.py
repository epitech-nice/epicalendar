import pandas as pd
import requests
from datetime import datetime



API_URL = "http://localhost:3001/api/days"
JWT_TOKEN = "your-json-web-token"
CSV_PATH = "days.csv"
headers = {
    "Authorization": f"Bearer {JWT_TOKEN}",
    "Content-Type": "application/json"
}



df = pd.read_csv(CSV_PATH)
df.columns = [col.strip().lower() for col in df.columns]



def parse_time_on_date(date_obj, time_str):
    try:
        clean_time = time_str.strip().lower().replace('h', ':')
        if clean_time.count(':') == 1:
            clean_time += ":00"
        h, m, *_ = map(int, clean_time.split(":"))
        return datetime(date_obj.year, date_obj.month, date_obj.day, h, m).isoformat()
    except Exception as e:
        print(f"Erreur parsing heure : {time_str} → {e}")
        return None



for idx, row in df.iterrows():
    try:
        date_str = str(row['date']).strip()
        date_obj = datetime.strptime(date_str, "%d/%m/%Y")
        date_iso = date_obj.replace(hour=0, minute=0, second=0, microsecond=0).isoformat()

        open_str = str(row['open']).strip()
        start_str = str(row['start']).strip()
        close_str = str(row['close']).strip()
        end_str = str(row['end']).strip() if not pd.isna(row.get('end')) else None

        message = str(row.get('message', '')).strip()
        observations = str(row.get('observations', '')).strip()

        raw_aers = row.get('aers', '')
        aers = [a.strip() for a in str(raw_aers).split(',') if a.strip()] if pd.notna(raw_aers) else []

        payload = {
            "date": date_iso,
            "open": parse_time_on_date(date_obj, open_str),
            "start": parse_time_on_date(date_obj, start_str),
            "close": parse_time_on_date(date_obj, close_str),
            "aers": aers,
            "message": message,
            "observations": observations
        }

        if end_str:
            payload["end"] = parse_time_on_date(date_obj, end_str)

        response = requests.post(API_URL, json=payload, headers=headers)

        if response.status_code == 201:
            print(f"[OK] Ligne {idx + 1}: Journée ajoutée.")
        else:
            print(f"[ERREUR] Ligne {idx + 1}: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"[EXCEPTION] Ligne {idx + 1}: {e}")
