var fs = require("fs");
var csvWriter = require("csv-write-stream")

var writer = csvWriter({ headers: ["name", "age","dob"]})
writer.pipe(fs.createWriteStream('out.csv'))
writer.write(['world', '23','23-09-21'])
writer.write(['jjj', '24','23-09-29'])
writer.end();