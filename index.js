const express = require("express");
const fs = require("fs");
const app = express();
const port = 3003;
const keyword_extractor = require("keyword-extractor");
const assemblyai = require("assemblyai");
const keys = require("./keys.js");
assemblyai.setAPIKey(keys.assemblyAI);

app.use("/public", express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  return res.redirect("/public/home.html");
});

app.get("/audio", function(req, res) {
  var fileId = req.query.id;
  var file = __dirname + "/audio/" + fileId;
  fs.exists(file, function(exists) {
    if (exists) {
      var rstream = fs.createReadStream(file);
      rstream.pipe(res);
    } else {
      res.send("Its a 404");
      res.end();
    }
  });
});

app.get("/keywords", function(req, res) {
  var fileId = req.query.id;
  var file = __dirname + "/audio/" + fileId;
  fs.exists(file, async function(exists) {
    if (exists) {
      var keywords = await getKeywords(file);
      res.send(keywords);
    } else {
      res.send("Its a 404");
      res.end();
    }
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

async function getKeywords(file) {
  try {
    const transcript = new assemblyai.Upload(file);
    const response = await transcript.create();
    const data = response.get();
    var text = data.text;
    var extractedKeywords = extractKeyWords(text);
    // console.log(extractedKeywords);
    return extractedKeywords;
  } catch (e) {
    // Do some error handling here
  }
}

function extractKeyWords(text) {
  var extractedKeywords = keyword_extractor.extract(text, {
    language: "english",
    remove_digits: true,
    return_chained_words: true,
    return_changed_case: true,
    remove_duplicates: false
  });
  return extractedKeywords;
}
