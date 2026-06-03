import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const typeColor = (type = '') => {
  if (type.includes('DDoS'))                               return '#35a1ff';
  if (type.includes('NoSQL'))                              return '#A29BFE';
  if (type.includes('SQL'))                                return '#FF4757';
  if (type.includes('XSS') || type.includes('Cross-Site')) return '#7C6FF7';
  if (type.includes('SSRF'))                               return '#4ECDC4';
  if (type.includes('Command'))                            return '#FF6B35';
  if (type.includes('Path'))                               return '#FFB020';
  if (type.includes('Local File'))                         return '#2ED573';
  if (type.includes('XXE'))                                return '#A29BFE';
  return '#FF4757';
};

const shortType = (type = '') => {
  if (type.includes('DDoS'))                               return 'DDoS Attack';
  if (type.includes('NoSQL'))                              return 'NoSQL Injection';
  if (type.includes('SQL Injection'))                      return 'SQL Injection';
  if (type.includes('XSS') || type.includes('Cross-Site')) return 'XSS';
  if (type.includes('SSRF'))                               return 'SSRF';
  if (type.includes('Command'))                            return 'Command Injection';
  if (type.includes('Path'))                               return 'Path Traversal';
  if (type.includes('Local File'))                         return 'Local File Inclusion';
  if (type.includes('XXE'))                                return 'XXE';
  return type;
};

async function getGeminiSuggestions(attack) {
  if (!GEMINI_API_KEY) {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not set in your .env.local file');
  }

  const prompt = `You are a cybersecurity expert. A ${attack.type} attack was detected:
- Attack Type: ${attack.type}
- Severity: ${attack.severity || 'unknown'}
- Target: ${attack.target || 'unknown'}
- Method: ${attack.method || 'unknown'}
- Server: ${attack.server || 'unknown'}

Provide exactly 5 specific, actionable security recommendations to prevent and mitigate this attack.
Return ONLY a JSON array of 5 strings. No markdown, no explanation, no code fences.
Example format: ["tip 1", "tip 2", "tip 3", "tip 4", "tip 5"]`;

  let availableModels = [];
  try {
    const listRes  = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    const listData = await listRes.json();
    availableModels = (listData.models || [])
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => m.name.replace('models/', ''));
    console.log('Available models for your key:', availableModels);
  } catch (e) {
    console.warn('Could not list models, falling back to defaults');
    availableModels = [
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
    ];
  }

  let lastError = null;

  for (const model of availableModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 600 },
        }),
      });

      const rawText = await response.text();
      console.log(`Gemini [${model}] status: ${response.status}`);

      if (!response.ok) {
        lastError = `HTTP ${response.status}: ${rawText.slice(0, 200)}`;
        continue;
      }

      const data = JSON.parse(rawText);
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) { lastError = 'Empty response'; continue; }

      // clean markdown fences
      const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();

      // non-greedy match — stops at first closing bracket
      const match = clean.match(/\[[\s\S]*?\]/);
      if (!match) { lastError = 'No JSON array in response'; continue; }

      let parsed;
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        // fallback — extract individual quoted strings if full parse fails
        const items = [...match[0].matchAll(/"([^"]+)"/g)].map(m => m[1]);
        if (items.length === 0) { lastError = 'Could not parse response'; continue; }
        parsed = items;
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        lastError = 'Invalid array';
        continue;
      }

      console.log(`✅ Gemini [${model}] success`);
      return parsed;

    } catch (err) {
      console.error(`Gemini [${model}] exception:`, err);
      lastError = err.message;
    }
  }

  throw new Error(lastError || 'All Gemini models failed');
}

