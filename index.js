const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
const directoryPath = path.join(__dirname, "geojson");

app.use(express.static(__dirname)); // 정적 파일 제공

// GeoJSON 파일 목록을 클라이언트로 전송
app.get("/geojson-files", (req, res) => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan directory: " + err);
    }
    const geojsonFiles = files.filter((file) => file.endsWith(".geojson"));
    res.json({ files: geojsonFiles });
  });
});

// 특정 GeoJSON 파일의 데이터를 클라이언트로 전송
app.get("/geojson/:filename", (req, res) => {
  const filePath = path.join(directoryPath, req.params.filename);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file: " + err);
    }
    res.json(JSON.parse(data));
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
