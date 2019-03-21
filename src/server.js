import Papa from "papaparse";
import fs from "fs";

const ExpectedIn =
  "/home/dthompson/src/maana/q/public/q-tutorials/claroil/well-opportunity/data/WellTest-Case-ExpectedRates-Rev0.csv";
const ExpectedOut =
  "/home/dthompson/src/maana/q/public/q-tutorials/claroil/well-opportunity/data/expected.csv";
const MeasuredIn =
  "/home/dthompson/src/maana/q/public/q-tutorials/claroil/well-opportunity/data/MeasuredRates-Month_01.csv";
const MeasuredOut =
  "/home/dthompson/src/maana/q/public/q-tutorials/claroil/well-opportunity/data/measured.csv";

const rotate = (inPath, outPath) => {
  Papa.parse(fs.createReadStream(inPath), {
    complete: results => {
      const { data, errors, meta } = results;
      const writeStream = fs.createWriteStream(outPath);

      // calculate table dimensions
      const rows = data.length - 2;
      const cols = data[0].length;

      // the names of the wells are stored in the column headers
      const wellIdx = data[0];

      // the name of the metrics are stored in the second set of column headers
      const rateIdx = data[1];

      // write headers
      writeStream.write(rateIdx.slice(0, 7).join(",") + "\n");

      // process each set of well data per date
      for (let i = 2; i < rows; i++) {
        const row = data[i];
        const date = row[0];
        let out = [];
        for (let j = 1; j < cols; j++) {
          // each well has 6 readings
          const k = (j - 1) % 6;

          // initialize new output row
          if (k === 0) {
            const wellName = wellIdx[j];
            out = [date, wellName];
          }

          out.push(row[j]);

          // flush on last metric for well
          if (k === 5) {
            writeStream.write(out.join(",") + "\n");
          }
        }
      }
      writeStream.end();
    }
  });
};

rotate(ExpectedIn, ExpectedOut);
rotate(MeasuredIn, MeasuredOut);
