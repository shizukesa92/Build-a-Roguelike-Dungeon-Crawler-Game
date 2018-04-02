import style from "./main.css";
import React from "react";
import ReactDOM from "react-dom";
import {
	createStore,
	combineReducers
} from "redux";
import Dungeon from "./dungeon";
import {
	entitites
} from './entities';

import {
	store,
	start,
	change,
	move,
	advance,
	expup,
	hpchange,
	fogmode,
	wepup,
	batch,
	batchenable
} from './redux';
// Initializes map and stage
store.dispatch(start(1));
store.dispatch(advance(1));
// Map generator
const generate = () => {
	// Generates a random array of length equals to grid height  
	const height = 50,
		width = 50;
	let map = [];

	for (let y = 0; y < height; y++) {
		map.push([]);
		for (let x = 0; x < width; x++) {
			map[y].push({
				type: "wall",
				opacity: 0
			});
		}
	}

	// Generates seed of a random height between min and max room heights, and of a starting x,y that does not exceed max height and width (with an offset to prevent room from hitting wall

	const seed = {
		xcoords: 1 + Math.floor(Math.random() * 35),
		ycoords: 1 + Math.floor(Math.random() * 35),
		rheight: 3 + Math.floor(Math.random() * 7),
		rwidth: 3 + Math.floor(Math.random() * 7)
	};

	// Places seed in map
	const place = (map, {
		xcoords,
		ycoords,
		rwidth,
		rheight,
	}) => {
		for (let i = ycoords; i < ycoords + rheight; i++) {
			for (let j = xcoords; j < xcoords + rwidth; j++) {
				map[i][j] = {
					type: "floor",
				};
			}
		}
		return map;
	};
	map = place(map, seed);

	// Function attempts to generate rooms in 4 cardinal directions, note that y extends downwards because rendering the squares starts from top left to bottom right
	const grow = (map, {
		xcoords,
		ycoords,
		rwidth,
		rheight
	}) => {

		const rooms = [];

		const south = {
			rheight: 3 + Math.floor(Math.random() * 7),
			rwidth: 3 + Math.floor(Math.random() * 7)
		};

		south.xcoords = xcoords + Math.floor(Math.random() * (rwidth - 1));
		south.ycoords = ycoords + rheight + 1;
		south.xdoor = south.xcoords + 1;
		south.ydoor = south.ycoords - 1;

		rooms.push(south);

		const north = {
			rheight: 3 + Math.floor(Math.random() * 7),
			rwidth: 3 + Math.floor(Math.random() * 7)

		};
		north.xcoords = xcoords + Math.floor(Math.random() * (rwidth - 1));
		north.ycoords = ycoords - north.rheight - 1;
		north.xdoor = north.xcoords + 1;
		north.ydoor = ycoords - 1;
		rooms.push(north);

		const east = {
			rheight: 3 + Math.floor(Math.random() * 7),
			rwidth: 3 + Math.floor(Math.random() * 7)
		};
		east.xcoords = xcoords + rwidth + 1;
		east.ycoords = ycoords + Math.floor(Math.random() * (rheight - 1));
		east.xdoor = east.xcoords - 1;
		east.ydoor = east.ycoords + 1;
		rooms.push(east);

		const west = {
			rheight: 3 + Math.floor(Math.random() * 7),
			rwidth: 3 + Math.floor(Math.random() * 7)
		};
		west.xcoords = xcoords - west.rwidth - 1;
		west.ycoords = ycoords + Math.floor(Math.random() * (rheight - 1));
		west.xdoor = xcoords - 1;
		west.ydoor = west.ycoords + 1;
		rooms.push(west);

		// Validifies map placement
		const valid = (map, {
			xcoords,
			ycoords,
			rwidth = 1,
			rheight = 1
		}) => {
			// Checks if room exceeds map parameters
			if (ycoords < 1 || ycoords + rheight > map.length - 1) {
				return false;
			}
			if (xcoords < 1 || xcoords + rwidth > map[0].length - 1) {
				return false;
			}

			// Checks for room collision
			for (let i = ycoords - 1; i < ycoords + rheight + 1; i++) {
				for (let j = xcoords - 1; j < xcoords + rwidth + 1; j++) {
					if (map[i][j].type == "floor") {
						return false;
					}
				}
			}
			return true;
		};

		// Constant placed contains placed rooms. Function calls function which generates rooms in 4 cardinal directions and returns the rooms which pass the validity test
		const placed = [];
		rooms.forEach(room => {
			if (valid(map, room)) {
				map = place(map, room);
				map = place(map, {
					xcoords: room.xdoor,
					ycoords: room.ydoor,
					rheight: 1,
					rwidth: 1
				});
				placed.push(room);
			}
		});

		return {
			map,
			placed
		};
	};



	// Fills map recursively
	const fill = (map, rooms, count = 0) => {
		if (count > 20) {
			return map;
		}
		map = grow(map, rooms.pop());
		rooms.push(...map.placed);
		count += map.placed.length;
		return fill(map.map, rooms, count);
	};
	return fill(map, [seed]);


};


