const mongoose  = require('mongoose');
const fs        = require('fs');
const path      = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Threat    = require('../db/threatLogs');
const NormalLog = require('../db/normalLog');

const LOG_FILE    = path.join(__dirname, '../../logs/threats.log');
const NORMAL_FILE = path.join(__dirname, '../../logs/normal.log');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    if (fs.existsSync(LOG_FILE)) {
      const threats = fs.readFileSync(LOG_FILE, 'utf-8')
        .split('\n').filter(l => l.trim())
        .map(l => { try { return JSON.parse(l); } catch { return null; } })
        .filter(Boolean);

      if (threats.length > 0) {
        await Threat.insertMany(threats, { ordered: false });
        console.log(`✅ Migrated ${threats.length} threats`);
      } else {
        console.log('ℹ️  No threats to migrate');
      }
    }

    if (fs.existsSync(NORMAL_FILE)) {
      const normals = fs.readFileSync(NORMAL_FILE, 'utf-8')
        .split('\n').filter(l => l.trim())
        .map(l => { try { return JSON.parse(l); } catch { return null; } })
        .filter(Boolean);

      if (normals.length > 0) {
        await NormalLog.insertMany(normals, { ordered: false });
        console.log(`✅ Migrated ${normals.length} normal logs`);
      } else {
        console.log('ℹ️  No normal logs to migrate');
      }
    }

    console.log('\n✅ Migration complete');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    mongoose.disconnect();
  }
}

migrate();