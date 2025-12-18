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

    // Charge les images de piece pour le joueur
    this.load.image("playerTile", "/assets/images/pieces/p_white.png");
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
      const imageFileName =
        imagePath.split("/").pop() || imagePath.split("\\").pop();

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
    // #region Settings
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
      const extraX =
        visibleWidth > isoWidth ? (visibleWidth - isoWidth) / 2 : 0;
      const extraY =
        visibleHeight > isoHeight ? (visibleHeight - isoHeight) / 2 : 0;
      this.cameras.main.setBounds(
        minX - extraX,
        minY - extraY,
        isoWidth + extraX * 2,
        isoHeight + extraY * 2
      );
    }

    // Appliquer le scroll pour centrer la map
    this.cameras.main.setScroll(scrollX, scrollY);
    // #endregion Settings

    this.pathLogic(parcoursLayer);
  }

  pathLogic(pathTilesJson) {
    // Le Pions du joueur
    const player = this.add.image(0, 0, "playerTile");
    player.setOrigin(0.5, 1);
    player.setDepth(1000); // au-dessus de la tuile

    // Tableau qui va contenir les données du chemin
    const movingPaths = [];

    pathTilesJson.forEachTile((tile) => {
      if (tile.index !== -1) {
        movingPaths.push({
          tileX: tile.x,
          tileY: tile.y,
          x: tile.getCenterX(),
          y: tile.getCenterY(),
          tileIndex: tile.index,
          tileset: tile.tileset?.name || "unknown",
          color: null,
          order: null,
        });
      }
    });

    console.info("RAW PATHS:", movingPaths);

    // Définition manuel de l'Ordre de lecture du tableau contenant les tuiles de chemins, ainsi que les infos de couleurs
    const manualOrdering = [
      { tileNum: 0 },
      { tileNum: 1, tileColor: "" },
      { tileNum: 2, tileColor: "" },
      { tileNum: 3, tileColor: "" },
      { tileNum: 4, tileColor: "" },
      { tileNum: 5, tileColor: "" },
      { tileNum: 6, tileColor: "" },
      { tileNum: 7, tileColor: "" },
      { tileNum: 11, tileColor: "" },
      { tileNum: 14, tileColor: "" },
      { tileNum: 16, tileColor: "" },
      { tileNum: 21, tileColor: "" },
      { tileNum: 20, tileColor: "" },
      { tileNum: 19, tileColor: "" },
      { tileNum: 18, tileColor: "" },
      { tileNum: 17, tileColor: "" },
      { tileNum: 15, tileColor: "" },
      { tileNum: 12, tileColor: "" },
      { tileNum: 8, tileColor: "" },
      { tileNum: 9, tileColor: "" },
      { tileNum: 10, tileColor: "" },
      { tileNum: 13 }, // 22 ème
    ];

    const colorsOrderArray = [
      "purple",
      "yellow",
      "green",
      "orange",
      "blue",
      "pink",
    ];
    let colorIndex = 0;

    // Chaque tuile à une couleur
    manualOrdering.forEach((tileItem, index) => {
      // Ignore la première et dernière tuile (Spawn & Finish tiles)
      if (index === 0 || index === manualOrdering.length - 1) {
        return;
      }

      colorIndex = colorIndex === colorsOrderArray.length ? 0 : colorIndex;
      tileItem.tileColor = colorsOrderArray[colorIndex];
      colorIndex++;
    });

    console.info("manualOrdering:", manualOrdering);

    // Application de l'Ordre du chemin en donnant le tableau organiser
    const orderedPaths = manualOrdering
      .map((entry, orderIndex) => {
        const tile = movingPaths[entry.tileNum];

        if (!tile) {
          console.warn("Invalid tileNum:", entry.tileNum);
          return null;
        }

        return {
          ...tile,
          color: entry.tileColor,
          order: orderIndex,
        };
      })
      .filter(Boolean);

    console.info("ORDERED PATH:", orderedPaths);

    // Default position
    player.setPosition(orderedPaths[0].x, orderedPaths[0].y);

    let localTile = 0;

    window.addEventListener("keydown", (e) => {
      if (e.code === "Enter") {
        const randomMovement = Math.floor(Math.random() * 6 + 1);
        localTile += randomMovement;
        // Si le chiffre de déplacement déplace le nombre de movement max, fixer en mettant stopper à la fin.
        localTile =
          localTile >= orderedPaths.length
            ? orderedPaths.length - 1
            : localTile;
        const localPlayerPos = orderedPaths[localTile];
        player.setPosition(localPlayerPos.x, localPlayerPos.y);
      }
    });
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
