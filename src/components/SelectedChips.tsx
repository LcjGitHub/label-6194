import { Box, Chip, Stack, Typography, IconButton } from '@mui/material';
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

/**
 * 可拖拽排序的已选字标签组件
 * - 拖拽手柄仅绑定在文字区域，删除按钮独立可点击
 * - 支持键盘无障碍操作
 * - 拖拽时提供半透明视觉反馈
 */
function SortableChip({ item, onDelete }: SortableChipProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div ref={setNodeRef} style={style} role="none">
      <Chip
        role="button"
        label={
          <span {...attributes} {...listeners} style={{ cursor: 'grab', userSelect: 'none' }}>
            {`${item.char} · ${item.reading}`}
          </span>
        }
        onDelete={() => onDelete(item.id)}
        deleteIcon={
          <IconButton
            size="small"
            aria-label={`删除「${item.char}」`}
            sx={{ p: 0.25 }}
            tabIndex={0}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </IconButton>
        }
        color="primary"
        variant="outlined"
      />
    </div>
  );
}

/**
 * 已选字 Chip 展示栏，支持拖拽排序
 * - 展示已选字数量统计
 * - 支持按住标签文字区域拖动调整顺序
 * - 删除按钮独立可操作，不参与拖拽
 * - 集字预览页会同步反映排序结果
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
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }} flexWrap="wrap">
        <Typography variant="subtitle1" fontWeight={600}>
          已选字
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {selectedChars.length} / {MAX_SELECTED}
        </Typography>
        {selectedChars.length >= 2 && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            按住标签可拖动排序
          </Typography>
        )}
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
