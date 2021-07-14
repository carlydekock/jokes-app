import React, { Component } from 'react';
import axios from 'axios';
import './JokeList.css';
import Joke from './Joke.js';

class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10
  };

  constructor(props) {
    super(props);
    this.state = { jokes: JSON.parse(localStorage.getItem('jokes')) || "[]" };
    this.handleClick = this.handleClick.bind(this);
  }

 componentDidMount() {
    if(this.state.jokes.length === 0){
      this.getJokes();
    }
  }

  async getJokes(){
    let jokes = [];
    while (jokes.length < this.props.numJokesToGet) {
      let res = await axios.get('https://icanhazdadjoke.com/', { headers: { Accept: 'application/json' } });
      // console.log(res.data);
      jokes.push({ id: res.data.id, text: res.data.joke, votes: 0 });
    }
    this.setState(st => ({ 
      jokes: [...st.jokes, ...jokes]
    }),
    () => localStorage.setItem('jokes', JSON.stringify(this.state.jokes)));
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
    this.getJokes();
  }

  render() {
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad</span> Jokes
          </h1>
          <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' alt="laughing face" />
          <button className="JokeList-getmore" onClick={this.handleClick}>New Jokes</button>
        </div>
        <div className="JokeList-jokes">
          {this.state.jokes.map(joke => (
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