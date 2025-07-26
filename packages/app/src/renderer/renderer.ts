// Renderer process code
import { User } from 'data-model';

console.log('Renderer process loaded');
console.log('User model available:', User);

// Add some basic interactivity
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM content loaded in Robots are here app');
  
  // Example of using the data-model
  console.log('Data model imported successfully');
});