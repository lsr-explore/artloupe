'use client';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

type ColorData = {
  color: string;
  rgb: number[];
  count: number;
  percentage: number; // already in 0–1 range
};

const ColorTreemap = ({ colors }: { colors: ColorData[] }) => {
  const reference = useRef<SVGSVGElement>(null);
  const width = 800;
  const height = 600;

  useEffect(() => {
    if (!reference.current) return;

    const normalizedColors = colors?.map((c) => ({
      ...c,
      hex: c.color,
      percentage: c.percentage / 100,
    }));

    const svg = d3.select(reference.current);
    svg.selectAll('*').remove(); // Clear previous render

    // Build hierarchical data
    const root = d3
      .hierarchy({ children: normalizedColors })
      .sum((d: any) => d.percentage); // Value drives size

    d3.treemap().size([width, height]).padding(2)(root as any);

    const blocks = svg
      .selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`);

    blocks
      .append('rect')
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('fill', (d: any) => d.data.color);

    blocks
      .append('title')
      .text(
        (d: any) =>
          `${d.data.color} \n(${Math.round(d.data.percentage * 100)}%)\nRGB: ${d.data.rgb?.join(', ')}`,
      );

    blocks
      .append('text')
      .attr('x', 4)
      .attr('y', 14)
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .text((d: any) => d.data.color);
  }, [colors]);

  return <svg ref={reference} width={width} height={height} />;
};

export default ColorTreemap;
