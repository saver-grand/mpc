const express = require("express");
const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const { PassThrough } = require("stream");

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * 🔴 Example: PBA Rush HD
 * Decrypts + restreams MPD → HLS
 */
app.get("/pbarush/playlist.m3u8", (req, res) => {
  res.setHeader("Content-Type", "application/vnd.apple.mpegurl");

  const ffmpegStream = new PassThrough();

  ffmpeg("https://qp-pldt-live-grp-01-prod.akamaized.net/out/u/cg_pbarush_hd1.mpd")
    .inputOptions([
      "-decryption_key", "76dc29dd87a244aeab9e8b7c5da1e5f3:95b2f2ffd4e14073620506213b62ac82"
    ])
    .addOptions([
      "-c:v copy",
      "-c:a copy",
      "-f hls",
      "-hls_time 5",
      "-hls_list_size 6",
      "-hls_flags delete_segments"
    ])
    .outputFormat("hls")
    .pipe(ffmpegStream);

  ffmpegStream.pipe(res);
});

app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Restream Server Running</h2>
    <p>Try: <a href="/pbarush/playlist.m3u8">/pbarush/playlist.m3u8</a></p>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
