#!/usr/bin/env python
# Name: Tim de Boer
# Student number: 11202351
"""
This file converts CSV file to JSON file
"""
import csv
import numpy as np
import pandas as pd
import json

INPUT_CSV = "data.csv"

def read_file():

    # Read the csv file and convert into panda dataframa
    df = pd.read_csv(INPUT_CSV, usecols= ['TIME', 'LOCATION', 'Value', 'MEASURE'])
    # Set index of dataframe equal to Country
    df.set_index('LOCATION', inplace=True)

    return df

def clean_dataframe(df):

    # Delete rows with no values
    df = df.dropna()
    # Filter rows with measure PC_PRYENRGSUPPLY and thereafter delete the measure column
    df = df[df['MEASURE'] == 'KTOE']
    df = df.drop(['MEASURE'], axis=1)
    # Get the measures of the year 2015
    df = df[df['TIME'] == 2015]

    # Convert rows to numeric values
    df['Value'] = (df['Value'].astype(float))
    df['TIME'] = pd.to_datetime(df['TIME']).astype(np.int64)

    return df

def write_json(df):

    # Write to json file
    with open('d3.json', 'w') as f:
        json.dump(df.T.to_dict(orient='dict'), f)


if __name__ == "__main__":

    # Read csv file and load dataframe
    dataframe = read_file()
    # Get cleaned dataframe
    cleaned_dataframe = clean_dataframe(dataframe)
    print(cleaned_dataframe)
    # Write to json
    write_json(cleaned_dataframe)
