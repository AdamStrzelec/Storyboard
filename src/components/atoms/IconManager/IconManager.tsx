import React from 'react';
import * as Icons from 'src/assets/icons/SVGs';
import { theme } from 'src/theme/theme';

export type IconNames = keyof typeof Icons;

export type IconsColors = keyof typeof theme.colors;

interface IconManagerProps extends Omit<Icons.SvgProps, 'color' | 'fill'> {
	name: IconNames;
	color?: IconsColors;
}

export const IconManager = ({
	name,
	color,
	width,
	height,
}: IconManagerProps) => {
	const Icon = Icons[name];
	return (
		<Icon
			fill={color ? theme.colors[color] : theme.colors['text']}
			width={width}
			height={height}
		/>
	);
};
