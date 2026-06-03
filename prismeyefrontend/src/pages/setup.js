import { useRouter } from 'next/router';
import Head from 'next/head';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GitHubIcon from '@mui/icons-material/GitHub';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const PURPLE = '#7C6FF7';
const PURPLE_LIGHT = '#A99FF9';
const BG = '#080B18';
const BG2 = '#0F1123';
const BG3 = '#1a1d2e';
const BORDER = 'rgba(124,111,247,0.15)';
const MUTED = '#8B8FA8';
const GREEN = '#2ED573';
const AMBER = '#FFB020';

const GITHUB_URL = 'https://github.com/melodynarzary/Prismeye';

const cloneCommands = [
  'git clone https://github.com/melodynarzary/Prismeye.git',
  'cd Prismeye',
];

const backendInstallCommands = [
  'cd prismeyebackend',
  'npm install',
];

const frontendInstallCommands = [
  'cd ../prismeyefrontend',
  'npm install',
];

const mlInstallCommands = [
  '# Make sure Python 3.8+ is installed',
  'python --version',
  '',
  '# Install ML dependencies (one time only)',
  'cd prismeyebackend/ml',
  'pip install -r requirements.txt',
  '',
  '# The ML service will start automatically with the backend',
];

const backendEnvCommands = [
  'cd prismeyebackend',
  '',
  '# Mac / Linux:',
  'cp .env.example .env',
  '',
  '# Windows (Command Prompt or PowerShell):',
  'copy .env.example .env',
  '',
  '# Then open and edit:',
  '# Mac/Linux:  nano .env',
  '# Windows:    notepad .env',
];

const frontendEnvCommands = [
  'cd prismeyefrontend',
  '',
  '# Mac / Linux:',
  'cp .env.example .env',
  '',
  '# Windows (Command Prompt or PowerShell):',
  'copy .env.example .env',
  '',
  '# Then open and edit:',
  '# Mac/Linux:  nano .env',
  '# Windows:    notepad .env',
];

const backendRunCommands = [
  '# Terminal 1 — start this first',
  'cd prismeyebackend',
  'npm run dev',
];

const frontendRunCommands = [
  '# Terminal 2 — open a new terminal tab',
  'cd prismeyefrontend',
  'npm run dev',
];

const backendEnvExample = `# Port PrismEye backend will run on
PORT=5000

# Your existing app — PrismEye forwards all traffic here
TARGET_URL=http://localhost:8080

# Labels shown in the dashboard
SERVER_NAME=my-server
APP_NAME=My Web App

# MongoDB — get a free one at cloud.mongodb.com
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/prismeye

# Change this to any long random string
JWT_SECRET=changethis_to_a_long_random_string

NODE_ENV=development`;

const frontendEnvExample = `# URL of your running prismeyebackend
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

NODE_ENV=development`;

