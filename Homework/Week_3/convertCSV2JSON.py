#!/usr/bin/env python
# Name: Tim de Boer
# Student number: 11202351
"""
This file converts CSV file to JSON file
"""
import csv
import json

INPUT_CSV = "KNMI.txt"
OUTPUT_JSON = "data.json"

# Open and read the CSV file
with open(INPUT_CSV, 'r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    # Parse CSV to JSON file
    out = json.dumps([row for row in csv_reader])
    # Save the JSON file
    write_json = open(OUTPUT_JSON, 'w')
    write_json.write(out)
