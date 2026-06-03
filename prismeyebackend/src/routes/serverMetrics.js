const express = require('express');
const router  = express.Router();
const os      = require('os');

router.get('/metrics', (req, res) => {
  try {
    const totalMem = os.totalmem();
    const freeMem  = os.freemem();
    const usedMem  = totalMem - freeMem;
    const memPct   = Math.round((usedMem / totalMem) * 100);

    const cpus     = os.cpus();
    const cpuUsage = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      return acc + Math.round(((total - cpu.times.idle) / total) * 100);
    }, 0) / cpus.length;

    const uptimeSec  = os.uptime();
    const uptimeDays = Math.floor(uptimeSec / 86400);
    const uptimeHrs  = Math.floor((uptimeSec % 86400) / 3600);
    const uptimeMins = Math.floor((uptimeSec % 3600) / 60);
    const uptime     = uptimeDays > 0
      ? `${uptimeDays}d ${uptimeHrs}h ${uptimeMins}m`
      : `${uptimeHrs}h ${uptimeMins}m`;

    const activeInterface = Object.values(os.networkInterfaces())
      .flat()
      .find(i => !i.internal && i.family === 'IPv4');

    res.json({
      name:        process.env.SERVER_NAME || os.hostname(),
      application: process.env.APP_NAME || 'Web Application',
      cpu:         Math.round(cpuUsage),
      memory:      memPct,
      uptime,
      platform:    os.platform(),
      arch:        os.arch(),
      ip:          activeInterface?.address || 'N/A',
      totalMemGB:  (totalMem / 1024 / 1024 / 1024).toFixed(1),
      freeMemGB:   (freeMem  / 1024 / 1024 / 1024).toFixed(1),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;