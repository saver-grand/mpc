const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Temp folder for HLS
const HLS_DIR = path.join(__dirname, "hls");
if (!fs.existsSync(HLS_DIR)) fs.mkdirSync(HLS_DIR);

// Start FFmpeg process to restream DASH → HLS
const ffmpeg = spawn("ffmpeg", [
  "-y",
  "-loglevel", "error",
  "-decryption_key", "76dc29dd87a244aeab9e8b7c5da1e5f3:95b2f2ffd4e14073620506213b62ac82",
  "-i", "https://qp-pldt-live-grp-01-prod.akamaized.net/out/u/cg_pbarush_hd1.mpd",
  "-c:v", "copy",
  "-c:a", "copy",
  "-f", "hls",
  "-hls_time", "5",
  "-hls_playlist_type", "event",
  path.join(HLS_DIR, "playlist.m3u8")
]);

ffmpeg.stderr.on("data", (data) => {
  console.error("FFmpeg:", data.toString());
});

// Serve the HLS files
app.use("/pbarush", express.static(HLS_DIR));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
