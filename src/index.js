// basic react required calls.
import React from 'react';
import ReactDOM from 'react-dom';

// main style for app
import './style.scss';

// required components from external sources.
import {Board} from './board';
import {ScoreView} from './scoreview';
import {Countdown} from './countdown';
import {SizeController} from './sizecontroller';
import {LoadingScreen} from './loadingscreen';

/**
 * 
 * Class App
 * All main functionality remains in this component.
 * 
 */
class App extends React.Component {
  /**
   * constructor
   * Generates the state model for application.
   */
  constructor(props){
    super(props);
    
    // prepare the state for the application, in this case, the board.
    this.state = {
      gameStart : false,                // has game loaded or go to create.
      board : [],                       // main board positions
      colorTips : [],                   // coloring tooltips for players
      players : [],                     // player letter options
      currentPlayer : 0,                // active player
      maxPlayers : this.props.players,  // total players in this game. 
      playerScores : [],                // tallied score of players.
      spaceCount : 0,                   // total spaces for game completion.
      winScore : -1,                    // final score of the winner
      timerInterval : 0,                // timer interval per turn, typically 15 seconds
      timerCurrent : 0,                 // current second per interval.
      yourPlayer : "A",                 // FOR multipler setup
      tileSize : "small",               // tile size for the application, class name.
      winString : ""                    // on win condition holds string.
    };

  }

  /**
   * 
   * createGame
   * sets the state value for a new game, as returned by the start screeen.
   * 
   */
  createGame = (players, time, boardSize) => {
    // assign the player array to the current state, set the board etc on game load. 
    let sideCt; 

    switch(boardSize){
      default:
      case 's':
        sideCt = Math.ceil(players.length / 2) + 2;
        break;
      case 'm':
        sideCt = players.length + 2;
        break;
      case 'l':
        sideCt = players.length * 2 + 2;
        break;
    }
    const totalSpaces = sideCt * sideCt;

    let arr = new Array(sideCt);

    for(let i = 0; i < arr.length; i++ ){
      arr[i] = Array(sideCt).fill(null);
    }

    let ct = new Array(sideCt);

    for(let i = 0; i < ct.length; i++ ){
      ct[i] = Array(sideCt).fill(null);
    }

    const playerTally = Array(players.length).fill(0);

    this.time = setInterval(() => this.setTimer(), 1000);

    this.setTimer(time);

    this.setState({
      gameStart : true,             // has game loaded or go to create.
      board : arr,                  // main board positions
      colorTips : ct,               // coloring tooltips for players
      players : players,            // player letter options
      currentPlayer : 0,
      maxPlayers : players.length,  // total players in this game. 
      playerScores : playerTally,   // tallied score of players.
      spaceCount : totalSpaces,     // total spaces for game completion.
      timerInterval : time,         //
      timerCurrent : time             //
    });
  }


  /**
   * 
   * quitGame
   * resets game state to return to loading screen.
   * 
   */
  quitGame = () => { 
    this.setState({
      gameStart : false,             // has game loaded or go to create.
      board : [],                  // main board positions
      colorTips : [],               // coloring tooltips for players
      players : [],            // player letter options
      currentPlayer : 0,
      maxPlayers : 0,  // total players in this game. 
      playerScores : [],   // tallied score of players.
      spaceCount : 0,     // total spaces for game completion.
      timerInterval : 15,         //
      timerCurrent : 15             //
    });
  }
  
  /**
   * 
   * handleClick
   * manages all space clicks on the map. 
   */
  handleClick = (y, x) => { // VOID RETURN
    //alert(x + ' ' + y);o

    let Tboard = this.state.board.slice();

    if(Tboard[y][x] !== null){
      return;
    }
    let current = this.state.currentPlayer;
    const playerIcon = this.state.players[current];
    Tboard[y][x] = playerIcon;
    
    let scoreFinal = this.updateScores(y, x, playerIcon);

    current++;

    this.updateColoring(current);

    if(current >= this.state.maxPlayers){
      current = 0;
    }

    const remSpaces = this.state.spaceCount - 1;
    let winScore = -1;
    let winString = '';
    if(remSpaces === 0){
        
        // create associated array of final scores and players.
        let finalScores = [];
        for(let i = 0; i < this.state.playerScores.length; i++){
          finalScores.push({
            id : this.state.players[i],
            score : scoreFinal[i]
          });
        }

        finalScores.sort((a, b) => b.score - a.score);

        winScore = finalScores[0].score;

        let winner = '';
        let tie = 0;
        finalScores.forEach((score, index) => {
          if(score.score === winScore){
            winner += (winner !== '' ? ' ,' : '') + score.id;
            tie++;
          }
        });

        if(tie > 1){
          alert(`Its a tie! ${winner} score: ${winScore}`);
          winString = `Tie: ${winner}`;

        } else {
          alert(`Winner! ${finalScores[0].id} score: ${winScore}`);
          winString = `Winner: ${finalScores[0].id}`;
        }

        clearInterval(this.time);
        let boardclear = Array(this.state.colorTips.length).fill(
          Array(this.state.colorTips.length).fill(null)
        );
        this.setState({
          colorTips : boardclear,
        });
    }

    this.setState({
      board: Tboard, 
      currentPlayer : current,
      spaceCount : remSpaces,
      winScore : winScore,
      playerScores : scoreFinal,
      timerCurrent : this.state.timerInterval,
      winString : winString
    });
  }

