import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const camera = new THREE.PerspectiveCamera( 75, windowWidth / windowHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const targetMaxSize = 7;

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let cubeX = 1;
let cubeY = 1;
let cubeZ = 1;
let targetSizeX, targetSizeY, targetSizeZ, targetPosX, targetPosY, targetPosZ;
let targetGeometry, targetEdges, targetLine;
let keyState = {};
const geometry = new THREE.BoxGeometry(cubeX, cubeY, cubeZ);
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
const controls = new OrbitControls(camera, renderer.domElement)
controls.update();
scene.add(cube);

camera.position.z = 5;



let mouseX = 0;
let mouseY = 0;
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
    const posSpeed = 0.05;
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
        cube.position.set(0, 0, 0);
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

}

const onDocumentKeyDown = (event) => {
    keyState[event.key] = true;
}

const onDocumentKeyUp = (event) => {
    keyState[event.key] = false;
}

const getRandomTargetSize = () => {
    targetSizeX =  Math.floor(Math.random() * (targetMaxSize - 0.5)) + 0.5;
    targetSizeY =  Math.floor(Math.random() * (targetMaxSize - 0.5)) + 0.5;
    targetSizeZ =  Math.floor(Math.random() * (targetMaxSize - 0.5)) + 0.5;
}

const getRandomTargetPosition = () => {
    targetPosX =  Math.floor(Math.random() * 10) - 5;
    targetPosY = Math.floor(Math.random() * 10) - 5;
    targetPosZ = Math.floor(Math.random() * 200) - 100;
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

const drawTarget = () => {
    getRandomTargetSize();
    getRandomTargetPosition();
    targetGeometry = new THREE.BoxGeometry(targetSizeX, targetSizeY, targetSizeZ);
    //let translateX = targetPosX - (windowWidth / 2);
    //let translateY = targetPosY - (windowHeight / 2);
    targetGeometry.translate(targetPosX, targetPosY, 0);
    //targetGeometry.translateY(windowHeight);
    targetEdges = new THREE.EdgesGeometry(targetGeometry);
    targetLine = new THREE.LineSegments(targetEdges, new THREE.LineBasicMaterial({ color: 0xffffff}));
    scene.add(targetLine);
}
drawTarget();

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

function animate() {
    requestAnimationFrame( animate );
    handleKeyboardActions();
    if (verifyEndCondition())
        return;
    renderer.render( scene, camera );
}
setTimeout(animate, 10);

