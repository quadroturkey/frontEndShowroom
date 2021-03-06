import React, { Component } from 'react';
import MovieCollection from './MovieCollection'
import Search from './Search';
import { Button, Container } from 'semantic-ui-react';

const apiKey=`123e2f78bfa3cc8be6fbaf3324b4409f`

const genres = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
}

const showingTypes = ['now_playing', 'popular', 'top_rated', 'upcoming'] 
const genresAry = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Science Fiction", "TV Movie", "Thriller", "War", "Western"]
let i = 0

export default class MainPage extends Component {
  constructor() {
    super()
    this.state = {
      movies: [],
      search: '',
      icon: 'save',
      color: 'green'
    }
  }

  componentDidMount() {
    showingTypes.map(type => this.fetchMovies(type))
  }

  fetchMovies = (type) => {
    fetch(`https://api.themoviedb.org/3/movie/${type}?api_key=${apiKey}&language=en-US&page={1}`)
      .then(resp => resp.json())
      .then(data => {
        const movieList = data.results.map(movie => {
          movie.genres = movie.genre_ids.map(id => 
            genres[id]
          )
          return movie
        })

        console.log(movieList)
        this.setState({ 
          movies: [...this.state.movies, ...movieList]
        })
      })
  }

  addMovie = (e) => {
    console.log(e)
    this.postMovie(e)
    this.postUserMovie(e)
    this.postMovieGenre(e)
  }

  postMovie = (e) => {
    fetch("http://localhost:3000/movies", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: e.id,
        title: e.title,
        poster_path: e.poster_path,
        release_date: e.release_date,
        vote_average: e.vote_average,
        overview: e.overview
      })
    })
  }

  postUserMovie = (e) => {
    fetch("http://localhost:3000/user_movies", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_movies: {
          user_id: 1,
          movie_id: e.id
        }
      })
    })
  }

  postMovieGenre = (e) => {
    e.genre_ids.map(id => {
      return fetch("http://localhost:3000/movie_genres", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          movie_genres: {
            movie_id: e.id,
            genre_id: id
          }
        })
      })
    })
  }

  onSearch = (e) => {
    console.log(e.target.value)
    this.setState({
      search: e.target.value.toLowerCase()
    })   
  }
  
  includeSearch = (str) => {
    return str.toLowerCase().includes(this.state.search)
  }

  filterMovies = () => {
    const movies = this.state.movies.slice(0)
    return movies.filter((movie) => this.includeSearch(movie.title))
  }

  genreFilter = (genreSearch) => {
    const movies = this.state.movies.slice(0)
    return movies.filter(movie => movie.genres.includes(genreSearch))
  }

  render() {
    return (
      <>
      <Container>
        <Search onSearch={this.onSearch} />
        <a href='http://localhost:3001/user/1'><Button floated='right'>My Page</Button></a>
      </Container>

        {genresAry.map(genre => 
          <MovieCollection 
            movies={this.genreFilter(genre)} 
            key={i++} 
            genreName={genre} 
            handleMovie={this.addMovie} 
            icon={this.state.icon} 
            color={this.state.color}  
          /> 
        )}
      </>
    )
  }
}