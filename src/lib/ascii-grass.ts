const TAU = Math.PI * 2;
const MAX_ANGLE = 1.15;

type LayerSpec = {
	spacing: number;
	fontSize: number;
	minHeightRatio: number;
	maxHeightRatio: number;
	maxHeight: number;
	minAlpha: number;
	maxAlpha: number;
	color: string;
	tipColor: string;
	stiffness: number;
	damping: number;
	windScale: number;
	offset: number;
};

export type GrassBlade = {
	x: number;
	baseY: number;
	height: number;
	segments: number;
	alpha: number;
	phase: number;
	flex: number;
	angle: number;
	velocity: number;
	press: number;
};

export type GrassLayer = {
	fontSize: number;
	color: string;
	tipColor: string;
	stiffness: number;
	damping: number;
	windScale: number;
	blades: GrassBlade[];
};

export type GrassField = {
	groundY: number;
	layers: GrassLayer[];
};

export type GrassPointer = {
	x: number;
	y: number;
	active: boolean;
	pressed: boolean;
	radius: number;
};

function clamp01(value: number) {
	return Math.min(1, Math.max(0, value));
}

function hash(value: number) {
	const result = Math.sin(value * 127.1 + 311.7) * 43758.5453;
	return result - Math.floor(result);
}

function buildLayerSpecs(width: number, spacingScale: number): LayerSpec[] {
	const compact = width < 640;
	const scale = compact ? 0.8 : 1;

	return [
		{
			spacing: 10 * scale * spacingScale,
			fontSize: compact ? 9 : 10,
			minHeightRatio: 0.1,
			maxHeightRatio: 0.18,
			maxHeight: compact ? 120 : 130,
			minAlpha: 0.17,
			maxAlpha: 0.26,
			color: "#059669",
			tipColor: "#34d399",
			stiffness: 24,
			damping: 3.2,
			windScale: 1.25,
			offset: 0,
		},
		{
			spacing: 14 * scale * spacingScale,
			fontSize: compact ? 11 : 13,
			minHeightRatio: 0.14,
			maxHeightRatio: 0.24,
			maxHeight: compact ? 175 : 190,
			minAlpha: 0.22,
			maxAlpha: 0.34,
			color: "#10b981",
			tipColor: "#6ee7b7",
			stiffness: 31,
			damping: 3.6,
			windScale: 1.08,
			offset: 4,
		},
		{
			spacing: 18 * scale * spacingScale,
			fontSize: compact ? 13 : 16,
			minHeightRatio: 0.18,
			maxHeightRatio: 0.3,
			maxHeight: compact ? 230 : 250,
			minAlpha: 0.28,
			maxAlpha: 0.42,
			color: "#34d399",
			tipColor: "#a7f3d0",
			stiffness: 39,
			damping: 4.1,
			windScale: 0.94,
			offset: 9,
		},
	];
}

function createLayer(
	spec: LayerSpec,
	layerIndex: number,
	width: number,
	height: number,
	groundY: number,
): GrassLayer {
	const blades: GrassBlade[] = [];
	const lineGap = spec.fontSize * 0.86;

	for (
		let column = -spec.spacing + spec.offset;
		column <= width + spec.spacing;
		column += spec.spacing
	) {
		const jitter =
			(hash(column * 0.37 + layerIndex * 13.1) - 0.5) * spec.spacing * 0.9;
		const baseX = column + jitter;
		const roll = hash(baseX * 0.11 + layerIndex * 7.7);
		const wave = Math.sin(baseX * 0.011 + layerIndex * 2.1) * 0.5 + 0.5;
		const mix = (roll * 0.65 + wave * 0.35) ** 1.2;
		const targetHeight =
			height *
			(spec.minHeightRatio + (spec.maxHeightRatio - spec.minHeightRatio) * mix);
		const segments = Math.max(
			4,
			Math.round(Math.min(targetHeight, spec.maxHeight) / lineGap),
		);
		const alpha =
			spec.minAlpha + (spec.maxAlpha - spec.minAlpha) * (0.35 + 0.65 * roll);

		blades.push({
			x: baseX,
			baseY: groundY + (hash(baseX * 0.91 + layerIndex * 9.3) - 0.5) * 6,
			height: segments * lineGap,
			segments,
			alpha,
			phase: hash(baseX * 0.53 + layerIndex * 3.3) * TAU,
			flex: 0.78 + hash(baseX * 0.71 + layerIndex * 5.1) * 0.44,
			angle: 0,
			velocity: 0,
			press: 0,
		});
	}

	return {
		fontSize: spec.fontSize,
		color: spec.color,
		tipColor: spec.tipColor,
		stiffness: spec.stiffness,
		damping: spec.damping,
		windScale: spec.windScale,
		blades,
	};
}

