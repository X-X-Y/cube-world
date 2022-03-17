import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import Materials from '@/js/material';
import stone from '@/assets/image/materials/stone.png';
import store from '@/store'

let camera, scene, renderer, controls, raycaster, cubeList;
let material = new Materials();
let current = 0;
let materialList = Object.keys(material.materials);

let moveForward = false,
  moveBackward = false,
  moveLeft = false,
  moveRight = false,
  moveUp = false,
  moveDown = false,
  canJump = false,
  flyMode = false;

const selectedGeometry = new THREE.BoxGeometry(1.01, 1.01, 1.01)
const selectedMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  opacity: 0.25
})
const selectedMesh = new THREE.Mesh(selectedGeometry, selectedMaterial)

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const canvas = document.getElementById('canvas');
const items = document.getElementsByClassName('item');

function init() {
  // 创建相机对象
  camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.y = 2;
  camera.lookAt(0, 1, 1);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x66b6dd);
  cubeList = scene.children;

  // 灯光
  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  // 控制器
  controls = new PointerLockControls(camera, document.body);
  const blocker = document.getElementById('blocker');
  const instructions = document.getElementById('instructions');
  const cross = document.getElementById('cross');
  instructions.addEventListener('click', function () {
    controls.lock()
  });
  controls.addEventListener('lock', function () {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
    cross.style.display = 'block'
  });
  controls.addEventListener('unlock', function () {
    blocker.style.display = 'block';
    instructions.style.display = '';
    cross.style.display = 'none'
  });

  // 添加键盘事件
  const onKeyDown = function (event) {
    switch (event.key) {
      case 'W':
      case 'w':
        moveForward = true;
        break;
      case 'A':
      case 'a':
        moveLeft = true;
        break;
      case 'S':
      case 's':
        moveBackward = true;
        break;
      case 'D':
      case 'd':
        moveRight = true;
        break;
      case ' ':
        if (canJump === true && !flyMode) velocity.y += 25;
        canJump = false;
        break;
      case 'ArrowUp':
        if (flyMode)
          moveUp = true;
        break;
      case 'ArrowDown':
        if (flyMode)
          moveDown = true;
        break;
    }
  };

  const onKeyUp = function (event) {
    switch (event.key) {
      case 'm':
      case 'M':
        flyMode = !flyMode;
        velocity.y = 0;
        break;
      case 'W':
      case 'w':
        moveForward = false;
        break;
      case 'A':
      case 'a':
        moveLeft = false;
        break;
      case 'S':
      case 's':
        moveBackward = false;
        break;
      case 'D':
      case 'd':
        moveRight = false;
        break;
      case 'F':
      case 'f':
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          canvas.requestFullscreen()
        }
        break;
      case 'ArrowUp':
        if (flyMode)
          moveUp = false;
        break;
      case 'ArrowDown':
        if (flyMode)
          moveDown = false;
        break;
    }
  };

  // 鼠标滚轮切换方块材质
  const onWheel = event => {
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('selected');
    }
    
    if (event.deltaY > 0) {
      current = (current + 1) % 10;
    } else if (event.deltaY < -0) {
      current === 0 ? current = 9 : current--;
    }
    items[current].classList.add('selected');
    store.commit('updateColor', current)
  }

  const onClick = event => {
    raycaster.setFromCamera({ x: 0, y: 0 }, camera)
    const block = raycaster.intersectObjects(cubeList, true);
    if (block.length > 0) {
      let selectedBlock = block[0];
      let selectedCube = selectedBlock.object;
      switch (event.button) {
        case 0:
          const normal = selectedBlock.face.normal;
          const position = selectedCube.position;
          let coords;
          if (Array.from(selectedCube.position).toString() !== '0,-0.5,0') {
            coords = [
              position.x + normal.x,
              position.y + normal.y,
              position.z + normal.z,
            ]
          } else {
            coords = [Math.round(selectedBlock.point.x), 0, Math.round(selectedBlock.point.z)];
          }
          let add_pos = [coords, [1, 1, 1], current]
          setCube(coords, [1, 1, 1]);
          store.dispatch('AddOperate', add_pos)
          break;

        case 2:
          if (Array.from(selectedCube.position).toString() !== '0,-0.5,0') {
            let del_pos = Array.from(selectedCube.position)
            deleteCube(del_pos)
            store.dispatch('DelOperate', del_pos)
          }
          break;
      }
    }
  }

  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement) {
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);
      document.addEventListener('wheel', onWheel);
      document.addEventListener('mousedown', onClick);
    } else {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
      document.removeEventListener('wheel', onWheel)
      document.removeEventListener('mousedown', onClick);
      this.velocity = new THREE.Vector3(0, 0, 0)
    }
  })

  raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
  raycaster.setFromCamera({ x: 0, y: 0 }, camera);

  // 创建地板
  let floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
  const floorFace = new THREE.TextureLoader().load(stone);
  floorFace.magFilter = THREE.NearestFilter;
  floorFace.wrapS = THREE.RepeatWrapping;
  floorFace.wrapT = THREE.RepeatWrapping;
  floorFace.repeat.set(1000, 1000);
  const floorMaterial = new THREE.MeshLambertMaterial({ map: floorFace });
  let floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.receiveShadow = true;
  floor.rotation.x = -0.5 * Math.PI;
  floor.position.set(0, -0.5, 0)
  floor.name = 'floor';
  scene.add(floor);

  // 创建渲染器对象
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  canvas.appendChild(renderer.domElement);

  window.addEventListener('resize', onCanvasResize);
}

