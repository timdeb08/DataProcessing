#!/usr/bin/env python
# Name: Tim de Boer
# Student number: 11202351
"""
This file converts CSV file to JSON file
"""
import csv
import pandas as pd
import json

INPUT_CSV = "data.csv"

def read_file():

    # Read the csv file and convert into panda dataframa
    df = pd.read_csv(INPUT_CSV, usecols= ['TIME', 'LOCATION', 'Value', 'MEASURE'])
    # Set country as index
    df.set_index('LOCATION', inplace=True)

    return df

def clean_dataframe(df):

    # Delete rows with no values
    df = df.dropna()
    # Filter rows with measure PC_PRYENRGSUPPLY and thereafter delete the measure column
    df = df[df['MEASURE'] == 'KTOE']
    df = df.drop(['MEASURE'], axis=1)
    # Get the measures of the year 2015 and drop the time column
    df = df[df['TIME'] == 2015]
    df = df.drop(['TIME'], axis=1)
    # Drop the location OECD
    df = df.drop("OECD", axis=0)

    # Remove outliers
    #df.drop(df[df['Value'] > 100000.0].index, inplace=True)
    # Convert rows to numeric values
    df['Value'] = (df['Value'].astype(float))

    return df

def write_json(df):

    # Write to json file
    with open('d3.json', 'w') as f:
        json.dump(df.to_dict(orient='index'), f)


if __name__ == "__main__":

    # Read csv file and load dataframe
    dataframe = read_file()
    # Get cleaned dataframe
    cleaned_dataframe = clean_dataframe(dataframe)
    # Write to json
    write_json(cleaned_dataframe)
