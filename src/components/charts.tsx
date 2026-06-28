"use client";

const risk = [36, 28, 43, 40, 55, 49, 63, 58, 77, 65, 52, 59, 71, 66, 82, 74, 62, 69, 87, 75, 91, 71, 65, 79];
const safe = [18, 20, 17, 24, 21, 29, 26, 34, 30, 38, 31, 27, 33, 29, 41, 37, 44, 39, 43, 36, 40, 32, 35, 29];
const points = (data: number[]) => data.map((y, index) => `${(index / (data.length - 1)) * 720},${170 - y * 1.45}`).join(" ");

export function ThreatChart() {
  return (
    <div className="chart-wrap" aria-label="Threat activity chart">
      <div className="chart-y"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
      <svg viewBox="0 0 720 190" preserveAspectRatio="none" role="img">
        <defs>
          <linearGradient id="riskFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f04452" stopOpacity=".17" /><stop offset="1" stopColor="#f04452" stopOpacity="0" /></linearGradient>
        </defs>
        {[20, 58, 96, 134, 170].map(y => <line key={y} x1="0" x2="720" y1={y} y2={y} stroke="currentColor" opacity=".09" />)}
        <polygon points={`0,170 ${points(risk)} 720,170`} fill="url(#riskFill)" />
        <polyline points={points(risk)} fill="none" stroke="#f04452" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
        <polyline points={points(safe)} fill="none" stroke="#135ef2" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="chart-x"><span>May 30</span><span>Jun 5</span><span>Jun 11</span><span>Jun 17</span><span>Jun 23</span><span>Jun 28</span></div>
    </div>
  );
}

export function Distribution() {
  const values = [
    ["Critical", "8%", "#ef3340"], ["High", "21%", "#ff7864"], ["Medium", "34%", "#f5aa18"], ["Low", "37%", "#28b899"]
  ];
  return (
    <div className="distribution">
      <div className="donut"><div><strong>2,847</strong><span>Total analyses</span></div></div>
      <div className="legend">{values.map(([label, value, color]) => <div key={label}><i style={{ background: color }} /><span>{label}</span><strong>{value}</strong></div>)}</div>
    </div>
  );
}
