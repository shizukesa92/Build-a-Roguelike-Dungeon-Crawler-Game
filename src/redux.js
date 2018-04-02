import {
	createStore,
	combineReducers
} from "redux";
import { entities } from './entities';
import { generate } from './generator';

// Actions
const change = (entity, coords) => {
	return {
		type: "change",
		payload: {
			entity,
			coords
		}
	};
}

const move = (payload) => {
	return {
		type: "move",
		payload
	};
}

const start = (stage) => {
	return {
		type: "start",
		payload: entities(generate(), stage)
	};
}

const advance = (payload) => {
	return {
		type: "advance",
		payload
	};
}

const expup = (payload) => {
	return {
		type: "expup",
		payload
	};
}

const hpchange = (payload) => {
	return {
		type: "hpchange",
		payload
	};
}

const fogmode = () => {
	return {
		type: "fogmode"
	};
}

const wepup = (payload) => {
	return {
		type: "wepup",
		payload
	};
}

// Reducers
const initial = {
	entitylist: [
		[]
	],
	stage: 0,
	position: [],
	fog: true
};

const initiate = (state = initial, {
	type,
	payload
}) => {
	switch (type) {
		case "change":
			{

				const [x, y] = payload.coords;

				let newentitylist = [...state.entitylist];
				newentitylist[y][x] = payload.entity;


				return { ...state,
					entitylist: newentitylist
				};
			}

		case "fogmode":
			return { ...state,
				fog: !state.fog
			};
		case "move":
			return { ...state,
				position: payload
			};


		case "start":
			return {
				...state,
				position: payload.position,
				entitylist: payload.entitylist
			};
		case "advance":
			return { ...state,
				stage: payload
			};
		default:
			return state;
	}
};

const playerinitial = {
	hp: 100,
	exp: 100,
	weapon: {
		name: "Taser",
		damage: 10
	}
};

const player = (state = playerinitial, {
	type,
	payload
}) => {
	switch (type) {
		case "wepup":
			return { ...state,
				weapon: payload
			};
		case "expup":
			return { ...state,
				exp: state.exp + payload
			};
		case "hpchange":
			return { ...state,
				hp: payload
			};
		default:
			return state;
	}
};

const reducers = combineReducers({
	initiate,
	player
});

// Batch Actions
const batch = (actions) => {
	return {
		type: "batch",
		payload: actions
	}
}

// Batch Reducer
const batchenable = (reducer) => {
	return function batchreduce(state, action) {
		switch (action.type) {
			case "batch":
				return action.payload.reduce(batchreduce, state);
			default:
				return reducer(state, action);
		}
	}
}


// Store
const store = createStore(batchenable(reducers));

export {store, start, change, move, advance, expup, hpchange, fogmode, wepup, batch, batchenable};