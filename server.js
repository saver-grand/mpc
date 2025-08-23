const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// 📂 HLS output folder
const outputDir = path.join(__dirname, "hls");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// 📺 Stream configuration
const streams = {
  pbarush: {
    url: "https://qp-pldt-live-grp-01-prod.akamaized.net/out/u/cg_pbarush_hd1.mpd",
    key:
      "76dc29dd87a244aeab9e8b7c5da1e5f3:95b2f2ffd4e14073620506213b62ac82"
  }
};

// 🛠 Start FFmpeg restream
Object.entries(streams).forEach(([name, cfg]) => {
  const streamPath = path.join(outputDir, name);
  if (!fs.existsSync(streamPath)) fs.mkdirSync(streamPath);

  console.log(`🎥 Starting restream: ${name}`);

  ffmpeg(cfg.url)
    .setFfmpegPath(ffmpegPath)
    .addOption("-c", "copy") // no re-encode
    .addOption("-bsf:a", "aac_adtstoasc")
    .addOption("-f", "hls")
    .addOption("-hls_time", "6")
    .addOption("-hls_list_size", "6")
    .addOption("-hls_flags", "delete_segments")
    .output(path.join(streamPath, "playlist.m3u8"))
    .on("start", (cmd) => console.log(`▶️ FFmpeg started: ${cmd}`))
    .on("error", (err) => console.error(`❌ FFmpeg error [${name}]: ${err.message}`))
    .run();
});

// 🌐 Serve HLS
app.use("/hls", express.static(outputDir));

app.get("/", (req, res) => {
  res.send("✅ Restream server is running.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
