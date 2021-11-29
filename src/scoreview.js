import React from 'react';

/**
 * 
 * ScoreView
 * displays the current scores of all active players 
 * 
 * 
 */
function ScoreView(props){
  const scores = [];
  for(let i = 0; i < props.scores.length; i++){
    let cls = '';
    if(props.scores[i] === props.winScore){
      cls = 'winner';
    }
    scores.push(
      <li 
        key={props.players[i]}
        className={cls}
      >
        Player {props.players[i]} : <em>{props.scores[i]}</em>
      </li>
    );
  }
  
  return(
    <ul className="scores">
      {scores}
    </ul>
  );
}

export {ScoreView};