function CodeBlock({ title, subtitle, lines }) {
  const text = lines.join('\n');
  const copyText = async () => {
    try { await navigator.clipboard.writeText(text); }
    catch (err) { console.error('Copy failed', err); }
  };
  return (
    <Box sx={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: '14px', overflow: 'hidden' }}>
      <Box sx={{ px: 2, py: 1.2, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
        <Box>
          <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.92rem' }}>{title}</Typography>
          {subtitle && <Typography sx={{ color: MUTED, fontSize: '0.75rem', mt: 0.2 }}>{subtitle}</Typography>}
        </Box>
        <Button onClick={copyText} sx={{ minWidth: 'auto', color: MUTED, textTransform: 'none', gap: 0.7, '&:hover': { color: '#fff' } }}>
          <ContentCopyIcon sx={{ fontSize: 16 }} />
          Copy
        </Button>
      </Box>
      <Box component="pre" sx={{ m: 0, p: 2.5, color: '#EAEAF3', fontSize: '0.85rem', overflowX: 'auto', lineHeight: 1.9 }}>
        <code>{text}</code>
      </Box>
    </Box>
  );
}

function InfoBox({ color, title, children }) {
  const c = color || PURPLE;
  return (
    <Box sx={{ background: `${c}11`, border: `1px solid ${c}33`, borderRadius: '12px', p: 2 }}>
      <Typography sx={{ color: c, fontWeight: 600, fontSize: '0.85rem', mb: 0.5 }}>{title}</Typography>
      <Typography sx={{ color: MUTED, fontSize: '0.83rem', lineHeight: 1.7 }}>{children}</Typography>
    </Box>
  );
}

function StepCard({ step, title, desc, color }) {
  return (
    <Box sx={{ background: 'linear-gradient(180deg, rgba(26,29,46,0.95) 0%, rgba(15,17,35,0.98) 100%)', border: `1px solid ${BORDER}`, borderRadius: '12px', p: 2.5, display: 'flex', alignItems: 'flex-start', gap: 2, transition: 'transform 0.2s, border-color 0.2s', '&:hover': { transform: 'translateY(-2px)', borderColor: color }, flex: 1 }}>
      <Typography sx={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'rgba(124,111,247,0.28)', lineHeight: 1, flexShrink: 0, mt: 0.2 }}>
        {step}
      </Typography>
      <Box>
        <Typography sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', mb: 0.5, color }}>
          {title}
        </Typography>
        <Typography sx={{ color: MUTED, fontSize: '0.83rem', lineHeight: 1.7 }}>{desc}</Typography>
      </Box>
    </Box>
  );
}

