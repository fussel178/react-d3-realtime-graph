import { useD3 } from '../../hooks/use-d3';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { DataSample } from '../../model/data-sample';
import { initialData, updateData } from '../../lib/update-data';
import { uid } from '../../lib/uid';

type ExtendedSVGSVGElement = SVGSVGElement & {
	update(letters: DataSample[]): void;
};

const margin = 25;
const tickInterval = 500;
const fill = '#6D83F2';

function createNode(width: number, height: number): ExtendedSVGSVGElement {
	const gradient = uid();
	const color = d3.scaleSequential(d3.interpolate('white', fill));

	// build svg frame
	const chart = d3.create('svg').attr('width', width).attr('height', height);

	const xG = chart
		.append('g')
		.attr('transform', `translate(0, ${height - margin})`);

	chart
		.append('linearGradient')
		.attr('id', gradient.id)
		.attr('gradientUnits', 'userSpaceOnUse')
		.attr('x1', 0)
		.attr('y1', '100%')
		.attr('x2', 0)
		.attr('y2', '40%')
		.selectAll('stop')
		.data(d3.ticks(0, 1, 10))
		.join('stop')
		.attr('offset', d => d)
		.attr('stop-opacity', d => d)
		.attr('stop-color', color.interpolator());

	let path = chart.append('path').attr('stroke', fill).attr('fill', fill);

	const yG = chart.append('g');

	return Object.assign(chart.node(), {
		update(data: DataSample[]) {
			// determine axis domains
			const xDomain = d3.extent(data.map(d => d.timeStamp)) as [number, number];
			const yDomain = [0, 10];

			// build axis maps
			const x = d3
				.scaleTime()
				.domain(xDomain)
				.range([margin * 2, width + margin]);

			const y = d3
				.scaleLinear()
				.domain(yDomain)
				.range([height - margin, margin * 0.5]);

			// build axis renderer
			const xAxis = (
				g: d3.Selection<SVGGElement, undefined, null, undefined>
			) =>
				g
					.attr('transform', `translate(0, ${y.range()[0]})`)
					.call(d3.axisBottom(x).tickSizeOuter(0));

			const yAxis = (
				g: d3.Selection<SVGGElement, undefined, null, undefined>
			) =>
				g
					.attr('transform', `translate(${x.range()[0]})`)
					.call(d3.axisLeft(y).ticks(3).tickSizeOuter(margin))
					.call(g => g.style('fill', 'white'))
					.call(g => g.select('.domain').style('stroke', 'white'))
					.call(g => g.selectAll('.tick > text').attr('dx', -margin * 0.2))
					.call(g =>
						g
							.selectAll('.tick > line')
							.attr('x1', -margin * 0.2)
							.attr('x2', -margin * 0.4)
					);

			// build area renderer
			const area = d3
				.area<DataSample>()
				.curve(d3.curveLinear)
				.x(d => x(d.timeStamp))
				.y0(y(0))
				.y1(d => y(d.value));

			// apply renderer to dom elements
			// @ts-ignore
			path = path.datum(data).attr('transform', 'translate(0)').attr('d', area);

			yG.call(yAxis);
			path.attr(
				'transform',
				`translate(${x(data[0].timeStamp - tickInterval) - 2 * margin})`
			);
			xG.call(xAxis);
		}
	});
}

export interface PGraphProps {
	width: number;
	height: number;
}

export function PGraph({ width, height }: PGraphProps) {
	const data = useRef<DataSample[]>(initialData());

	const [element, node] = useD3(createNode, [width, height]);

	useEffect(() => {
		const id = setInterval(() => {
			// generate new data (should be replaced with event bus register later)
			data.current = updateData(data.current);
			// inform graph to update
			node.current?.update(data.current);
			//console.log(data.current);
		}, 33.3333 / 2);
		return () => clearInterval(id);
	}, []);

	return <div ref={element} />;
}
