import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { newString, samples, width } from './model';
import { useD3 } from '../../hooks/use-d3';

type ExtendedSVGSVGElement = SVGSVGElement & {
	update(letters: string[]): void;
};

function createNode(width: number): ExtendedSVGSVGElement {
	const svg = d3.create('svg');

	svg
		.attr('width', width)
		.attr('height', 33)
		.attr('font-family', 'monospace')
		.attr('font-size', 30)
		.attr('display', 'block');

	let text = svg.selectAll<SVGTextElement, string>('text');

	return Object.assign(svg.node(), {
		update(letters: string[]): void {
			const t = svg.transition().duration(500);

			text = text
				.data<string>(letters, d => d)
				.join(
					enter =>
						enter
							.append('text')
							.attr('y', -18)
							.attr('dy', '0.35em')
							.attr('x', (d, i) => i * 19)
							.text(d => d),
					update => update,
					exit =>
						exit.call(text =>
							// @ts-ignore
							text.transition(t).remove().attr('y', 60)
						)
				)
				.call(text =>
					// @ts-ignore
					text
						.transition(t)
						.attr('y', 17)
						.attr('x', (d, i) => i * 20)
				);
		}
	});
}

export function MovingText() {
	console.log('Rerender!');
	const last = useRef(-1);

	const [element, node] = useD3(createNode, [width]);

	useEffect(() => {
		// setup interval
		const id = setInterval(() => {
			// search for new string
			const [selected, next] = newString(samples, last.current);
			// push new selection to node
			node.current?.update(selected);
			// update last ref
			last.current = next;
		}, 1000);

		return () => clearInterval(id);
	}, [node]);

	return <div ref={element} />;
}