export function createGrassField(width: number, height: number): GrassField {
	if (width < 2 || height < 2) {
		return { groundY: height, layers: [] };
	}

	const groundY = height + 6;
	const glyphBudget = 1500 + 2700 * clamp01((width - 480) / 900);
	let spacingScale = 1;
	let field: GrassField = { groundY, layers: [] };

	for (let attempt = 0; attempt < 5; attempt += 1) {
		const specs = buildLayerSpecs(width, spacingScale);
		const layers = specs.map((spec, index) =>
			createLayer(spec, index, width, height, groundY),
		);
		const glyphCount = layers.reduce(
			(total, layer) =>
				total + layer.blades.reduce((sum, blade) => sum + blade.segments, 0),
			0,
		);

		field = { groundY, layers };

		if (glyphCount <= glyphBudget) {
			break;
		}

		spacingScale *= Math.sqrt(glyphCount / glyphBudget) * 1.02;
	}

	return field;
}

function windAngle(blade: GrassBlade, layer: GrassLayer, windTime: number) {
	const gust = 0.68 + 0.48 * Math.sin(windTime * 0.31 + 1.3);
	const passingBreeze = Math.sin(blade.x * 0.009 - windTime * 1.15 + 0.8);
	const sway =
		Math.sin(windTime * 0.72 + blade.phase + blade.x * 0.0045) * 0.54 +
		Math.sin(windTime * 1.36 + blade.phase * 0.7 + blade.x * 0.009) * 0.26 +
		Math.sin(windTime * 0.24 + blade.x * 0.0016 + blade.phase * 0.4) * 0.2;

	return (
		(0.035 + (sway * 0.16 + passingBreeze * 0.1) * gust) *
		layer.windScale *
		blade.flex
	);
}

function pointerInfluence(blade: GrassBlade, pointer: GrassPointer) {
	if (!pointer.active) {
		return { amount: 0, direction: 1 };
	}

	const dx = blade.x - pointer.x;
	const midY = blade.baseY - blade.height * 0.52;
	const dy = pointer.y - midY;
	const distance = Math.hypot(dx, dy * 0.72);

	if (distance >= pointer.radius) {
		return { amount: 0, direction: dx < 0 ? -1 : 1 };
	}

	const falloff = 1 - distance / pointer.radius;

	return {
		amount: falloff * falloff,
		direction: dx === 0 ? (blade.phase < Math.PI ? -1 : 1) : Math.sign(dx),
	};
}

export function stepGrassField(
	field: GrassField,
	delta: number,
	windTime: number,
	pointer: GrassPointer,
) {
	for (const layer of field.layers) {
		for (const blade of layer.blades) {
			const influence = pointerInfluence(blade, pointer);
			const pressTarget =
				influence.direction *
				influence.amount *
				(pointer.pressed ? 0.92 : 0.56);
			const target = windAngle(blade, layer, windTime) + pressTarget;
			const acceleration =
				(target - blade.angle) * layer.stiffness -
				blade.velocity * layer.damping;

			blade.velocity += acceleration * delta;
			blade.angle = Math.min(
				MAX_ANGLE,
				Math.max(-MAX_ANGLE, blade.angle + blade.velocity * delta),
			);
			blade.press += (influence.amount - blade.press) * Math.min(1, delta * 14);
		}
	}
}

export function impulseGrassField(
	field: GrassField,
	pointer: GrassPointer,
	strength: number,
) {
	for (const layer of field.layers) {
		for (const blade of layer.blades) {
			const influence = pointerInfluence(blade, pointer);

			if (influence.amount > 0) {
				blade.velocity += influence.direction * influence.amount * strength;
			}
		}
	}
}

export function settleGrassField(field: GrassField, windTime: number) {
	for (const layer of field.layers) {
		for (const blade of layer.blades) {
			blade.angle = windAngle(blade, layer, windTime) * 0.82;
			blade.velocity = 0;
			blade.press = 0;
		}
	}
}