  /**
   * 
   * updateColoring 
   * controls color changes on the map for active player.
   * green for spaces with open neighbors, and red for blocked in spaces.
   *  
   */
  updateColoring = (pc) => { // void RETURN
    // check the board status for a winner, return true if game over.
    // will also update colorTips
    // go line by line through the array and check for continued areas or blocked squares.
    // update as we go.
 
    if(pc === this.state.maxPlayers){
      pc = 0;
    }

    let Tboard = this.state.board.slice();
    let Tcolors = this.state.colorTips.slice();

    for(let y = 0; y < Tboard.length; y++ ){
      for(let x = 0; x < Tboard.length; x++ ){
        // check if null value
        if(Tboard[y][x] === null){ continue; } 
        // check if current player
        if(Tboard[y][x] === this.state.players[pc]){
          // this is an active setup. start checking status.
          
          // default to yellow unless other colors come up
          Tcolors[y][x] = "green";

          if(this.isBlocked(x,y)){
            Tcolors[y][x] = "red";
            
          } 
          
        } else {
          Tcolors[y][x] = null;
        }
      }
    }

    this.setState({colorTips : Tcolors});
  }

  /**
   * 
   * updateScores
   * check the surrounding space of a selected tile, and return if any scores are updated, looking
   * for sets of 3.
   * 
   */
  updateScores = (y, x, icon) => { // VOID RETURN
    // check the current space surrounds, and update scores if changed
    // as well as the color map
    
    // get current player score
    let score = this.state.playerScores[this.state.currentPlayer];

    for(let yy = -1; yy < 2; yy++){
      for(let xx = -1; xx < 2; xx++){
        // check consecutive spaces on all sides of the current spot, 
        // for a 3 icon run.
        if(xx === 0 && yy === 0) continue;

        if(this.checkSpace(x + xx , y + yy, icon) && 
        this.checkSpace(x + (xx * 2), y + (yy * 2), icon)){
          score++;
        }        
      }
    }

    // next, check all opposing values, if a connection was made 
    if(this.checkSpace(x - 1 , y - 1, icon) && 
    this.checkSpace(x + 1, y + 1, icon)){
      score++;
    } 
    if(this.checkSpace(x - 1 , y, icon) && 
    this.checkSpace(x + 1, y, icon)){
      score++;
    }  
    if(this.checkSpace(x + 1 , y - 1, icon) && 
    this.checkSpace(x - 1, y + 1, icon)){
      score++;
    }  
    if(this.checkSpace(x , y - 1, icon) && 
    this.checkSpace(x, y + 1, icon)){
      score++;
    }   

    let finalScores = this.state.playerScores.slice();
    finalScores[this.state.currentPlayer] = score;

    // return 
    return finalScores;
  }

  /**
   * 
   * isBlocked
   * check surrounding spots of point if blocked
   */

  isBlocked(x, y){ // BOOL RETURN
    // check if the surrounding spaces are blocked or null, return TRUE if blocked.
    
    // check for open spots.
    for(let yy = -1; yy < 2; yy++){
      for(let xx = -1; xx < 2; xx++){
        if(yy + y < 0 || xx + x < 0 
          || yy + y >= this.state.board.length 
          || xx + x >= this.state.board.length){ continue; } // blocked.
        if(yy === 0 && xx === 0) { continue; } // skip.
        if(this.state.board[y + yy][x + xx] == null ){
          return false;
        }
      } 
    }

    return true; // unless found otherwise
  }

  /**
   * 
   * checkSpace
   * check spot is valid to board, and if it mateches the chosen player.
   * 
   */
  checkSpace(x, y, player){ // BOOL RETURN
    //alert(x + ' ' + y + ' ' + player);
    if(x < 0 || y < 0 || 
      x >= this.state.board.length || 
      y >= this.state.board.length){
        return false; // out of bounds.
      }
    if(this.state.board[y][x] === player){
      return true;
    } else {
      return false;
    }
  }

  /**
   * 
   * setTimer
   * Manages the state of the timer and current pleyer
   * 
   */
  setTimer() {
    let time = this.state.timerCurrent;

    if(time > 0){
      this.setState({timerCurrent : time - 1});
    } else {
      // time ran out. Force next player and reset timer.
      //alert("Outta Time!");

      let current = this.state.currentPlayer + 1;
      if(current >= this.state.maxPlayers){
        current = 0;
      }

      this.setState({
        currentPlayer : current,
        timerCurrent : this.state.timerInterval
      });
    }
  } 
  
  /**
   * 
   * sizeUpdate
   * based on the size dropdown, set the tile actual size
   *  
   */
  sizeUpdate = (option) => {
    this.setState({tileSize : option.target.value});
    //alert(option.target.value);
  }
  
  render() {
    return (
      <div className="gamebox">
      {this.state.gameStart ? 
        <>
        <Board 
          spaces={this.state.board}
          colorTips={this.state.colorTips}
          onClick = {(y, x) => this.handleClick(y, x)}
          spaceSize={this.state.tileSize}
        />
        <Countdown 
          player={this.state.players[this.state.currentPlayer]}
          time={this.state.timerCurrent}
          activePlayer={this.state.yourPlayer}
          winString={this.state.winString}
          quit={() =>this.quitGame()}
        />
        <SizeController 
          update={this.sizeUpdate}
          default={this.state.tileSize}
        />
        <ScoreView
          scores={this.state.playerScores}
          winScore={this.state.winScore}
          players={this.state.players}
        />
        </>
      : <LoadingScreen 
          startGame={(players, time, boardSize) => 
            this.createGame(players, time, boardSize)}
        />}
      </div>
    );
  }
}

/**
 * App load point to HTML
 */
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);