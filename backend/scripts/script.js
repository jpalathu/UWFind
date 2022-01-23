const fs = require("fs");
const path = require("path");
const readline = require("readline");

const writeToFile = (fileName, data) => {
  fs.writeFileSync(
    path.join(__dirname, "../api/fixtures", "/") + fileName + ".json",
    JSON.stringify(data, null, 2),
    "utf-8"
  );
};

const getLinesFromFile = (fileName) => {
  const fileStream = fs.createReadStream(
    path.join(__dirname, "data", "/") + fileName + ".txt"
  );
  const lines = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  return lines;
};

const generateJson = async (fileName, modelName) => {
  const lines = getLinesFromFile(fileName);

  const output = [];
  for await (const line of lines) {
    if (line) {
      output.push({
        model: "api." + modelName,
        fields: {
          name: line.trim(),
        },
      });
    }
  }

  writeToFile(fileName, output);
};

const generateJsonFiles = () => {
  generateJson("category", "category");
  generateJson("building", "building");
  generateJson("drop_off_location", "dropOffLocation");
};

generateJsonFiles();
