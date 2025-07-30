#!/bin/bash
set -e

echo "Importing epicalendar.accounts.json"
mongoimport --uri="$MONGODB_URI" --collection accounts --file /docker-entrypoint-initdb.d/epicalendar.accounts.json --jsonArray

echo "Importing epicalendar.days.json"
mongoimport --uri="mongodb://mongo:mongo@localhost:27017/epicalendar?authSource=admin" --collection days --file /docker-entrypoint-initdb.d/epicalendar.days.json --jsonArray

echo "Import finished"
