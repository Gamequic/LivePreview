import * as React from 'react';
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';
import { Typography } from '@mui/material';

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    // No value to display
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  );
}

export default function Gauge({ total, used }) {
    return (
        <div>
            <GaugeContainer
                width={200}
                height={200}
                startAngle={-110}
                endAngle={110}
                value={(used/total)*100}
            >
                <GaugeReferenceArc />
                <GaugeValueArc />
                <GaugePointer />
            </GaugeContainer>
            <Typography variant="body2">RAM Usada: {used}MB / {total}MB</Typography>
        </div>
    );
}
