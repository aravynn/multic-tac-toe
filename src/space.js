import React from 'react';
/**
 * 
 * Space Div function
 * returns the clickable div space on the board, 
 * state stored at top level App.
 *   
 */
function Space(props){
    return(
      <div className={props.thisClass} onClick={props.handleClick}>
        {props.owner}
      </div>
    );
  }

export {Space};