import React from 'react';
import {Space} from './space';

/**
 * 
 * Board function
 * Creates the visible board based on parameters sent by App.
 * 
 */
function Board(props) {
      
  const spaces = props.spaces.map((data, y) => {
    const s = data.map((d, x) => {

      let theClass = 'space ' + props.spaceSize;
      if(props.colorTips[y][x] !== null){
          theClass += ' ' + props.colorTips[y][x];
      }
      return(
        <Space 
          thisClass={ theClass }
          key={x}
          owner={d}
          handleClick={() => props.onClick(y, x)}
        />
      );
    });

    const rowClass = "row " + props.spaceSize;
    return(
      <div key={y} className={rowClass}>
        {s}
      </div>
    )

  });

  return (
    <div className="gameboard">
      {spaces}
    </div>
  );
  
}

  export {Board};