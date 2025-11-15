#!/bin/bash
set -e

echo "Importing epicalendar.accounts.json"
mongoimport --uri="$MONGODB_URI" --drop --collection accounts --file epicalendar.accounts.json --jsonArray --db epicalendar

echo "Importing epicalendar.days.json"
mongoimport --uri="$MONGODB_URI" --drop  --collection days --file epicalendar.days.json --jsonArray --db epicalendar

echo "Import finished"
