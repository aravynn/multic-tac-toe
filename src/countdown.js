import React from 'react';

/**
 * 
 * Countdown function
 * Displays the current countdown, or in the case of game over, 
 * The winners, as well as the exit button.
 * 
 */

function Countdown(props){
  if(props.winString !== ''){
    return(
      <div className="countdown">
      <div>{props.winString}</div>
      <button
        onClick={props.quit}
      >Start Page</button>
    </div>
    );
  }
  let cls = "countdown";
  if(props.activePlayer === props.player){
    cls += " active";

    if(props.time < 6){
      cls += " warning";
    }
  }
  
  return(
    <div className={cls}>
      <div>Player {props.player}</div>
      <div>Time Left: {props.time}s</div>
    </div>
  );
}

export {Countdown};