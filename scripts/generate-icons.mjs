import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync } from 'fs';

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#22c55e');
  gradient.addColorStop(1, '#16a34a');
  
  // Rounded rectangle background
  const radius = size * 0.2;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Draw apple shape
  const centerX = size / 2;
  const centerY = size * 0.55;
  const appleRadius = size * 0.35;
  
  // Apple body (circle)
  ctx.beginPath();
  ctx.arc(centerX, centerY, appleRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.fill();
  
  // Apple stem
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - appleRadius);
  ctx.quadraticCurveTo(centerX + size * 0.05, centerY - appleRadius - size * 0.15, centerX + size * 0.08, centerY - appleRadius - size * 0.2);
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = size * 0.03;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  // Leaf
  ctx.beginPath();
  ctx.ellipse(centerX + size * 0.12, centerY - appleRadius - size * 0.08, size * 0.08, size * 0.04, Math.PI / 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fill();
  
  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  writeFileSync(`public/icon-${size}.png`, buffer);
  console.log(`Generated icon-${size}.png`);
}

generateIcon(192);
generateIcon(512);
console.log('Icons generated!');