// Renders Stats
class Stats extends React.Component {
	// Must forceupdate or it won't update when stats change
	componentDidMount() {
		this.unsubscribe = store.subscribe(() =>
			this.forceUpdate()
		);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {

		let {
			hp,
			exp,
			weapon
		} = store.getState().player;
		const level = Math.floor(exp / 100);
		let {
			stage
		} = store.getState().initiate;

		return (
			<div id = "stat">
								<span className="stats"><b>Health:</b><span id="hp">{hp}</span></span>
			<span className="stats"><b>Weapon:</b><span id="wep">{weapon.name}</span></span>
			<span className="stats"><b>Attack:</b><span id="atk">{weapon.damage}</span></span>
			<span className="stats"><b>Level:</b><span id="lvl">{level}</span></span>
			<span className="stats"><b>Dungeon:</b><span id="dung">{stage}</span></span>
			<button type="button" className="btn" id="darkness">Toggle darkness</button>
					</div>
		)
	}

}

ReactDOM.render(
	<Stats />,
	document.getElementById("stats")
);


// Main component handles all keypresses and actions
class Main extends React.Component {
	constructor(props) {
		super(props);
	}

	input(vector) {

		let state = store.getState();
		// Note the .initiate, because calling getState() from *combined* reducers will return multiple objects containing each of the the reducer states
		const [x, y] = state.initiate.position;
		const [newx, newy] = vector;

		const newpos = [newx + x, newy + y];

		const old = state.initiate.entitylist[y][x];
		const destination = state.initiate.entitylist[y + newy][x + newx];
		let actions = [];

		// Handles movement and prevents "walking through walls" or bosses
		if (destination.type !== "wall" && destination.type !== "enemy" && destination.type !== "boss") {
			actions.push(
				change({
					type: "floor"
				}, [x, y]),
				change(old, newpos),
				move(newpos));
		}

		//Handles picking of weapons and fighting of enemies
		switch (destination.type) {
			case "boss":
			case "enemy":
				{
					const level = Math.floor(state.player.exp / 100);
					const enemydmg = Math.floor(state.player.weapon.damage * (0.5 + Math.floor(Math.random()) * level));
					destination.health -= enemydmg;

					if (destination.health > 0) {
						const playerdmg = Math.floor(4 + Math.floor(Math.random() * 3) * destination.level);

						actions.push(
							change(destination, newpos),
							hpchange(state.player.hp - playerdmg)
						);

						if (state.player.hp - playerdmg <= 0) {
							store.dispatch(hpchange(0));
							setTimeout(() => dispatch(advance(1)), 250);
							return;
						}
					}

					// Enemy death. Advances stage if boss death
					if (destination.health <= 0) {
						if (destination.type === "boss") {
							actions.push(
								expup(10),
								change({
									type: "floor"
								}, [x, y]),
								change(old, newpos),
								move(newpos)
							);
							setTimeout(() => store.dispatch(batch([
									start(1), advance(1)
								])),
								8000);
						} else {
							actions.push(
								expup(10),
								change({
									type: "floor"
								}, [x, y]),
								change(old, newpos),
								move(newpos)
							);
						}
					}
					break;
				}

				// Picking of items
			case "potion":
				actions.push(
					hpchange(state.player.hp + 30)
				);
				break;
			case "weapon":
				actions.push(
					wepup(destination)
				);
				break;
			default:
				break;
		}
		store.dispatch(batch(actions));
	}

	// Handles movement on keypress
	keydown = (event) => {
		switch (event.keyCode) {
			case 38:
			case 87:
				this.input([0, -1]);
				break;
			case 39:
			case 68:
				this.input([1, 0]);
				break;
			case 40:
			case 83:
				this.input([0, 1]);
				break;
			case 37:
			case 65:
				this.input([-1, 0]);
				break;
			default:
				return;
		}

	}

	componentDidMount() {
		this.unsubscribe = store.subscribe(() =>
			this.forceUpdate()
		);
		window.addEventListener("keydown", this.keydown);

	}

	componentWillUnmount() {
		this.unsubscribe();
	}
	render() {

		return (
			<div id = "main">
					<Dungeon />
      </div>
		)
	}
}

ReactDOM.render(
	<Main />,
	document.getElementById("board")
);

$("#darkness").on("click", () => {
	store.dispatch(fogmode());
});
