import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SchemeCardList } from '../components/SchemeCardList';
import { useSchemeStore } from '../store/useSchemeStore';
import { useCharStore } from '../store/useCharStore';
import { useTourStore } from '../store/useTourStore';

/**
 * 我的方案页面：展示收藏的集字方案，支持查看详情、恢复选字状态、删除
 */
export function SchemeListPage() {
  const schemes = useSchemeStore((s) => s.schemes);
  const removeScheme = useSchemeStore((s) => s.removeScheme);
  const batchSelectChars = useCharStore((s) => s.batchSelectChars);
  const setWritingMode = useCharStore((s) => s.setWritingMode);
  const getCharById = useTourStore((s) => s.getCharById);
  const navigate = useNavigate();

  /**
   * 恢复方案对应的选字状态并跳转预览页
   */
  const handleRestore = (charIds: string[], writingMode: 'horizontal' | 'vertical') => {
    const chars = charIds
      .map((id) => getCharById(id))
      .filter(Boolean) as { id: string; char: string; reading: string; meaning: string }[];
    batchSelectChars(chars);
    setWritingMode(writingMode);
    navigate('/compose');
  };

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
        管理已保存的集字方案，可查看详情、恢复到当前选字状态或删除
      </Typography>

      <SchemeCardList
        schemes={schemes}
        getCharById={getCharById}
        onRestore={handleRestore}
        onDelete={removeScheme}
      />
    </Box>
  );
}
