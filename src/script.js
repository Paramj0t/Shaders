import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import testVertexShader from "./shaders/test/vertex.glsl";
import testFragmentShader from "./shaders/test/fragment.glsl";

//Texture
const textureLoader = new THREE.TextureLoader();
const flag = textureLoader.load("/textures/download.png");

//Debugger
const gui = new dat.GUI();

//Canvas
const canvas = document.querySelector(".webgl");

//Scene
const scene = new THREE.Scene();

//Cursor
const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener("mousemove", (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = -(event.clientY / sizes.height - 0.5);
});

//Objects
const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);

// const count = geometry.attributes.position.count;
// const randoms = new Float32Array(count);

// for (let i = 0; i < count; ++i) {
// 	randoms[i] = Math.random();
// }

// geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

const material = new THREE.RawShaderMaterial({
	vertexShader: testVertexShader,
	fragmentShader: testFragmentShader,
	// transparent: true,
	uniforms: {
		uFrequency: { value: new THREE.Vector2(10, 5) },
		uTime: { value: 0 },
		uColor: { value: new THREE.Color("orange") },
		uTexture: { value: flag },
	},
});

gui
	.add(material.uniforms.uFrequency.value, "x")
	.min(0)
	.max(20)
	.step(0.001)
	.name("frequencyX");
gui
	.add(material.uniforms.uFrequency.value, "y")
	.min(0)
	.max(20)
	.step(0.001)
	.name("frequencyY");

const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.y = 2.3;
mesh.scale.y = 2 / 3;
scene.add(mesh);

//Lights

const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

//sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	//Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	//Update Camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	//Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});

//Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = -1;
// camera.lookAt(mesh.position);
scene.add(camera);

//Renderer
const renderer = new THREE.WebGLRenderer({
	// canvas: canvas
	canvas,
	antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

//Controls
const controls = new OrbitControls(camera, canvas);

// //Clock
const clock = new THREE.Clock();
let oldElapsed = 0;

//Animation
const tick = () => {
	//clock sec
	const elapsedTime = clock.getElapsedTime();

	//Update material
	material.uniforms.uTime.value = elapsedTime;

	//Update controls
	controls.update();

	//Renderer
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
