import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Box, Typography, Button } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import GitHubIcon from '@mui/icons-material/GitHub';
import DashboardMock from '../components/DashboardMock';

const PURPLE = '#7C6FF7';
const PURPLE_LIGHT = '#A99FF9';
const BG = '#080B18';
const BG2 = '#0F1123';
const BG3 = '#1a1d2e';
const RED = '#FF4757';
const GREEN = '#2ED573';
const AMBER = '#FFB020';
const BORDER = 'rgba(124,111,247,0.15)';
const MUTED = '#8B8FA8';

const GITHUB_URL = 'https://github.com/melodynarzary/Prismeye';

const FEATURES = [
  {
    icon: '🛡️',
    title: 'Rule-Based Detection',
    desc: '90+ hand-crafted rules detect known attack patterns instantly with zero false negatives for common threats.',
  },
  {
    icon: '🤖',
    title: 'ML-Powered DDoS Detection',
    desc: 'XGBoost model trained on CIC-DDoS2019 dataset detects volumetric attacks by analyzing network traffic behavior.',
  },
  {
    icon: '⚡',
    title: 'Real-Time Dashboard',
    desc: 'Live threat feed powered by Socket.io. See attacks as they happen with full request details and severity.',
  },
  {
    icon: '🌐',
    title: 'Language Agnostic',
    desc: 'Works as a reverse proxy in front of any app — PHP, Python, Java, Ruby, Node.js — no code changes needed.',
  },
  {
    icon: '📊',
    title: 'Multi-Server Monitoring',
    desc: 'Monitor multiple servers and applications from one dashboard. Track threats per server, per application.',
  },
  {
    icon: '💡',
    title: 'Attack Suggestions',
    desc: 'When PrismEye detects an attack, it suggests next steps and remediation tips so you can respond faster and reduce risk.',
  },
];

const ATTACKS = [
  { name: 'SQL Injection', color: RED },
  { name: 'Cross-Site Scripting (XSS)', color: AMBER },
  { name: 'DDoS Attack (ML)', color: RED },
  { name: 'CRLF Injection', color: AMBER },
  { name: 'Path Traversal', color: RED },
  { name: 'Command Injection', color: AMBER },
  { name: 'Local File Inclusion', color: RED },
  { name: 'NoSQL Injection', color: AMBER },
  { name: 'SSRF', color: RED },
  { name: 'XXE', color: AMBER },
];

function BrandLogo({ iconSize = 32, textSize = '1.3rem' }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1 }}>
      <Box sx={{ color: PURPLE, display: 'flex', alignItems: 'center' }}>
        <RemoveRedEyeIcon sx={{ fontSize: iconSize }} />
      </Box>
      <Typography
        sx={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: textSize,
          color: '#ffffff',
          letterSpacing: 0.5,
          lineHeight: 1,
        }}
      >
        Prism<span style={{ color: PURPLE }}>Eye</span>
      </Typography>
    </Box>
  );
}

