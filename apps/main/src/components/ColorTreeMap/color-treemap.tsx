'use client';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

type ColorData = {
  color: string;
  rgb: number[];
  count: number;
  percentage: number; // already in 0–1 range
};

const ColorTreemap = ({
  colors,
  width,
  height,
}: {
  colors: ColorData[];
  width: number;
  height: number;
}) => {
  const reference = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!reference.current) return;

    // D3 expects a root node with children, so we wrap colors in a dummy root
    type TreemapNode = ColorData | { children: ColorData[] };
    const root = d3
      .hierarchy<TreemapNode>({ children: colors }, (d) =>
        'children' in d ? d.children : undefined,
      )
      .sum((d) => ('percentage' in d ? d.percentage : 0));

    d3.treemap<TreemapNode>().size([width, height]).padding(2)(root);

    // Leaves are always ColorData
    const leaves = root.leaves() as d3.HierarchyRectangularNode<ColorData>[];

    const svg = d3.select(reference.current);
    svg.selectAll('*').remove(); // Clear previous render

    const blocks = svg
      .selectAll<SVGGElement, d3.HierarchyRectangularNode<ColorData>>('g')
      .data(leaves)
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`);

    blocks
      .append('rect')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('fill', (d) => d.data.color);

    blocks
      .append('title')
      .text(
        (d) =>
          `${d.data.color} \n(${Math.round(d.data.percentage * 100)}%)\nRGB: ${d.data.rgb?.join(', ')}`,
      );

    blocks
      .append('text')
      .attr('x', 4)
      .attr('y', 14)
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .text((d) => d.data.color);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors]);

  return <svg ref={reference} width={width} height={height} />;
};

export default ColorTreemap;
