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
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSchemeStore } from '../store/useSchemeStore';
import { useCharStore } from '../store/useCharStore';
import { useTourStore } from '../store/useTourStore';

export function SchemeListPage() {
  const schemes = useSchemeStore((s) => s.schemes);
  const removeScheme = useSchemeStore((s) => s.removeScheme);
  const getSchemeById = useSchemeStore((s) => s.getSchemeById);
  const batchSelectChars = useCharStore((s) => s.batchSelectChars);
  const setWritingMode = useCharStore((s) => s.setWritingMode);
  const getCharById = useTourStore((s) => s.getCharById);
  const navigate = useNavigate();

  const [viewId, setViewId] = useState<string | null>(null);
  const viewedScheme = viewId ? getSchemeById(viewId) : null;

  const handleRestore = (charIds: string[], writingMode: 'horizontal' | 'vertical') => {
    const chars = charIds
      .map((id) => getCharById(id))
      .filter(Boolean) as { id: string; char: string; reading: string; meaning: string }[];
    batchSelectChars(chars);
    setWritingMode(writingMode);
    navigate('/compose');
  };

  const formatDate = (ts: number) => new Date(ts).toLocaleString('zh-CN');

  if (schemes.length === 0) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          我的方案
        </Typography>
        <Typography variant="body2" color="text.secondary">
          暂无收藏方案，请在集字预览页点击「保存当前方案」
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        我的方案
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        管理已保存的集字方案，可一键恢复或删除
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {schemes.map((scheme) => {
          const chars = scheme.charIds
            .map((id) => getCharById(id))
            .filter(Boolean) as { id: string; char: string; reading: string; meaning: string }[];

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
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => setViewId(scheme.id)}
                  title="查看详情"
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleRestore(scheme.charIds, scheme.writingMode)}
                  title="恢复并跳转预览"
                >
                  <RestoreIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeScheme(scheme.id)}
                  title="删除方案"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          );
        })}
      </Box>

      <Dialog open={viewedScheme != null} onClose={() => setViewId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>方案详情</DialogTitle>
        <DialogContent>
          {viewedScheme && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                所含汉字
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {viewedScheme.charIds
                  .map((id) => getCharById(id))
                  .filter(Boolean)
                  .map((c) => (
                    <Chip key={c!.id} label={`${c!.char}（${c!.reading}）`} />
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
                handleRestore(viewedScheme.charIds, viewedScheme.writingMode);
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
    </Box>
  );
}
