// 设置方块材质

import * as THREE from 'three';

import dirt from '@/assets/image/materials/dirt.png';
import stone from '@/assets/image/materials/stone.png';
import glass from '@/assets/image/materials/glass.png';
import grass_top_green from '@/assets/image/materials/grass_top_green.png';
import grass_side from '@/assets/image/materials/grass_block_side.png';
import oak_log from '@/assets/image/materials/oak_log.png';
import oak_log_top from '@/assets/image/materials/oak_log_top.png';
import oak_leaves from '@/assets/image/materials/oak_leaves.png';
import sand from '@/assets/image/materials/sand.png';
import brick from '@/assets/image/materials/brick.png';
import wood from '@/assets/image/materials/oak_planks.png';
import tnt_side from '@/assets/image/materials/tnt_side.png'
import tnt_top from '@/assets/image/materials/tnt_top.png'
import tnt_bottom from '@/assets/image/materials/tnt_bottom.png'

let loader = new THREE.TextureLoader();

const dirtFace = loader.load(dirt);
const stoneFace = loader.load(stone);
const glassFace = loader.load(glass);
const grassTopFace = loader.load(grass_top_green);
const grassFace = loader.load(grass_side);
const treeFace = loader.load(oak_log);
const treeTopFace = loader.load(oak_log_top);
const leafFace = loader.load(oak_leaves);
const sandFace = loader.load(sand);
const brickFace = loader.load(brick);
const woodFace = loader.load(wood);
const tntFace = loader.load(tnt_side);
const tntTopFace = loader.load(tnt_top);
const tntBottomFace = loader.load(tnt_bottom);

grassTopFace.magFilter = THREE.NearestFilter;
grassFace.magFilter = THREE.NearestFilter;
treeFace.magFilter = THREE.NearestFilter;
treeTopFace.magFilter = THREE.NearestFilter;
dirtFace.magFilter = THREE.NearestFilter;
stoneFace.magFilter = THREE.NearestFilter;
glassFace.magFilter = THREE.NearestFilter;
leafFace.magFilter = THREE.NearestFilter;
sandFace.magFilter = THREE.NearestFilter;
brickFace.magFilter = THREE.NearestFilter;
woodFace.magFilter = THREE.NearestFilter;
tntFace.magFilter = THREE.NearestFilter;
tntTopFace.magFilter = THREE.NearestFilter;
tntBottomFace.magFilter = THREE.NearestFilter;

export default class Materials {
  materials = {
    grass: [
      new THREE.MeshStandardMaterial({map: grassFace}),
      new THREE.MeshStandardMaterial({map: grassFace}),
      new THREE.MeshStandardMaterial({
        map: grassTopFace
      }),
      new THREE.MeshStandardMaterial({map: dirtFace}),
      new THREE.MeshStandardMaterial({map: grassFace}),
      new THREE.MeshStandardMaterial({map: grassFace})
    ],
    dirt: new THREE.MeshStandardMaterial({map: dirtFace}),
    sand: new THREE.MeshStandardMaterial({map: sandFace}),
    tree: [
      new THREE.MeshStandardMaterial({map: treeFace}),
      new THREE.MeshStandardMaterial({map: treeFace}),
      new THREE.MeshStandardMaterial({map: treeTopFace}),
      new THREE.MeshStandardMaterial({map: treeTopFace}),
      new THREE.MeshStandardMaterial({map: treeFace}),
      new THREE.MeshStandardMaterial({map: treeFace})
    ],
    leaf: new THREE.MeshStandardMaterial({
      map: leafFace,
      color: new THREE.Color(0x00ff00),
      transparent: true
    }),
    stone: new THREE.MeshStandardMaterial({map: stoneFace}),
    glass: new THREE.MeshStandardMaterial({map: glassFace, transparent: true}),
    brick: new THREE.MeshStandardMaterial({map: brickFace}),
    wood: new THREE.MeshStandardMaterial({map: woodFace}),
    tnt: [
      new THREE.MeshStandardMaterial({map: tntFace}),
      new THREE.MeshStandardMaterial({map: tntFace}),
      new THREE.MeshStandardMaterial({map: tntTopFace}),
      new THREE.MeshStandardMaterial({map: tntBottomFace}),
      new THREE.MeshStandardMaterial({map: tntFace}),
      new THREE.MeshStandardMaterial({map: tntFace})
    ]
  }

  get = (type) => {
    return this.materials[type]
  }
}
