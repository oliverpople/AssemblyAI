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
      var transcriptText = await getTranscript(file);
      var extractedKeyWords = extractKeyWords(transcriptText);
      res.send(extractedKeyWords);
    } else {
      res.send("Its a 404");
      res.end();
    }
  });
});

app.get("/keywords/url", async function(req, res) {
  var uRL = req.query.link;
  if (uRL) {
    var transcriptText = await getTranscriptURL(uRL);
    var extractedKeyWords = extractKeyWords(transcriptText);
    res.send("Extracted keywords" + extractedKeyWords);
  } else {
    res.send("Its a 404");
    res.end();
  }
});

async function getTranscript(file) {
  try {
    const transcript = new assemblyai.Upload(file);
    const response = await transcript.create();
    const data = response.get();
    var transcriptText = data.text;
    return transcriptText;
  } catch (e) {
    // Do some error handling here
  }
}

async function getTranscriptURL(uRL) {
  try {
    const transcript = new assemblyai.Transcript();
    const response = await transcript.create({
      audio_src_url: uRL
    });
    const { id } = response.get();
    const data = await transcript.poll(id);
    var responseJson = data.get();
    var transcriptText = responseJson.text;
    console.log(transcriptText);
    return transcriptText;
  } catch (e) {
    // Do some error handling here
  }
}

function extractKeyWords(text) {
  var extractedKeyWords = keyword_extractor.extract(text, {
    language: "english",
    remove_digits: true,
    return_chained_words: true,
    return_changed_case: true,
    remove_duplicates: false
  });
  return extractedKeyWords;
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
