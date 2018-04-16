import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';

const BUTTON_DATA = ["Timeline", "Parallel Set"]

const SelectionHeader = (props) => {



  return (
    <div>
      <h1>Sample D3 Charts</h1>
      {props.renderButtons}
    </div>
  )
}

export { SelectionHeader };
