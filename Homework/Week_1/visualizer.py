#!/usr/bin/env python
# Name: Tim de Boer
# Student number: 11202351
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# Read from CSV
with open(INPUT_CSV, 'r') as csv_file:
    movies = csv.DictReader(csv_file)
    # Append the years with the corresponding movies to global dictionary
    for movie in movies:
        data_dict[movie['years']].append(float(movie['ratings']))

# Create list for x and y axis
x = []
y = []

# Compute the average per year
for key, values in data_dict.items():
    for value in values:
        average = sum(values)/len(values)
    x.append(key)
    y.append(average)

if __name__ == "__main__":
    # Plot a graph
    plt.plot(x, y, '-', marker='o')
    plt.show()
