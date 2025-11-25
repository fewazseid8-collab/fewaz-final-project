import React from 'react';
const SimplePie = ({ data = [], size = 200, innerRadius = 0.55 }) => {
  const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1;
  const radius = size / 2;
  const center = { x: radius, y: radius };
  let cumulative = 0;
  const slices = data.map((d, i) => {
    const value = Math.max(0, d.value || 0);
    const startAngle = (cumulative / total) * Math.PI * 2;
    cumulative += value;
    const endAngle = (cumulative / total) * Math.PI * 2;
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    const outerStart = polarToCartesian(center.x, center.y, radius, endAngle);
    const outerEnd = polarToCartesian(center.x, center.y, radius, startAngle);
    const innerR = radius * innerRadius;
    const innerStart = polarToCartesian(center.x, center.y, innerR, startAngle);
    const innerEnd = polarToCartesian(center.x, center.y, innerR, endAngle);
    const pathData = [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${radius} ${radius} 0 ${largeArc} 0 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 1 ${innerEnd.x} ${innerEnd.y}`,
      'Z',
    ].join(' ');
    return (
      <path key={d.name + i} d={pathData} fill={d.color || pickColor(i)} stroke="#fff" strokeWidth="0.5" />
    );
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="pie chart">
      <g>
        {slices}
        <circle cx={center.x} cy={center.y} r={radius * innerRadius} fill="#fff" opacity={0.96} />
        <text x={center.x} y={center.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: Math.max(12, size * 0.08), fill: '#111' }}>{total}</text>
      </g>
    </svg>
  );
};
function polarToCartesian(cx, cy, r, angle) {
  return { x: cx + r * Math.cos(angle - Math.PI / 2), y: cy + r * Math.sin(angle - Math.PI / 2) };
}
const defaultColors = ['#2563eb','#06b6d4','#f97316','#ef4444','#10b981','#f59e0b','#7c3aed','#e11d48'];
function pickColor(i) {
  return defaultColors[i % defaultColors.length];
}
export default SimplePie;
