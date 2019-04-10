#!/usr/bin/env python
# Name:
# Student number:
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # Read the html file
    html_doc =  open(BACKUP_HTML, 'r')
    soup = BeautifulSoup(html_doc, 'html.parser')

    # Create a list for all movies
    movies = []

    # Iterate over the html doc and find all the elements
    for listing in soup.find_all('div', 'lister-item-content'):

        # Create a dictionary for every movie
        movie = {}

        # Append title to dict
        movie['titles'] = listing.find('h3').find('a').text

        # Append rating to dict
        movie['ratings'] = float(listing.find('strong').text)

        # Append year of release to dict
        years = listing.find('span', 'lister-item-year text-muted unbold').text
        if len(years) > 6:
            years = years[-6:]
            years = years.strip('()')
        else:
            years = years[1:5]
        movie['years'] = years

        # Append list of actors to dict
        actors_movie = []
        actors = listing.find_all(href=re.compile('adv_li_st'))
        for actor in actors:
            actors_movie.append(actor.text)
        actors_movie = ', '.join(actors_movie)
        movie['actors'] = actors_movie

        # Append runtime to dict
        movie['runtime'] = int(listing.find('span', 'runtime').text[:3])

        movies.append(movie)

    # Return list of movies
    return movies


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    # Write the movies list to the csv file
    with open('movies.csv', 'w') as output_file:
            fields = ['titles', 'ratings', 'years', 'actors', 'runtime']
            writer = csv.DictWriter(output_file, fieldnames=fields)
            writer.writeheader()
            for data in movies:
                writer.writerow(data)

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
