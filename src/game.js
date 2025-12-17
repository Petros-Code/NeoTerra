import Phaser from "phaser";

// Classe de scène pour le jeu
class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: "GameScene" });
	}

	preload() {
		// Charger le fichier de map directement avec tilemapTiledJSON
		this.load.tilemapTiledJSON("map", "/assets/Map.tmj");

		// Charger les images des tilesets selon les noms dans Map.tmj
		// Les chemins dans Map.tmj sont "../Isometric Asset Pack/..." mais on les charge depuis /assets/
		this.load.image("256x512 Trees.png", "/assets/256x512 Trees.png");
		this.load.image("256x192 Tiles.png", "/assets/256x192 Tiles.png");
		this.load.image("256x152 Floorings.png", "/assets/256x152 Floorings.png");
		this.load.image("256x256 Objects.png", "/assets/256x256 Objects.png");
	}

	create() {
		// Ajouter un fond de couleur
		this.cameras.main.setBackgroundColor("#2d5016");

		// Créer le tilemap directement (les tilesets sont intégrés dans Map.tmj)
		const map = this.make.tilemap({ key: "map" });

		if (!map) {
			console.error("Impossible de créer le tilemap");
			return;
		}

		// Les dimensions des tuiles depuis le fichier .tmj
		const tileWidth = map.tileWidth || 256;
		const tileHeight = map.tileHeight || 128;

		// Récupérer les données brutes du tilemap depuis le cache
		const mapData = this.cache.tilemap.get("map");

		if (!mapData?.data) {
			console.error("Impossible de récupérer les données du tilemap");
			return;
		}

		// Les tilesets sont intégrés, mais il faut corriger les chemins des images
		const tilesets = [];

		mapData.data.tilesets.forEach((tilesetData) => {
			// Extraire le nom du fichier depuis le chemin dans le JSON
			const imagePath = tilesetData.image || "";
			const imageFileName = imagePath.split("/").pop() || imagePath.split("\\").pop();

			// Ajouter le tileset avec le nom de fichier comme clé
			if (imageFileName) {
				const tilesetImage = map.addTilesetImage(
					tilesetData.name,
					imageFileName,
					tilesetData.tilewidth,
					tilesetData.tileheight
				);
				if (tilesetImage) {
					tilesets.push(tilesetImage);
				}
			}
		});

		if (tilesets.length === 0) {
			console.error("Aucun tileset valide trouvé!");
			return;
		}

		// Créer les calques
		this.finishMapCreation(map, tileWidth, tileHeight, tilesets);
	}

	finishMapCreation(map, tileWidth, tileHeight, tilesets) {
		// Créer les calques dans l'ordre (du fond vers l'avant)
		const groundLayer = map.createLayer("Ground", tilesets);
		const parcoursLayer = map.createLayer("Parcours", tilesets);
		const objectsLayer = map.createLayer("Object", tilesets);
		const treesLayer = map.createLayer("Trees", tilesets);

		if (!groundLayer && !parcoursLayer && !objectsLayer && !treesLayer) {
			console.error("Aucun calque n'a pu être créé!");
			this.add.text(100, 100, "Erreur: Aucun calque créé", {
				fontSize: "32px",
				color: "#ff0000",
			});
			return;
		}

		// Ajuster la caméra pour les maps isométriques (prise en compte de l'offset négatif côté OUEST)
		const halfW = tileWidth / 2;
		const halfH = tileHeight / 2;
		const minX = -(map.height - 1) * halfW; // le coin OUEST est négatif
		const maxX = map.width * halfW;
		const isoWidth = maxX - minX;
		const minY = 0;
		const maxY = (map.width + map.height) * halfH;
		const isoHeight = maxY - minY;

		// Calculer le zoom pour voir toute la map
		const cameraWidth = this.cameras.main.width;
		const cameraHeight = this.cameras.main.height;
		const zoomX = cameraWidth / isoWidth;
		const zoomY = cameraHeight / isoHeight;
		const zoom = Math.min(zoomX, zoomY) * 0.9;

		// Définir les bounds selon l'enveloppe iso (inclut la partie négative à gauche)
		this.cameras.main.setBounds(minX, minY, isoWidth, isoHeight);

		// Appliquer le zoom
		this.cameras.main.setZoom(zoom);

		// Calculer la position de scroll pour centrer (centre de l'enveloppe iso)
		const centerX = minX + isoWidth / 2;
		const centerY = minY + isoHeight / 2;
		const visibleWidth = cameraWidth / zoom;
		const visibleHeight = cameraHeight / zoom;

		// Calculer la position de scroll pour centrer la map
		const scrollX = centerX - visibleWidth / 2;
		const scrollY = centerY - visibleHeight / 2;

		// Étendre les bounds si la zone visible dépasse la map (autoriser négatif)
		if (visibleWidth > isoWidth || visibleHeight > isoHeight) {
			const extraX = visibleWidth > isoWidth ? (visibleWidth - isoWidth) / 2 : 0;
			const extraY = visibleHeight > isoHeight ? (visibleHeight - isoHeight) / 2 : 0;
			this.cameras.main.setBounds(minX - extraX, minY - extraY, isoWidth + extraX * 2, isoHeight + extraY * 2);
		}

		// Appliquer le scroll pour centrer la map
		this.cameras.main.setScroll(scrollX, scrollY);
	}
}

let gameInstance = null;

export function initGame() {
	// Éviter de créer plusieurs instances de Phaser
	if (gameInstance) {
		return;
	}

	// Récupérer l'élément #game pour y placer le canvas Phaser
	const gameContainer = document.getElementById("game");

	if (!gameContainer) {
		console.error("L'élément #game n'existe pas dans le DOM");
		return;
	}

	const config = {
		type: Phaser.AUTO,
		width: window.innerWidth,
		height: window.innerHeight,
		parent: gameContainer,
		scene: GameScene,
		physics: {
			default: "arcade",
		},
	};

	gameInstance = new Phaser.Game(config);
}
