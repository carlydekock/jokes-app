import React, { Component } from 'react';
import axios from 'axios';
import './JokeList.css';
import Joke from './Joke.js';
import { v4 as uuid } from 'uuid';

class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10
  };

  constructor(props) {
    super(props);
    this.state = { 
      jokes: JSON.parse(localStorage.getItem('jokes') || "[]"),
      loading: false
    };
    this.seenJokes = new Set(this.state.jokes.map(joke => joke.text));
    this.handleClick = this.handleClick.bind(this);
  }

 componentDidMount() {
    if(this.state.jokes.length === 0){
      this.getJokes();
    }
  }

  async getJokes(){
    try {
      let jokes = [];
      while (jokes.length < this.props.numJokesToGet) {
        let res = await axios.get('https://icanhazdadjoke.com/', { headers: { Accept: 'application/json' } });
        let newJoke = res.data.joke;
        if(!this.seenJokes.has(newJoke)){
          jokes.push({ id: uuid(), text: res.data.joke, votes: 0 });
        } else {
          console.log('Found a duplicate!');
          console.log(newJoke);
        }
      }
      this.setState(st => ({ 
        loading: false,
        jokes: [...st.jokes, ...jokes]
      }),
      () => localStorage.setItem('jokes', JSON.stringify(this.state.jokes)));
    } catch (err){
      alert(err);
      this.setState({loading: false})
    }
  }

  handleVote(id, delta) {
    this.setState(st => ({
      jokes: st.jokes.map(joke =>
        joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
      )
    }), 
    () => localStorage.setItem('jokes', JSON.stringify(this.state.jokes)));
  }

  handleClick(){
    this.setState({loading: true}, this.getJokes);
  }

  render() {
    if(this.state.loading){
      return (
        <div className="JokeList-spinner">
          <i className="far fa-8x fa-laugh fa-spin" />
          <h1 className="JokeList-title">Loading...</h1>
        </div>
      )
    }

    let jokes = this.state.jokes.sort((a,b) => b.votes - a.votes);

    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad</span> Jokes
          </h1>
          <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' alt="laughing face" />
          <button className="JokeList-getmore" onClick={this.handleClick}>More Jokes</button>
        </div>
        <div className="JokeList-jokes">
          {jokes.map(joke => (
            <Joke
              key={joke.id}
              votes={joke.votes}
              text={joke.text}
              upvote={() => this.handleVote(joke.id, 1)}
              downvote={() => this.handleVote(joke.id, -1)}
            />
          ))}
        </div>
      </div>
    )
  }
}

export default JokeList;