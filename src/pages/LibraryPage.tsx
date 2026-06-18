import { useCallback, useMemo, useState } from 'react';
import { Box, Button, TextField, Typography, InputAdornment, Snackbar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink } from 'react-router-dom';
import calligraphyChars from '../mock/calligraphy-chars.json';
import { CharGrid } from '../components/CharGrid';
import { SelectedChips } from '../components/SelectedChips';
import { PhraseBar } from '../components/PhraseBar';
import { useCharStore } from '../store/useCharStore';
import { searchChars } from '../utils/searchChars';
import type { CalligraphyChar } from '../types';

/**
 * 字库选字页
 * - 支持汉字 / 拼音 / 释义关键词搜索
 * - 点选字卡切换选中状态，最多可选 4 字
 * - 已达上限时点击未选中字卡弹出底部提示并重新计时
 * - 已选字标签支持拖拽排序与单独删除
 */
export function LibraryPage() {
  const selectedCount = useCharStore((s) => s.selectedChars.length);
  const allChars = calligraphyChars as CalligraphyChar[];
  const [keyword, setKeyword] = useState('');

  /** 选字上限提示是否显示 */
  const [toastOpen, setToastOpen] = useState(false);
  /** 选字上限提示唯一 key，用于触发 Snackbar 重新挂载以重置自动关闭计时 */
  const [toastKey, setToastKey] = useState(0);

  const filteredChars = useMemo(
    () => searchChars(allChars, keyword),
    [allChars, keyword]
  );

  /**
   * 选字达到上限时的回调处理
   * - 通过更新 key 强制 Snackbar 重新挂载，实现提示已显示时再次点击重新计时
   * - 同时设置 open 为 true，处理首次触发或已自动关闭后的再次触发
   */
  const handleMaxLimitReached = useCallback(() => {
    setToastKey((k) => k + 1);
    setToastOpen(true);
  }, []);

  /**
   * 选字上限提示关闭回调
   * - 由 Snackbar 自动隐藏、用户点击外部区域或 ESC 键时触发
   */
  const handleToastClose = useCallback(() => {
    setToastOpen(false);
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        字库
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        点击字卡选字或取消，最多选择 4 个字后前往集字预览
      </Typography>

      <PhraseBar />

      <TextField
        fullWidth
        size="small"
        placeholder="搜索汉字、拼音或释义…"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <SelectedChips />

      <CharGrid chars={filteredChars} onMaxLimitReached={handleMaxLimitReached} />

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          component={RouterLink}
          to="/compose"
          variant="contained"
          disabled={selectedCount === 0}
        >
          前往集字预览 ({selectedCount})
        </Button>
      </Box>

      <Snackbar
        key={toastKey}
        open={toastOpen}
        autoHideDuration={2000}
        onClose={handleToastClose}
        message="最多选择四个字"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        role="status"
        aria-live="polite"
      />
    </Box>
  );
}
