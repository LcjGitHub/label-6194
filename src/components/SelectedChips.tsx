import { Box, Chip, Stack, Typography } from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MAX_SELECTED, useCharStore } from '../store/useCharStore';
import type { CalligraphyChar } from '../types';

interface SortableChipProps {
  item: CalligraphyChar;
  onDelete: (id: string) => void;
}

function SortableChip({ item, onDelete }: SortableChipProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Chip
        label={`${item.char} · ${item.reading}`}
        onDelete={() => onDelete(item.id)}
        color="primary"
        variant="outlined"
      />
    </div>
  );
}

/**
 * 已选字 Chip 展示栏，支持拖拽排序
 */
export function SelectedChips() {
  const selectedChars = useCharStore((s) => s.selectedChars);
  const removeChar = useCharStore((s) => s.removeChar);
  const clearSelection = useCharStore((s) => s.clearSelection);
  const moveChar = useCharStore((s) => s.moveChar);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = selectedChars.findIndex((c) => c.id === active.id);
      const newIndex = selectedChars.findIndex((c) => c.id === over.id);
      moveChar(oldIndex, newIndex);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          已选字
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {selectedChars.length} / {MAX_SELECTED}
        </Typography>
      </Stack>

      {selectedChars.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          请从下方字库点选，最多 {MAX_SELECTED} 字
        </Typography>
      ) : (
        <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedChars.map((c) => c.id)}
              strategy={horizontalListSortingStrategy}
            >
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {selectedChars.map((item) => (
                  <SortableChip key={item.id} item={item} onDelete={removeChar} />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
          <Chip label="清空" onClick={clearSelection} variant="outlined" size="small" />
        </Stack>
      )}
    </Box>
  );
}