// 随窗口改变画面大小
function onCanvasResize() {
  camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
}

function animate() {

  requestAnimationFrame(animate);
  const time = performance.now();

  scene.remove(selectedMesh)
  // 移动及旋转视角
  if (controls.isLocked === true) {
    // 判断移动方向
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    // 各方向移动速度
    const delta = (time - prevTime) / 1000;
    if (moveForward || moveBackward) velocity.z -= direction.z * 50.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 50.0 * delta;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;


    if (flyMode) {
      // 飞行模式
      velocity.y -= velocity.y * 10.0 * delta;
      controls.moveRight(-velocity.x * delta);
      controls.moveForward(-velocity.z * delta);
      camera.position.y += velocity.y * delta;
    } else {
      // 正常模式
      velocity.y -= 9.8 * 10.0 * delta;
      controls.moveRight(-velocity.x * delta);
      controls.moveForward(-velocity.z * delta);
      controls.getObject().position.y += (velocity.y * delta);
      if (controls.getObject().position.y < 2) {
        velocity.y = 0;
        controls.getObject().position.y = 2;
        canJump = true;
      }
    }
  }
  prevTime = time;

  // 高亮选择方块
  raycaster.setFromCamera({ x: 0, y: 0 }, camera)
  const block = raycaster.intersectObjects(cubeList, true);
  if (block.length > 0) {
    const selectedBlock = block[0];
    const selectedCube = selectedBlock.object;
    if (Array.from(selectedCube.position).toString() !== '0,-0.5,0') {
      selectedMesh.position.set(...selectedCube.position);
    } else {
      const coords = [Math.round(selectedBlock.point.x), -1, Math.round(selectedBlock.point.z)];
      selectedMesh.position.set(...coords);
    }
    scene.add(selectedMesh)
  }
  renderer.render(scene, camera);
}

// 添加方块函数
const setCube = (coordinate, size, color) => {
  let selectCurrent = color === undefined ? current : color;
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = material.get(materialList[selectCurrent]);
  let [a, b, c] = coordinate;
  for (let i = 0; i < size[0]; i++) {
    for (let j = 0; j < size[1]; j++) {
      for (let k = 0; k < size[2]; k++) {
        const [x, y, z] = [a + i, b + j, c + k];
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(x, y, z);
        cubeList.push(cube);
      }
    }
  }
}

// 删除方块函数
const deleteCube = (coordinate) => {
  for (const cube of cubeList) {
    if (Array.from(cube.position).toString() === coordinate.toString()) {
      scene.remove(cube)
      return false
    }
  }
  return true
}

const clearScene = () => {
  scene.children.splice(2);
}

export { setCube, deleteCube, clearScene, init, animate, camera, current }
