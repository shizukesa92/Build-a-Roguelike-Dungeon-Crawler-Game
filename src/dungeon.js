import React from "react";
import ReactDOM from "react-dom";
import Square from './squares';
import { store } from './redux';

// Main UI component which maps entities (including squares) to board
export default class Dungeon extends React.Component {

	render() {
		let {
			entitylist,
			position,
			fog
		} = store.getState().initiate;
		const [playerx, playery] = position;
		const squares = entitylist.map((width, y) => {
			return (
				width.map((square, x) => {
					let distance = (Math.abs(playery - y)) + (Math.abs(playerx - x));
					return (
						<Square
									square={square}
									distance={distance}
									fog={fog}
									/>
					)
				})
			)
		});
		return (
			<div id = "squares">
					{squares}
      </div>
		)
	}
}