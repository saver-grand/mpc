const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.get("/hls/pbarush/playlist.m3u8", (req, res) => {
  const ffmpeg = spawn("ffmpeg", [
    "-i", "https://qp-pldt-live-grp-01-prod.akamaized.net/out/u/cg_pbarush_hd1.mpd",
    "-c:v", "copy",
    "-c:a", "copy",
    "-f", "hls",
    "-hls_time", "6",
    "-hls_list_size", "5",
    "-hls_flags", "delete_segments",
    "pipe:1"
  ]);

  res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
  ffmpeg.stdout.pipe(res);

  ffmpeg.stderr.on("data", (data) => console.error(data.toString()));
  ffmpeg.on("close", () => console.log("FFmpeg closed"));
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
