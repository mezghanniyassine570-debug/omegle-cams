/**
 * EMERGENCY UNBAN SCRIPT
 * Run this to clear all IP bans and reset moderation data.
 * 
 * Usage: node reset_bans.js
 */

const fs = require('fs');
const path = require('path');

const MODERATION_FILE = path.join(__dirname, 'moderation.json');

console.log('--- OmegleCams Emergency Unban Tool ---');

function resetBans() {
  try {
    let data = { bans: [], reports: {}, logs: [], visitors: [] };

    if (fs.existsSync(MODERATION_FILE)) {
      console.log(`[info] Found existing moderation file at: ${MODERATION_FILE}`);
      const raw = fs.readFileSync(MODERATION_FILE, 'utf8');
      try {
        const loaded = JSON.parse(raw);
        // Keep logs and visitors, ONLY clear the bans
        data = { ...data, ...loaded, bans: [] };
        console.log(`[info] Clearing ${loaded.bans?.length || 0} active bans...`);
      } catch (e) {
        console.warn('[warn] Could not parse existing JSON, resetting to defaults.');
      }
    } else {
      console.log('[info] No moderation file found. Creating a fresh one...');
    }

    fs.writeFileSync(MODERATION_FILE, JSON.stringify(data, null, 2));
    console.log('----------------------------------------');
    console.log('✅ SUCCESS: All IP bans have been cleared.');
    console.log('👉 ACTION: Restart your Node.js server to apply changes!');
    console.log('----------------------------------------');
  } catch (error) {
    console.error('❌ ERROR: Could not reset bans:', error.message);
  }
}

resetBans();
