// Creates entities
const entities = (map, stage = 1) => {

	const bosses = [];
	if (stage == 4) {
		bosses.push({
			health: 400,
			level: 5,
			type: "boss"
		});
	}

	const enemies = [];
	for (let i = 0; i < 7; i++) {
		enemies.push({
			health: stage * 30 + 40,
			level: stage - 1 + Math.floor(Math.random() * 3),
			type: "enemy"
		});
	}
	const player = [{
		type: "player"
	}];

	const potions = [];
	for (let i = 0; i < 5; i++) {
		potions.push({
			type: "potion"
		});
	}

	const weapons = [{
			name: "Laser Pistol",
			damage: 15,
			type: "weapon"
		},
		{
			name: "Laser Rifle",
			damage: 19,
			type: "weapon"
		},
		{
			name: "Plasma Pistol",
			damage: 26,
			type: "weapon"
		},
		{
			name: "Plasma Rifle",
			damage: 28,
			type: "weapon"
		},
		{
			name: "Electric ChainSaw",
			damage: 31,
			type: "weapon"
		},
		{
			name: "Railgun",
			damage: 33,
			type: "weapon"
		},
		{
			name: "Dark Energy Cannon",
			damage: 40,
			type: "weapon"
		},
		{
			name: "BFG",
			damage: 43,
			type: "weapon"
		}
	];

	// Randomizes weapons generated
	let weapon = [];
	for (let i = 0; i < 3; i++) {
		const random = weapons[Math.floor(Math.random() * 8)];
		weapon.push(random);
	}

	// Randomizes locations
	let position = [];

	[potions, enemies, weapons, player, bosses].forEach(entity => {

		while (entity.length) {
			const x = Math.floor(Math.random() * 50);
			const y = Math.floor(Math.random() * 50);

			if (map[y][x].type == "floor") {

				if (entity[0].type == "player") {
					position = [x, y];
				}
				map[y][x] = entity.pop();
			}
		}
	});
	return {
		entitylist: map,
		position
	};
}

export { entities };