export default function AlertModal() {
  const { activeModal, closeModal } = useApp();
  const [suggestions, setSuggestions] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [fetched,     setFetched]     = useState(false);

  if (!activeModal) return null;

  const color = typeColor(activeModal.type);

  const handleGetSuggestions = async () => {
    if (fetched || loading) return;
    setLoading(true);
    setError(null);
    try {
      const results = await getGeminiSuggestions(activeModal);
      setSuggestions(results);
      setFetched(true);
    } catch (e) {
      console.error('AlertModal error:', e);
      if (e.message.includes('NEXT_PUBLIC_GEMINI_API_KEY')) {
        setError('API key not found. Add NEXT_PUBLIC_GEMINI_API_KEY to .env.local and restart.');
      } else if (e.message.includes('403')) {
        setError('API key does not have Gemini access. Enable it at aistudio.google.com.');
      } else if (e.message.includes('429')) {
        setError('Rate limit hit. Wait a moment and try again.');
      } else {
        setError(`Failed: ${e.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuggestions([]);
    setLoading(false);
    setError(null);
    setFetched(false);
    closeModal();
  };

  return (
    <Box
      sx={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999,
      }}
      // ── clicking the backdrop does nothing ──
      onClick={(e) => e.stopPropagation()}
    >
      <Box sx={{
        backgroundColor: '#1E2235',
        borderRadius: '16px',
        p: 4, width: 520, maxHeight: '85vh', overflowY: 'auto',
        position: 'relative',
        border: `1px solid ${color}44`,
        boxShadow: `0 0 40px ${color}33`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5,
      }}>
        {/* Close button — only way to close */}
        <IconButton onClick={handleClose} sx={{
          position: 'absolute', top: 12, right: 12,
          color: '#A0A3B1', '&:hover': { color: '#ffffff' },
        }}>
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon sx={{ color: '#FF4757', fontSize: 28 }} />
          <Typography sx={{ color: '#FF4757', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.1em' }}>
            ALERT
          </Typography>
        </Box>

        {/* Attack Type */}
        <Typography sx={{ color, fontWeight: 700, fontSize: '1.3rem', textAlign: 'center' }}>
          {shortType(activeModal.type)} detected
        </Typography>

        {/* Details */}
        <Box sx={{ textAlign: 'center', mt: 0.5 }}>
          <Typography sx={{ color: '#ffffff', fontSize: '0.88rem' }}>
            Please Check Recent Alerts
          </Typography>
          <Typography sx={{ color: '#ffffff', fontSize: '0.88rem', fontWeight: 600, mt: 0.5 }}>
            Server: {activeModal.server || 'Server 1'}
          </Typography>
          <Typography sx={{ color: '#ffffff', fontSize: '0.88rem', fontWeight: 600 }}>
            Target: {activeModal.target || '—'}
          </Typography>
          <Box sx={{
            mt: 1, px: 2, py: 0.5, borderRadius: '20px', display: 'inline-block',
            backgroundColor:
              activeModal.severity === 'high'   ? '#FF475722' :
              activeModal.severity === 'medium' ? '#FFB02022' : '#2ED57322',
            border: `1px solid ${
              activeModal.severity === 'high'   ? '#FF4757' :
              activeModal.severity === 'medium' ? '#FFB020'  : '#2ED573'
            }`,
          }}>
            <Typography sx={{
              fontWeight: 700, fontSize: '0.85rem',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color:
                activeModal.severity === 'high'   ? '#FF4757' :
                activeModal.severity === 'medium' ? '#FFB020'  : '#2ED573',
            }}>
              {activeModal.severity || 'low'} severity
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%', height: '1px', backgroundColor: '#2A2D3E', my: 0.5 }} />

        {/* Get Suggestions button */}
        {!fetched && (
          <Box onClick={!loading ? handleGetSuggestions : undefined} sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            px: 2.5, py: 1, borderRadius: '10px',
            border: '1px solid #7C6FF744',
            backgroundColor: '#7C6FF711',
            cursor: loading ? 'default' : 'pointer',
            transition: 'all 0.2s',
            '&:hover': !loading ? {
              backgroundColor: '#7C6FF722',
              border: '1px solid #7C6FF7',
            } : {},
          }}>
            {loading
              ? <CircularProgress size={16} sx={{ color: '#7C6FF7' }} />
              : <AutoFixHighIcon sx={{ fontSize: 18, color: '#7C6FF7' }} />
            }
            <Typography sx={{ color: '#7C6FF7', fontWeight: 600, fontSize: '0.85rem' }}>
              {loading ? 'Getting Suggestions...' : 'Get Suggestions'}
            </Typography>
          </Box>
        )}

        {/* Error */}
        {error && (
          <Box sx={{
            width: '100%', p: 1.5, borderRadius: '8px',
            backgroundColor: '#FF475711', border: '1px solid #FF475744',
          }}>
            <Typography sx={{ color: '#FF4757', fontSize: '0.78rem', textAlign: 'center' }}>
              {error}
            </Typography>
          </Box>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <Box sx={{ width: '100%', mt: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <AutoFixHighIcon sx={{ fontSize: 16, color: '#7C6FF7' }} />
              <Typography sx={{
                color: '#7C6FF7', fontWeight: 700,
                fontSize: '0.85rem', letterSpacing: '0.08em',
              }}>
                 SECURITY RECOMMENDATIONS
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {suggestions.map((tip, i) => (
                <Box key={i} sx={{
                  display: 'flex', gap: 1.5, alignItems: 'flex-start',
                  p: 1.5, borderRadius: '8px',
                  backgroundColor: '#252840', border: '1px solid #2A2D3E',
                }}>
                  <Box sx={{
                    minWidth: 22, height: 22, borderRadius: '50%',
                    backgroundColor: `${color}22`,
                    border: `1px solid ${color}66`,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Typography sx={{ color, fontSize: '0.7rem', fontWeight: 700 }}>
                      {i + 1}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#C2AEFE', fontSize: '0.82rem', lineHeight: 1.5 }}>
                    {tip}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}