import React from 'react';

/**
 * 
 * SizeController
 * Dropdown menu for current space size 
 * 
 */
function SizeController(props){
    return(
      <div className="sizecontrol">
        <select onChange={props.update} value={props.default}>
          <option value="tiny">Tiny</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="huge">Huge</option>
        </select>
      </div>
    );
}

export {SizeController};