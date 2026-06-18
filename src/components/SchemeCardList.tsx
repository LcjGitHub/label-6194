import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { CalligraphyChar, SchemeRecord } from '../types';

interface SchemeCardListProps {
  /** 方案列表数据 */
  schemes: SchemeRecord[];
  /** 根据 charId 查找单字信息 */
  getCharById: (id: string) => CalligraphyChar | undefined;
  /** 点击「恢复」时的回调，接收字 id 列表与排列方向 */
  onRestore: (charIds: string[], writingMode: SchemeRecord['writingMode']) => void;
  /** 点击「删除」确认后的回调 */
  onDelete: (id: string) => void;
}

/**
 * 格式化时间戳为本地可读字符串
 */
function formatDate(ts: number) {
  return new Date(ts).toLocaleString('zh-CN');
}

/**
 * 方案卡片列表：展示每条方案、支持查看详情、恢复、删除，删除前需二次确认
 */
export function SchemeCardList({ schemes, getCharById, onRestore, onDelete }: SchemeCardListProps) {
  const [viewId, setViewId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const viewedScheme = viewId ? schemes.find((s) => s.id === viewId) : null;
  const deleteScheme = deleteId ? schemes.find((s) => s.id === deleteId) : null;

  const resolveChars = (charIds: string[]) =>
    charIds.map((id) => getCharById(id)).filter(Boolean) as CalligraphyChar[];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {schemes.map((scheme) => {
        const chars = resolveChars(scheme.charIds);

        return (
          <Card key={scheme.id} variant="outlined">
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {chars.map((c) => c.char).join(' ')}
                </Typography>
                <Chip
                  label={scheme.writingMode === 'horizontal' ? '横排' : '竖排'}
                  size="small"
                  variant="outlined"
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                保存于 {formatDate(scheme.savedAt)}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                startIcon={<VisibilityIcon fontSize="small" />}
                onClick={() => setViewId(scheme.id)}
              >
                查看
              </Button>
              <Button
                size="small"
                color="primary"
                startIcon={<RestoreIcon fontSize="small" />}
                onClick={() => onRestore(scheme.charIds, scheme.writingMode)}
              >
                恢复
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteIcon fontSize="small" />}
                onClick={() => setDeleteId(scheme.id)}
              >
                删除
              </Button>
            </CardActions>
          </Card>
        );
      })}

      {/* 详情弹窗 */}
      <Dialog open={viewedScheme != null} onClose={() => setViewId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>方案详情</DialogTitle>
        <DialogContent>
          {viewedScheme && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                所含汉字
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {resolveChars(viewedScheme.charIds).map((c) => (
                  <Chip key={c.id} label={`${c.char}（${c.reading}）`} />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary">
                排列方向：{viewedScheme.writingMode === 'horizontal' ? '横排' : '竖排'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                保存时间：{formatDate(viewedScheme.savedAt)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {viewedScheme && (
            <Button
              onClick={() => {
                onRestore(viewedScheme.charIds, viewedScheme.writingMode);
                setViewId(null);
              }}
              startIcon={<RestoreIcon />}
            >
              恢复此方案
            </Button>
          )}
          <Button onClick={() => setViewId(null)}>关闭</Button>
        </DialogActions>
      </Dialog>

      {/* 删除确认弹窗 */}
      <Dialog
        open={deleteScheme != null}
        onClose={() => setDeleteId(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>删除方案</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除方案「{deleteScheme && resolveChars(deleteScheme.charIds).map((c) => c.char).join(' ')}」吗？该操作无法撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>取消</Button>
          <Button
            color="error"
            onClick={() => {
              if (deleteScheme) onDelete(deleteScheme.id);
              setDeleteId(null);
            }}
          >
            确认删除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
