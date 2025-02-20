import * as THREE from "three";
import ScreenRenderEngine from "./renderEngine";
import ScreenTextEngine from "./textEngine";
import { Assists } from "../loader";
import Terminal from "../../terminal";

// Define the Change interface to match the expected structure
interface Change {
  type: string;
  loc: number;
  str: string;
}

export default function Screen(
  assists: Assists,
  renderer: THREE.WebGLRenderer
) {
  const sceneRTT = new THREE.Scene();
  let currentText = '';

  // Geometry
  const backGround = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "red" })
  );
  backGround.position.set(0.5, -0.5, -0.01);

  const screenTextEngine = ScreenTextEngine(
    assists,
    sceneRTT,
  );

  // Text editing functions
  const setText = (text: string) => {
    currentText = text;
    screenTextEngine.placeText(currentText);
  };

  const appendText = (text: string) => {
    currentText += text;
    screenTextEngine.placeText(currentText);
  };

  const clearText = () => {
    currentText = '';
    screenTextEngine.placeText('');
  };

  const backspace = () => {
    currentText = currentText.slice(0, -1);
    screenTextEngine.placeText(currentText);
  };

  // Handle keyboard input
  const handleKeyDown = (event: KeyboardEvent) => {
    const change: Change = {
      type: 'insert',  // Default type for insertions
      loc: currentText.length,
      str: ''
    };

    if (event.key === 'Backspace') {
      if (currentText.length > 0) {
        change.type = 'delete';
        change.loc = currentText.length - 1;
        change.str = currentText[currentText.length - 1];
        backspace();
      }
    } else if (event.key === 'Enter') {
      change.str = '\n';
      appendText('\n');
    } else if (event.key.length === 1) {  // Single character
      change.str = event.key;
      appendText(event.key);
    }

 
  };

  // Add keyboard listener
  window.addEventListener('keydown', handleKeyDown);

  const screenRenderEngine = ScreenRenderEngine(assists, renderer, sceneRTT);

  Terminal(screenTextEngine);

  const tick = (deltaTime: number, elapsedTime: number) => {
    screenRenderEngine.tick(deltaTime, elapsedTime);
    screenTextEngine.tick(deltaTime, elapsedTime);
  };

  return { 
    tick, 
    screenRenderEngine, 
    screenTextEngine,
    setText,
    appendText,
    clearText,
    backspace,
    getCurrentText: () => currentText,
    cleanup: () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  };
}