function NavBar({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 6 },
        py: 1.5,
        background: scrolled ? 'rgba(8,11,24,0.95)' : 'rgba(8,11,24,0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? BORDER : 'transparent'}`,
        transition: 'all 0.3s',
      }}
    >
      <BrandLogo iconSize={34} textSize="1.3rem" />

      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
        {['Home', 'Features', 'Detections', 'How it works'].map((l) => {
          const href =
            l === 'Home'
              ? '#top'
              : `#${l.toLowerCase().replace(/ /g, '-')}`;

          return (
            <Typography
              key={l}
              component="a"
              href={href}
              sx={{
                color: MUTED,
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                '&:hover': { color: '#fff' },
                transition: 'color 0.2s',
              }}
            >
              {l}
            </Typography>
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          onClick={() => window.open(GITHUB_URL, '_blank')}
          sx={{
            background: 'transparent',
            color: '#fff',
            border: `1px solid ${BORDER}`,
            borderRadius: '8px',
            px: 2.4,
            py: 0.8,
            fontSize: '0.85rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 0.8,
            '&:hover': { borderColor: '#fff', transform: 'translateY(-2px)' },
            transition: 'all 0.2s',
            textTransform: 'none',
          }}
        >
          <GitHubIcon sx={{ fontSize: 18 }} />
          Source Code
        </Button>

        <Button
          onClick={onGetStarted}
          sx={{
            background: PURPLE,
            color: '#fff',
            borderRadius: '8px',
            px: 2.5,
            py: 0.8,
            fontSize: '0.85rem',
            fontWeight: 500,
            '&:hover': { background: PURPLE_LIGHT },
            textTransform: 'none',
          }}
        >
          Get Started →
        </Button>
      </Box>
    </Box>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const handleGetStarted = () => router.push('/install');

  return (
    <>
      <Head>
        <title>PrismEye — Real-Time Threat Detection for Every Server</title>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
          html { scroll-behavior: smooth; }
          body { margin: 0; background: ${BG}; }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </Head>

      <Box id="top" sx={{ background: BG, color: '#fff', fontFamily: 'DM Sans, sans-serif', overflowX: 'hidden' }}>
        <NavBar onGetStarted={handleGetStarted} />

        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pt: 14,
            pb: 8,
            px: 2,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              backgroundImage: `linear-gradient(rgba(124,111,247,0.05) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(124,111,247,0.05) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124,111,247,0.15) 0%, transparent 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              pointerEvents: 'none',
            }}
          />

          <Typography
            sx={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: { xs: '2.4rem', md: '4rem' },
              lineHeight: 1.1,
              mb: 2.5,
              animation: 'fadeUp 0.5s 0.1s ease both',
            }}
          >
            Start Protecting
            <br />
            Your Server with
            <br />
            <span style={{ color: PURPLE }}>PrismEye</span> Today
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.15rem' },
              color: MUTED,
              maxWidth: 560,
              mx: 'auto',
              mb: 5,
              fontWeight: 300,
              animation: 'fadeUp 0.5s 0.2s ease both',
              lineHeight: 1.7,
            }}
          >
            Real-time threat detection for every server.
            <br />
            Detect SQL injection, XSS, DDoS and more.
            <br />
            Monitor everything with a centralized dashboard.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              justifyContent: 'center',
              flexWrap: 'wrap',
              mb: 6,
              animation: 'fadeUp 0.5s 0.3s ease both',
            }}
          >
            <Button
              onClick={handleGetStarted}
              sx={{
                background: PURPLE,
                color: '#fff',
                borderRadius: '10px',
                px: 3.5,
                py: 1.3,
                fontSize: '1rem',
                fontWeight: 500,
                '&:hover': { background: PURPLE_LIGHT, transform: 'translateY(-2px)' },
                transition: 'all 0.2s',
                textTransform: 'none',
              }}
            >
              Get Started →
            </Button>

            <Button
              onClick={() => window.open(GITHUB_URL, '_blank')}
              sx={{
                background: 'transparent',
                color: '#fff',
                border: `1px solid ${BORDER}`,
                borderRadius: '10px',
                px: 3.5,
                py: 1.3,
                fontSize: '1rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': { borderColor: '#fff', transform: 'translateY(-2px)' },
                transition: 'all 0.2s',
                textTransform: 'none',
              }}
            >
              <GitHubIcon sx={{ fontSize: 20 }} />
              Source Code
            </Button>
          </Box>

          <Box sx={{ animation: 'fadeUp 0.7s 0.4s ease both', width: '100%', px: { xs: 0, md: 2 } }}>
            <DashboardMock />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(3,1fr)' },
            gap: 2,
            px: { xs: 2, md: 8 },
            py: 5,
            borderTop: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          {[
            { num: '10', label: 'Attack types detected' },
            { num: '90+', label: 'Detection rules' },
            { num: 'Any', label: 'Language or framework' },
          ].map((s, i) => (
            <Box key={i} sx={{ textAlign: 'center', py: 1 }}>
              <Typography sx={{ fontFamily: 'Syne, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: PURPLE }}>
                {s.num}
              </Typography>
              <Typography sx={{ color: MUTED, fontSize: '0.85rem', mt: 0.3 }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>

        <Box id="features" sx={{ px: { xs: 2, md: 8 }, py: 10 }}>
          <Typography sx={{ fontSize: '0.78rem', color: PURPLE, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, mb: 1 }}>
            Features
          </Typography>
          <Typography sx={{ fontFamily: 'Syne, sans-serif', fontSize: { xs: '1.8rem', md: '2.6rem' }, fontWeight: 700, mb: 1 }}>
            Everything you need to
            <br />
            secure your application
          </Typography>
          <Typography sx={{ color: MUTED, maxWidth: 500, mb: 5 }}>
            PrismEye combines rule-based detection and machine learning to catch both known and unknown threats.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(3,1fr)' }, gap: 2 }}>
            {FEATURES.map((f, i) => (
              <Box
                key={i}
                sx={{
                  background: BG3,
                  border: `1px solid ${BORDER}`,
                  borderRadius: '14px',
                  p: 3,
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: PURPLE, transform: 'translateY(-4px)' },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    background: 'rgba(124,111,247,0.1)',
                    border: '1px solid rgba(124,111,247,0.2)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    mb: 1.5,
                  }}
                >
                  {f.icon}
                </Box>
                <Typography sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, mb: 0.5 }}>{f.title}</Typography>
                <Typography sx={{ color: MUTED, fontSize: '0.87rem', lineHeight: 1.6 }}>{f.desc}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box id="detections" sx={{ px: { xs: 2, md: 8 }, py: 8, background: BG2 }}>
          <Typography sx={{ fontSize: '0.78rem', color: PURPLE, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, mb: 1 }}>
            Detection Coverage
          </Typography>
          <Typography sx={{ fontFamily: 'Syne, sans-serif', fontSize: { xs: '1.8rem', md: '2.4rem' }, fontWeight: 700, mb: 0.5 }}>
            10 attack types covered
          </Typography>
          <Typography sx={{ color: MUTED, mb: 3 }}>
            From classic injection attacks to modern DDoS — PrismEye has you covered.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {ATTACKS.map((a, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: BG3,
                  border: `1px solid ${BORDER}`,
                  borderRadius: '100px',
                  px: 2,
                  py: 0.7,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: a.color, color: a.color },
                }}
              >
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                {a.name}
              </Box>
            ))}
          </Box>
        </Box>

        <Box id="how-it-works" sx={{ px: { xs: 2, md: 8 }, py: 10 }}>
          <Typography sx={{ fontSize: '0.78rem', color: PURPLE, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, mb: 1 }}>
            How it works
          </Typography>

          <Typography
            sx={{
              fontFamily: 'Syne, sans-serif',
              fontSize: { xs: '1.8rem', md: '2.4rem' },
              fontWeight: 700,
              mb: 1,
              color: '#fff',
              lineHeight: 1.1,
            }}
          >
            Protected traffic flow
          </Typography>

          <Typography sx={{ color: MUTED, mb: 5, maxWidth: 620, lineHeight: 1.7, fontSize: '0.95rem' }}>
            PrismEye sits between your users and your app. It inspects each request first, blocks or flags suspicious
            traffic, and then forwards safe requests to your app while showing everything live in the dashboard.
          </Typography>

          <Box
            sx={{
              background: 'linear-gradient(180deg, rgba(19,21,31,0.9) 0%, rgba(15,17,35,0.95) 100%)',
              border: `1px solid ${BORDER}`,
              borderRadius: '18px',
              p: { xs: 2.5, md: 4 },
              boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr auto 1fr auto 1fr auto 1fr' },
                gap: 1.5,
                alignItems: 'center',
                width: '100%',
              }}
            >
              {[
                { label: 'User Request', note: 'Traffic arrives here', color: MUTED },
                { arrow: true },
                { label: 'PrismEye Backend', note: 'Inspects + detects threats', color: PURPLE },
                { arrow: true },
                { label: 'Your App', note: 'TARGET_URL receives safe traffic', color: GREEN },
                { arrow: true },
                { label: 'PrismEye Dashboard', note: 'Live alerts and monitoring', color: AMBER },
              ].map((item, i) =>
                item.arrow ? (
                  <Typography
                    key={i}
                    sx={{
                      color: PURPLE,
                      opacity: 0.5,
                      fontSize: '1.3rem',
                      justifySelf: 'center',
                    }}
                  >
                    →
                  </Typography>
                ) : (
                  <Box
                    key={i}
                    sx={{
                      background: `${item.color}12`,
                      border: `1px solid ${item.color}33`,
                      borderRadius: '12px',
                      px: 2,
                      py: 1.4,
                      textAlign: 'center',
                      width: '100%',
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        color: item.color,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      sx={{
                        color: MUTED,
                        fontSize: '0.72rem',
                        mt: 0.45,
                        lineHeight: 1.4,
                      }}
                    >
                      {item.note}
                    </Typography>
                  </Box>
                )
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            px: { xs: 2, md: 8 },
            py: 10,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124,111,247,0.18) 0%, transparent 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              pointerEvents: 'none',
            }}
          />
          <Typography sx={{ fontFamily: 'Syne, sans-serif', fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 800, mb: 1 }}>
            Start protecting your
            <br />
            server today
          </Typography>
          <Typography sx={{ color: MUTED, mb: 4 }}>
            Real-time threat detection for any web server. Works with any language.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              onClick={handleGetStarted}
              sx={{
                background: PURPLE,
                color: '#fff',
                borderRadius: '10px',
                px: 4,
                py: 1.4,
                fontSize: '1rem',
                fontWeight: 500,
                '&:hover': { background: PURPLE_LIGHT, transform: 'translateY(-2px)' },
                transition: 'all 0.2s',
                textTransform: 'none',
              }}
            >
              Get Started →
            </Button>

            <Button
              onClick={() => window.open(GITHUB_URL, '_blank')}
              sx={{
                background: 'transparent',
                color: '#fff',
                border: `1px solid ${BORDER}`,
                borderRadius: '10px',
                px: 4,
                py: 1.4,
                fontSize: '1rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': { borderColor: '#fff', transform: 'translateY(-2px)' },
                transition: 'all 0.2s',
                textTransform: 'none',
              }}
            >
              <GitHubIcon sx={{ fontSize: 20 }} />
              Source Code
            </Button>
          </Box>
        </Box>

        <Box
          component="footer"
          sx={{
            px: { xs: 2, md: 8 },
            py: 3,
            borderTop: `1px solid ${BORDER}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <BrandLogo iconSize={24} textSize="1rem" />
          <Typography sx={{ color: MUTED, fontSize: '0.85rem' }}>
            Built for developers who care about security
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              component="a"
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: MUTED,
                fontSize: '0.8rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': { color: '#fff' },
              }}
            >
              <GitHubIcon sx={{ fontSize: 16 }} /> Source Code
            </Typography>
            <Typography sx={{ color: MUTED, fontSize: '0.8rem' }}>© 2026 PrismEye</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}