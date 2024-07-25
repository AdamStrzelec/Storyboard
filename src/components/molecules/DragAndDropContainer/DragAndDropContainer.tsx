import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

interface DragAndDropContainerProps {
	id: string;
	children: React.ReactElement;
}

export const DragAndDropContainer = ({
	id,
	children,
}: DragAndDropContainerProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id,
		data: {
			type: 'container',
		},
	});

	const style = {
		transition,
		transform: CSS.Transform.toString(
			transform && { ...transform, scaleY: 1 },
		),
	};

	return (
		<div
			ref={setNodeRef}
			style={{ ...style, opacity: isDragging ? 0.5 : 1 }}
			{...attributes}
			{...listeners}
		>
			{children}
		</div>
	);
};