export default function InstallPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Install PrismEye</title>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
          body { margin: 0; background: #080B18; }
        `}</style>
      </Head>

      <Box sx={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>

        {/* NAV */}
        <Box sx={{ position: 'sticky', top: 0, zIndex: 10, px: { xs: 2, md: 6 }, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(20px)', background: 'rgba(8,11,24,0.88)', borderBottom: `1px solid ${BORDER}` }}>
          <Button onClick={() => router.push('/dashboard')} sx={{ color: '#fff', textTransform: 'none', display: 'flex', gap: 0.8, alignItems: 'center' }}>
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            Back to Dashboard
          </Button>
          <Button onClick={() => window.open(GITHUB_URL, '_blank')} sx={{ background: 'transparent', color: '#fff', border: `1px solid ${BORDER}`, borderRadius: '10px', px: 2.5, py: 0.8, fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1, '&:hover': { borderColor: '#fff' }, transition: 'all 0.2s', textTransform: 'none' }}>
            <GitHubIcon sx={{ fontSize: 18 }} />
            Source Code
          </Button>
        </Box>

        <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 6, md: 8 } }}>

          {/* HEADER */}
          <Typography sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, mb: 1.2 }}>
            Install PrismEye
          </Typography>
          <Typography sx={{ color: MUTED, fontSize: '1rem', mb: 1.5, maxWidth: 980, lineHeight: 1.8 }}>
            PrismEye is a self-hosted cybersecurity tool. Clone it from GitHub, run it on your server, and it
            sits in front of your existing application as a reverse proxy — inspecting every request for threats
            and showing everything live on a dashboard. No changes needed to your existing app.
          </Typography>
          <Typography sx={{ color: MUTED, fontSize: '0.92rem', mb: 4, maxWidth: 980, lineHeight: 1.8 }}>
            The project has two folders:{' '}
            <Box component="span" sx={{ color: PURPLE, fontWeight: 600 }}>prismeyebackend</Box>
            {' '}(the proxy — also runs the ML DDoS model automatically) and{' '}
            <Box component="span" sx={{ color: AMBER, fontWeight: 600 }}>prismeyefrontend</Box>
            {' '}(the dashboard). Both need to run at the same time using two terminal tabs.
          </Typography>

          {/* PREREQUISITES */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(5,1fr)' }, gap: 1.5, mb: 5 }}>
            {[
              { label: 'Node.js',  version: 'v18 or higher',         color: GREEN        },
              { label: 'npm',      version: 'Comes with Node.js',    color: GREEN        },
              { label: 'Python',   version: '3.8 or higher',         color: AMBER        },
              { label: 'Git',      version: 'Any version',           color: PURPLE_LIGHT },
              { label: 'MongoDB',  version: 'Atlas (free) or local', color: PURPLE       },
            ].map((r, i) => (
              <Box key={i} sx={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: '10px', p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                <Box>
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{r.label}</Typography>
                  <Typography sx={{ color: MUTED, fontSize: '0.75rem' }}>{r.version}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* PROXY DIAGRAM */}
          <Box sx={{ background: `${PURPLE}11`, border: `1px solid ${PURPLE}33`, borderRadius: '16px', p: 3, mb: 3 }}>
            <Typography sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, mb: 0.5, fontSize: '1.05rem' }}>
              How PrismEye works
            </Typography>
            <Typography sx={{ color: MUTED, fontSize: '0.83rem', mb: 2.5, lineHeight: 1.7, maxWidth: 980 }}>
              PrismEye runs on a different port from your app. Point your users to PrismEye&apos;s port — it inspects
              every request, detects threats, then forwards it to your app at TARGET_URL. Everything detected
              appears live on the dashboard.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr auto 1fr auto 1fr auto 1fr' }, gap: 1.5, alignItems: 'center', width: '100%' }}>
              {[
                { label: 'User Request',                color: MUTED   },
                { arrow: true },
                { label: 'prismeyebackend\nport 5000',  note: 'Inspects + detects\nML model runs here', color: PURPLE },
                { arrow: true },
                { label: 'Your App\nTARGET_URL',        note: 'e.g. port 8080\nUnchanged',              color: GREEN  },
                { arrow: true },
                { label: 'prismeyefrontend\nport 3000', note: 'Dashboard — live\nthreat monitoring',    color: AMBER  },
              ].map((item, i) =>
                item.arrow ? (
                  <Typography key={i} sx={{ color: PURPLE, opacity: 0.5, fontSize: '1.3rem', justifySelf: 'center' }}>{'→'}</Typography>
                ) : (
                  <Box key={i} sx={{ background: `${item.color}12`, border: `1px solid ${item.color}33`, borderRadius: '10px', px: 2, py: 1.2, textAlign: 'center', width: '100%', minWidth: 0 }}>
                    <Typography sx={{ color: item.color, fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{item.label}</Typography>
                    {item.note && <Typography sx={{ color: MUTED, fontSize: '0.7rem', mt: 0.5, whiteSpace: 'pre-line', lineHeight: 1.4 }}>{item.note}</Typography>}
                  </Box>
                )
              )}
            </Box>
          </Box>

          {/* WHAT YOU ARE SETTING UP */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', mb: 0.8 }}>
              What you are setting up
            </Typography>
            <Typography sx={{ color: MUTED, fontSize: '0.85rem', lineHeight: 1.7 }}>
              PrismEye has two parts — a Node.js backend that acts as a reverse proxy and detects attacks
              (including ML-based DDoS detection that starts automatically), and a Next.js dashboard
              to monitor everything in real time.
            </Typography>
          </Box>

          {/* TWO COLUMN — steps 1-3 + step cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.4fr 0.6fr' }, gap: 3, alignItems: 'stretch', mb: 4 }}>

            {/* LEFT */}
            <Box sx={{ display: 'grid', gap: 3 }}>
              <CodeBlock
                title="Step 1 — Clone the repository"
                subtitle="Downloads both prismeyebackend and prismeyefrontend in one folder"
                lines={cloneCommands}
              />
              <Box sx={{ display: 'grid', gap: 2 }}>
                <CodeBlock
                  title="Step 2a — Install backend dependencies"
                  subtitle="Run inside the prismeyebackend folder"
                  lines={backendInstallCommands}
                />
                <CodeBlock
                  title="Step 2b — Install frontend dependencies"
                  subtitle="Next.js is included in package.json — installs automatically"
                  lines={frontendInstallCommands}
                />
              </Box>
              <Box sx={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: '16px', p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: AMBER }} />
                  <Typography sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem' }}>
                    Step 3 — Install ML dependencies
                  </Typography>
                </Box>
                <Typography sx={{ color: MUTED, fontSize: '0.82rem', mb: 2, lineHeight: 1.7 }}>
                  PrismEye uses an XGBoost ML model to detect DDoS attacks. The backend spawns it automatically
                  on startup — but you need to install the Python packages once before first run.
                  Make sure <Box component="span" sx={{ color: AMBER, fontWeight: 600 }}>Python 3.8+</Box> is installed on your machine.
                </Typography>
                <CodeBlock
                  title="Install Python ML packages"
                  subtitle="Run once — never needs to be repeated"
                  lines={mlInstallCommands}
                />
              </Box>
            </Box>

            {/* RIGHT — step cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, height: '100%' }}>
              <StepCard step="01" color={PURPLE}       title="Clone the repo"          desc="git clone from GitHub. You get both prismeyebackend and prismeyefrontend inside one folder." />
              <StepCard step="02" color={AMBER}        title="npm install both"        desc="Each folder has its own dependencies. Install them separately — backend first, then frontend." />
              <StepCard step="03" color={AMBER}        title="Install ML dependencies" desc="Install Python packages once with pip. The ML DDoS service starts automatically with the backend." />
              <StepCard step="04" color={GREEN}        title="Configure .env files"    desc="Backend needs TARGET_URL, MongoDB URI, and JWT secret. Frontend just needs the backend URL." />
              <StepCard step="05" color={PURPLE_LIGHT} title="Run with 2 terminals"    desc="Terminal 1: start prismeyebackend. Terminal 2: start prismeyefrontend. ML model starts automatically." />
              <StepCard step="06" color={GREEN}        title="Register and monitor"    desc="Go to localhost:3000/register to create your admin account on first visit. After that use /login." />
            </Box>
          </Box>

          {/* STEP 4 — ENV FILES stacked */}
          <Box sx={{ display: 'grid', gap: 3, mb: 4 }}>
            <Box sx={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: '16px', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: PURPLE }} />
                <Typography sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem' }}>
                  Step 4a — Backend .env
                </Typography>
              </Box>
              <Typography sx={{ color: MUTED, fontSize: '0.82rem', mb: 2, lineHeight: 1.7 }}>
                Set <Box component="span" sx={{ color: GREEN, fontWeight: 600 }}>TARGET_URL</Box> to your existing app's address.
                For <Box component="span" sx={{ color: AMBER, fontWeight: 600 }}>MONGO_URI</Box> create a free cluster at{' '}
                <Box component="span" sx={{ color: '#fff' }}>cloud.mongodb.com</Box>, click Connect, and copy the string.
              </Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <CodeBlock title="Copy backend .env" lines={backendEnvCommands} />
                <Box component="pre" sx={{ m: 0, p: 2, borderRadius: '12px', background: BG3, border: `1px solid ${BORDER}`, color: '#EAEAF3', overflowX: 'auto', fontSize: '0.78rem', lineHeight: 1.9 }}>
                  <code>{backendEnvExample}</code>
                </Box>
              </Box>
            </Box>

            <Box sx={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: '16px', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: AMBER }} />
                <Typography sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem' }}>
                  Step 4b — Frontend .env
                </Typography>
              </Box>
              <Typography sx={{ color: MUTED, fontSize: '0.82rem', mb: 2, lineHeight: 1.7 }}>
                The frontend only needs to know where the backend is running.
                Set <Box component="span" sx={{ color: AMBER, fontWeight: 600 }}>NEXT_PUBLIC_BACKEND_URL</Box> to
                the same address your backend is on — by default{' '}
                <Box component="span" sx={{ color: '#fff', fontFamily: 'monospace' }}>http://localhost:5000</Box>.
              </Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <CodeBlock title="Copy frontend .env" lines={frontendEnvCommands} />
                <Box component="pre" sx={{ m: 0, p: 2, borderRadius: '12px', background: BG3, border: `1px solid ${BORDER}`, color: '#EAEAF3', overflowX: 'auto', fontSize: '0.78rem', lineHeight: 1.9 }}>
                  <code>{frontendEnvExample}</code>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* STEP 5 — RUN stacked */}
          <Box sx={{ display: 'grid', gap: 3, mb: 4 }}>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <CodeBlock
                title="Step 5a — Start the backend (Terminal 1)"
                subtitle="Run this first and keep it running — ML model starts automatically"
                lines={backendRunCommands}
              />
              <Box sx={{ background: `${GREEN}10`, border: `1px solid ${GREEN}33`, borderRadius: '10px', p: 2 }}>
                <Typography sx={{ color: GREEN, fontWeight: 600, fontSize: '0.82rem', mb: 0.8 }}>
                  Backend is running when you see:
                </Typography>
                <Box component="pre" sx={{ m: 0, color: MUTED, fontSize: '0.8rem', lineHeight: 1.7 }}>
                  <code>{`PrismEye running on port 5000\nML DDoS service starting on port 5001\nMongoDB connected`}</code>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gap: 2 }}>
              <CodeBlock
                title="Step 5b — Start the frontend (Terminal 2)"
                subtitle="Open a new terminal tab and run this"
                lines={frontendRunCommands}
              />
              <Box sx={{ background: `${AMBER}10`, border: `1px solid ${AMBER}33`, borderRadius: '10px', p: 2 }}>
                <Typography sx={{ color: AMBER, fontWeight: 600, fontSize: '0.82rem', mb: 0.5 }}>
                  Then open your browser:
                </Typography>
                <Typography sx={{ color: '#fff', fontFamily: 'monospace', fontSize: '0.88rem', mt: 0.3 }}>
                  http://localhost:3000/register
                </Typography>
                <Typography sx={{ color: MUTED, fontSize: '0.78rem', mt: 0.8, lineHeight: 1.6 }}>
                  First time only — create your admin account at /register.
                  After that use /login for all future visits.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* DEFAULT PORTS */}
          <Box sx={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: '16px', p: 3, mb: 4 }}>
            <Typography sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', mb: 2 }}>
              Default ports
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3,1fr)' }, gap: 2 }}>
              {[
                { label: 'prismeyebackend',  port: ':5000', desc: 'Proxy + detection engine + ML spawner', color: PURPLE },
                { label: 'ML DDoS service',  port: ':5001', desc: 'Auto-started by backend — XGBoost model', color: AMBER  },
                { label: 'prismeyefrontend', port: ':3000', desc: 'Next.js dashboard — live threat monitoring', color: GREEN  },
              ].map((p, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, background: BG3, border: `1px solid ${BORDER}`, borderRadius: '10px', px: 2.5, py: 1.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem' }}>{p.label}</Typography>
                      <Typography sx={{ color: p.color, fontWeight: 700, fontSize: '0.85rem', fontFamily: 'monospace' }}>{p.port}</Typography>
                    </Box>
                    <Typography sx={{ color: MUTED, fontSize: '0.75rem', mt: 0.2 }}>{p.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* INFO BOX */}
          <InfoBox color={AMBER} title="Monitoring multiple servers?">
            Install and run{' '}
            <Box component="span" sx={{ color: '#fff' }}>prismeyebackend</Box>
            {' '}on each server separately. Give each a unique{' '}
            <Box component="span" sx={{ color: '#fff' }}>SERVER_NAME</Box> and{' '}
            <Box component="span" sx={{ color: '#fff' }}>APP_NAME</Box> in its .env.
            All backends report to the same frontend dashboard — monitor everything from one place.
          </InfoBox>

        </Box>
      </Box>
    </>
  );
}