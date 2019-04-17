#!/usr/bin/env python
# Name: Tim de Boer
# Student number: 11202351
"""
This script scrapes a csv file and outputs a json file.
"""
import csv
import numpy as np
import pandas as pd
import math
import matplotlib.pyplot as plt
import json

INPUT_CSV = "input.csv"

def read_file():

    # Read the csv file and convert into panda dataframa
    df = pd.read_csv(INPUT_CSV, usecols = ['Country', 'Region', 'Pop. Density (per sq. mi.)',\
                                            'Infant mortality (per 1000 births)', 'GDP ($ per capita) dollars'])
    df.set_index('Country', inplace=True)

    return df


def clean_dataframe(df):

    # Delete rows with no value
    df = df.dropna()
    df.drop(df[df['Pop. Density (per sq. mi.)'] == 'unknown'].index, inplace=True)
    df.drop(df[df['GDP ($ per capita) dollars'] == 'unknown'].index, inplace=True)

    # Clean data
    df['Region'] = df['Region'].str.replace(" ", "")
    df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].str.replace("dollars","")

    # Convert the rows into numeric values
    df['Pop. Density (per sq. mi.)'] = (df['Pop. Density (per sq. mi.)'].str.replace(",", ".").astype(float))
    df['Infant mortality (per 1000 births)'] = (df['Infant mortality (per 1000 births)'].str.replace(",", ".").astype(float))
    df['GDP ($ per capita) dollars'] = (df['GDP ($ per capita) dollars'].astype(float))

    # Detect and remove outliers in rows
    df.drop(df[df['GDP ($ per capita) dollars'] == 400000.0].index, inplace=True)

    # Print the dataframe
    print(df)

    return df


def analyze_dataframe(df):

    # Show the mean, std. deviation and mode of the GDP
    print('The central tendency of the GDP per capita in dollars:')
    print('Mean:', df['GDP ($ per capita) dollars'].mean())
    print('Std. dev:', df['GDP ($ per capita) dollars'].std())
    print('Mode:', df['GDP ($ per capita) dollars'].mode())

    # Plot the histogram of GDP per capita in dollars
    df.hist(column='GDP ($ per capita) dollars')
    plt.show()

    # Show the minimum, first quartile, median, third quartile and maximum of Infant mortality
    print('The five number analysis of the infant mortality:')
    print('Minimum: ', df['Infant mortality (per 1000 births)'].min())
    print('First quartile: ', df['Infant mortality (per 1000 births)'].quantile([0.25]))
    print('Median: ', df['Infant mortality (per 1000 births)'].median())
    print('Third quartile: ', df['Infant mortality (per 1000 births)'].quantile([0.75]))
    print('Maximum: ', df['Infant mortality (per 1000 births)'].max() )

    # Plot boxplot of the Infant mortality per 1000 births
    df.boxplot(column='Infant mortality (per 1000 births)')
    plt.title('Boxplot')
    plt.suptitle('')
    plt.show()


def write_json(df):

    # Write to json file
    with open('analysis.json', 'w') as f:
        json.dump(df.T.to_dict(orient='dict'), f)


if __name__ == "__main__":

    # Read the csv file into dataframe
    dataframe = read_file()

    # Get the cleaned dataframe
    cleaned_dataframe = clean_dataframe(dataframe)

    # Show the mean, std. dev., median, max, min, etc.
    analyze_dataframe(cleaned_dataframe)

    # Write to a json file
    write_json(cleaned_dataframe)
