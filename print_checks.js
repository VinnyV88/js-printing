const PDFDocument = require("pdfkit");
// const PCLDocument = require('pclkit');
const fs = require("fs");
const pool = require("./config/connection.js");
const num2words = require('number-to-words');

// create a document and pipe to a blob
const doc = new PDFDocument({margin:0});
// const doc = new PCLDocument();

doc.pipe(fs.createWriteStream("output.pdf"));
// doc.pipe(fs.createWriteStream('output.prn'));

const format$ = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

const formatDec = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2
})


async function getData(cb) {
  try {
    const checkData = await pool.query(
      // "SELECT * FROM `srspf_check_print`.`ICURCHKR00` JOIN `srspf_check_print`.`SCOMMOND00` ON CCSSN = CDSSN"
      "SELECT * FROM `srspf_check_print`.`ICURCHKR00`;", function(err, result) {
        cb(result);
      });
  } catch (e) {
    console.error("[getData] error: ", error);
  }
}

async function createChecks(checkData) {

  for await (const check of checkData) {

    // draw some text
    doc
      .font("Courier-Bold", 12)
      .text(check.CCTNAM,	82.20472441, 180)
      .text(check.CCADD1,	82.20472441, 189.9212598)
      .text(check.CCADD2,	82.20472441, 199.8425197)
      .text(check.CCADD3,	82.20472441, 209.7637795)
      .text(check.CCADD4,	82.20472441, 219.6850394);

    doc
      .font("Courier-Bold", 10)
      .text(check.CCISS.toString().substr(4,2) + '/' + check.CCISS.toString().substr(6,2) + '/' + check.CCISS.toString().substr(0,4),	34.01574803, 291.9685039)
      // .text(check.MBRUID,	34.01574803, 308.976378)
      .text(check.CCHKNO,	535.7480315, 291.9685039)
      .text(check.CCFYR,	34.01574803, 345.8267717)
      .text(formatDec.format(check.CCGROSS),	232.4409449, 345.8267717)
      .text(formatDec.format(check.CCNET),	232.4409449, 357.1653543);

    doc
      .font("Helvetica-Bold", 8)
      .text(check.CCHKNO,	535.7480315,	557.007874)
      .text(check.CCFYR,	36.8503937,	571.1811024);
      
    doc
      .font("Courier-BoldOblique", 9)
      .text((num2words.toWords(check.CCNET).toUpperCase() + ' AND ' + formatDec.format(check.CCNET).toString().split('.')[1] + '/100').padStart(75, '*'),	34.01574803,	622.2047244)

    doc
    .font("fonts/SecurePay6a.ttf", 20)
    .text("[=" + format$.format(check.CCNET) + "]", 272.1259843,	653.3858268);

    doc
    .font("fonts/micr.ttf", 20)
    .text(check.CCHKNO, 103.4645669, 768.1889764)
    .text('021309379', 202.6771654, 768.1889764)
    .text('615777015', 347.2440945, 768.1889764);

    doc.addPage()
  }

  doc.end();
  console.log("DONE");
}

getData(createChecks);

// end and display the document in the iframe to the right