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

export { generate };