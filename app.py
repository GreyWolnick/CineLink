from flask import Flask, render_template, jsonify
import requests
import random

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chain')
def chain_play():
    people = get_person()
    start = people["start"]
    target = people["target"]

    return render_template('chain.html', start=start, target=target, movie_roles=get_movie_roles(start[2]),
                           tv_roles=get_tv_roles(start[2]))

@app.route('/quickplay')
def quick_play():
    start = get_person()["start"]
    target = get_person()["target"]

    return render_template('quickplay.html', start=start, target=target, movie_roles=get_movie_roles(start[2]),
                           tv_roles=get_tv_roles(start[2]))

@app.route('/api/roles/<int:actor_id>')
def get_roles(actor_id):
    roles = {
        "movies": get_movie_roles(actor_id),
        "tv": get_tv_roles(actor_id)
    }

    return roles

@app.route('/api/movie_roles/<int:actor_id>')
def get_movie_roles(actor_id):
    url = 'https://api.themoviedb.org/3/person/' + str(actor_id) + '/movie_credits?api_key=a7c48ed71e887e393720100c628ae6eb&language=en'
    response = requests.get(url)
    data = response.json()

    roles = []

    for role in data["cast"]:
        title = role["title"]
        character = role["character"]
        url = "https://image.tmdb.org/t/p/w500"
        if role["poster_path"]:
            url += role["poster_path"]
        else:
            url = "../static/img/default_poster.png"
        id = role["id"]
        roles.append((title, character, url, id))

    return roles

@app.route('/api/tv_roles/<int:actor_id>')
def get_tv_roles(actor_id):
    url = 'https://api.themoviedb.org/3/person/' + str(actor_id) + '/tv_credits?api_key=a7c48ed71e887e393720100c628ae6eb&language=en'
    response = requests.get(url)
    data = response.json()

    roles = []

    for role in data["cast"]:
        title = role["name"]
        character = role["character"]
        url = "https://image.tmdb.org/t/p/w500"
        if role["poster_path"]:
            url += role["poster_path"]
        else:
            url = "../static/img/default_poster.png"
        id = role["id"]
        roles.append((title, character, url, id))

    return roles

@app.route('/api/movie/<int:movie_id>')
def get_movie_credits(movie_id):
    url = 'https://api.themoviedb.org/3/movie/' + str(movie_id) + '/credits?api_key=a7c48ed71e887e393720100c628ae6eb&language=en'
    response = requests.get(url)
    data = response.json()

    cast = []
    crew = []

    for role in data["cast"]:
        name = role["name"]
        character = role["character"]
        url = "https://image.tmdb.org/t/p/w500"
        if role["profile_path"]:
            url += role["profile_path"]
        else:
            url = "../static/img/default_headshot.png"
        id = role["id"]
        cast.append((name, character, url, id))

    for role in data["crew"]:
        name = role["name"]
        job = role["job"]
        url = "https://image.tmdb.org/t/p/w500"
        if role["profile_path"]:
            url += role["profile_path"]
        else:
            url = "../static/img/default_headshot.png"
        id = role["id"]
        crew.append((name, job, url, id))

    credits = {
        "cast": cast,
        "crew": crew
    }

    return credits

@app.route('/api/tv/<int:tv_id>')
def get_tv_credits(tv_id):
    url = 'https://api.themoviedb.org/3/tv/' + str(tv_id) + '/credits?api_key=a7c48ed71e887e393720100c628ae6eb&language=en'
    response = requests.get(url)
    data = response.json()

    cast = []
    crew = []

    for role in data["cast"]:
        name = role["name"]
        character = role["character"]
        url = "https://image.tmdb.org/t/p/w500"
        if role["profile_path"]:
            url += role["profile_path"]
        else:
            url = "../static/img/default_headshot.png"
        id = role["id"]
        cast.append((name, character, url, id))

    for role in data["crew"]:
        name = role["name"]
        job = role["job"]
        url = "https://image.tmdb.org/t/p/w500"
        if role["profile_path"]:
            url += role["profile_path"]
        else:
            url = "../static/img/default_headshot.png"
        id = role["id"]
        crew.append((name, job, url, id))

    credits = {
        "cast": cast,
        "crew": crew
    }

    return credits

@app.route('/api/person')
def get_person():
    people = {}

    actor_set = [1253360, 976, 1620, 31, 224513, 6161, 1136406, 2524, 2963, 1373737, 64, 3896, 74568, 1269, 56734,
                 109513, 119592, 1590797, 18897, 118545, 135651, 72466, 6384, 86654, 10859, 8691, 1356210, 2037, 9281,
                 887, 1813, 1892, 6193, 17419, 18973, 10912, 73457, 380, 287, 192, 1245, 190, 23532, 38673, 5576, 1158,
                 62064, 18324, 10205, 69899, 30614, 2440, 70851, 2039, 37625, 17697, 5292, 12835, 10882, 71070, 28782,
                 11701, 517, 27428, 10980, 140, 4724, 1674162, 234352, 16483, 543530, 65731, 22226, 9780, 17628, 1283,
                 116, 16828, 6885, 1223786, 8984, 54693, 524, 18277, 5081, 5293, 59410, 11288, 125025, 6856, 62,
                 1190668, 129101, 2231, 500, 4937, 3293, 83271, 57755, 26457, 3131, 16431, 34847, 73968, 996701, 2975,
                 1333, 3061, 37153, 131, 543261, 2219, 18269, 1397778, 13240, 1289968, 3895, 58225, 9273, 204, 933238,
                 1019, 8784, 1172108, 529, 2372, 17605, 41292, 880, 10990, 25663, 934, 4690, 130640, 527393, 55089,
                 84223, 2461, 17244, 56446, 2178, 117642, 3063, 29222, 193, 335, 48, 55638, 1290466, 2, 3, 3223, 4,
                 17142, 505710, 7499, 25072, 93210, 1023139, 51329]
    start = random.choice(actor_set)
    target = random.choice(actor_set)

    while target == start:
        target = random.choice(actor_set)

    url = f'https://api.themoviedb.org/3/person/{start}?api_key=a7c48ed71e887e393720100c628ae6eb&language=en'
    response = requests.get(url)
    data = response.json()

    name = data["name"]
    url = "https://image.tmdb.org/t/p/w500"
    if data["profile_path"]:
        url += data["profile_path"]

    people["start"] = name, url, start

    url = f'https://api.themoviedb.org/3/person/{target}?api_key=a7c48ed71e887e393720100c628ae6eb&language=en'
    response = requests.get(url)
    data = response.json()

    name = data["name"]
    url = "https://image.tmdb.org/t/p/w500"
    if data["profile_path"]:
        url += data["profile_path"]

    people["target"] = name, url, start


    return people


if __name__ == '__main__':
    app.run()
