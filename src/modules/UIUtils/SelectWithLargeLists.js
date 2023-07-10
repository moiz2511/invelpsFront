import React, { Component } from "react";
import { FixedSizeList as List } from "react-window";

import "./SelectWithLargeLists.css";

// const options = [];
// for (let i = 0; i < 10000; i = i + 1) {
//   options.push({ value: i, label: `Option ${i}` });
// }
const height = 40;

class MenuList extends Component {
  render() {
    const { options, children, maxHeight, getValue } = this.props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * height;

    return (
      <List
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  }
}

export default MenuList;
