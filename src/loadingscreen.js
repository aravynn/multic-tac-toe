import React from 'react';

/**
 * 
 * LoadingScreen
 * Creates the opening menu for the game.
 * 
 */
class LoadingScreen extends React.Component{
  constructor(props){
    super(props);

    // internal state stored before sending to main page. 
    this.state = {
      boardSize : 's',
      time : 15,
      players : [],
      playerInput : '',
    };

  }

  updateTime = (time) => {
    this.setState({time: time.target.value});
  }

  updateBoardSize = (size) => {
    this.setState({boardSize : size.target.value});
  }

  addPlayer = (player) => {
    let players = this.state.players.slice();
    
    if(players.includes(player.toUpperCase())){
      alert(`Error: ${player.toUpperCase()} already exists. \nPlease choose another inital.`);
      return;
    }

    players.push(player.toUpperCase());
    this.setState({
      players : players,
      playerInput : ''
    });
  }

  updatePlayerInput = (player) => {
    this.setState({
      playerInput : player.target.value
    });
  }

  render(){
    //
    const curPlayers = this.state.players.map((id) =>{
      return(<span>{id}</span>);
    });

    return(
      <div className="makeNewGame">
          <h1>MULTIC-TAC-TOE</h1>
        <div>
          <label for="boardsize">Board Size:</label>
          <select 
            id="boardsize"
            onChange={this.updateBoardSize} 
            value={this.state.boardSize}
            >
            <option value="s">Small</option>
            <option value="m">Medium</option>
            <option value="l">Large</option>
          </select>
        </div>
        <div>
          <label for="time">Time Limit:</label>
          <input 
            type="number" 
            id="time"
            onChange={this.updateTime} 
            value={this.state.time} 
          />
        </div>
        <div>
          <label for="addplayer">Add Players:</label>
          <input 
            id="addplayer"
            type="text" 
            maxlength="2" 
            onChange={this.updatePlayerInput} 
            value={this.state.playerInput} 
          />
          <button
            className="addplayer"
            onClick={(player) => this.addPlayer(this.state.playerInput)}
          >Add</button>
          <div className="currentPlayers">
            {curPlayers}
          </div>
        </div>
        <div>
          <button
            className="startGame"
            onClick={(players, time, boardSize) => {
              if(this.state.players.length > 1){
              this.props.startGame(
                this.state.players,
                this.state.time,
                this.state.boardSize
              );
              } else {
                alert("Error: Minimum 2 players are required");
              }
            }
          }
          >
            Start Game
          </button>

        </div>
      </div>
    );
  }
}

export {LoadingScreen};