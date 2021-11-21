import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const menu = document.getElementById("menu");
const result = document.getElementById("result");
const resultScore = document.getElementById("score");
const timer = document.getElementById("timer");
const currentScore = document.getElementById("current-score");

const scene = new THREE.Scene();
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const camera = new THREE.PerspectiveCamera( 75, windowWidth / windowHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const backgroundLoader = new THREE.CubeTextureLoader();
const targetMaxSize = 2;

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const greenImg = new URL(
    '../img/green.png?as=webp',
    import.meta.url
);
const blueImg = new URL(
    '../img/blue.png?as=webp',
    import.meta.url
);
const brownImg = new URL(
    '../img/brown.png?as=webp',
    import.meta.url
);

backgroundLoader.load([
    greenImg, greenImg,
    blueImg, brownImg,
    greenImg, greenImg
], function(texture) {
    scene.background = texture;
});

const fogColor = new THREE.Color(0xffffff);
scene.fog = new THREE.FogExp2(fogColor, 0.25, 10);

menu.onclick = startGame;
result.onclick = startGame;

var lights = [];
lights[0] = new THREE.PointLight(0xffffff, 1, 0);
lights[1] = new THREE.PointLight(0xffffff, 1, 0);
lights[2] = new THREE.PointLight(0xffffff, 1, 0);
lights[0].position.set(0, 200, 0);
lights[1].position.set(100, 200, 100);
lights[2].position.set(-100, -250, -25);
scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

let gameRunning = false;
let score = 0;
let cubeX = 1;
let cubeY = 1;
let cubeZ = 1;
let targetSizeX, targetSizeY, targetSizeZ, targetPosX, targetPosY, targetPosZ;
let targetGeometry, targetEdges, targetLine;
let keyState = {};
const geometry = new THREE.BoxGeometry(cubeX, cubeY, cubeZ);
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
const controls = new OrbitControls(camera, renderer.domElement)

getRandomTargetSize();
getRandomTargetPosition();
targetGeometry = new THREE.BoxGeometry(targetSizeX, targetSizeY, targetSizeZ);
targetGeometry.translate(targetPosX, targetPosY, 0);
targetEdges = new THREE.EdgesGeometry(targetGeometry);
targetLine = new THREE.LineSegments(targetEdges, new THREE.LineBasicMaterial({ color: 0xffffff}));
scene.add(targetLine);
controls.update();
scene.add(cube);

camera.position.z = 5;

let mouseX = 0;
let mouseY = 0;
let clock = new THREE.Clock(false);
let maxTime = 100;

const resetCube = () => {
    cubeX = 1;
    cubeY = 1;
    cubeZ = 1;
    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = 0;
    cube.rotation.x = 0;
    cube.rotation.y = 0;
    cube.rotation.z = 0;
    cube.scale.set(cubeX, cubeY, cubeZ);
}

const resetTarget = () => {
    getRandomTargetSize();
    getRandomTargetPosition();
    targetLine.position.x = targetPosX;
    targetLine.position.y = targetPosY;
    targetLine.position.y = targetPosY;
    targetLine.scale.set(targetSizeX, targetSizeY, targetSizeZ);
}

const displayResult = () => {
    if (menu && menu.classList.length === 0) menu?.classList.add("hidden");
    if (result) result.classList.add("hidden");
}

const resetGame = () => {
    resetCube();
    clock.start();
    if (currentScore) currentScore.innerText = `${score}`;
    resetTarget();
}

function startGame() {
    resetGame();
    score = 0;
    gameRunning = true;
    displayResult();
    animate();
}

const onDocumentMouseMove = (event) => {
    event.preventDefault();
    let deltaX, deltaY;
    if (keyState["r"]) {
        deltaX = (event.clientX - mouseX) / 350;
        deltaY = (event.clientY - mouseY) / 350;

        mouseX = event.clientX;
        mouseY = event.clientY;

        cube.rotateY(deltaX)
        cube.rotateX(deltaY)
    } else {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
}

const handleKeyboardActions = () => {
    const posSpeed = 0.02;
    if (keyState["w"])
        cube.position.y += posSpeed;
    if (keyState["s"])
        cube.position.y -= posSpeed;
    if (keyState["a"])
        cube.position.x -= posSpeed;
    if (keyState["d"])
        cube.position.x += posSpeed;
    if (keyState["e"])
        cube.position.z += posSpeed;
    if (keyState["q"])
        cube.position.z -= posSpeed;
    if (keyState["x"])
        resetCube();
    if (keyState["ArrowUp"]) {
        cubeY += posSpeed;
        cube.scale.set(cubeX, cubeY, cubeZ);
    }
    if (keyState["ArrowDown"]) {
        (cubeY - posSpeed) > 0.0 ? cubeY -= posSpeed : "";
        cube.scale.set(cubeX, cubeY, cubeZ);
    }
    if (keyState["ArrowRight"]) {
        cubeX += posSpeed;
        cube.scale.set(cubeX, cubeY, cubeZ);
    }
    if (keyState["ArrowLeft"]){
        (cubeX - posSpeed) > 0.0 ? cubeX -= posSpeed : "";
        cube.scale.set(cubeX, cubeY, cubeZ);
    }
    if (keyState["."]) {
        cubeZ += posSpeed;
        cube.scale.set(cubeX, cubeY, cubeZ);
    }
    if (keyState[","]){
        (cubeZ - posSpeed) > 0.0 ? cubeZ -= posSpeed : "";
        cube.scale.set(cubeX, cubeY, cubeZ);
    }
    if (keyState[" "]) {
        if (!gameRunning) {
            startGame();
        }
    }
}

const onDocumentKeyDown = (event) => {
    keyState[event.key] = true;
}

const onDocumentKeyUp = (event) => {
    keyState[event.key] = false;
}

function getRandomTargetSize() {
    targetSizeX =  Math.floor(Math.random() * (targetMaxSize - 0.5)) + 0.5;
    targetSizeY =  Math.floor(Math.random() * (targetMaxSize - 0.5)) + 0.5;
    targetSizeZ =  Math.floor(Math.random() * (targetMaxSize - 0.5)) + 0.5;
}

function getRandomTargetPosition() {
    targetPosX =  Math.floor(Math.random() * 3) - 1.5;
    targetPosY = Math.floor(Math.random() * 3) - 1.5;
    targetPosZ = Math.floor(Math.random() * 3) - 1.5;
}

const getVertices = (obj) => {
    const position = obj.geometry.attributes.position;
    let vector;
    let arr = []
    for ( let i = 0, l = position.count; i < l; i +=3 ){
        vector = new THREE.Vector3();
        vector.fromBufferAttribute( position, i );
        vector.applyMatrix4( obj.matrixWorld )
        arr.push(vector);
    }
    return arr;
}

document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp, false);
document.addEventListener("mousemove", onDocumentMouseMove, false);

const verifyEndCondition = () => {
    let cubeVertices = getVertices(cube);
    let targetVertices = getVertices(targetLine);
    let set = new Set();
    let len;
    for (let i=0; i<8; i++) {
        for (let j=0; j<8; j++) {
            len = Math.sqrt(Math.pow(cubeVertices[i].x - targetVertices[j].x, 2)
            + Math.pow(cubeVertices[i].y - targetVertices[j].y, 2)
            + Math.pow(cubeVertices[i].z - targetVertices[j].z, 2));
            if (len < 0.1) {
                set.add((i, j));
            }
        }
    }
    return set.size === 8;
}

const displayTime = () => {
    let countdown = maxTime - clock.getElapsedTime();
    if (timer) timer.innerText = `Time: ${countdown.toFixed(2)}`;
}

function animate() {
    let number = requestAnimationFrame( animate );
    handleKeyboardActions();
    let countdown = maxTime - clock.getElapsedTime();
    if (countdown < 0) {
        gameRunning = false;
        cancelAnimationFrame(number);
        result?.classList.remove("hidden");
        if (resultScore) resultScore.innerText = score;
        return;
    }
    if (verifyEndCondition()) {
        resetGame();
        score++;
        currentScore.innerText = `${score}`;
    }
    displayTime();
    renderer.render( scene, camera );
}

