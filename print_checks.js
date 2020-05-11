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

function execQuery (qry, cb) {
  pool.query(qry, function(err, result) {
    cb(err, result);
  });
};


async function getData() {
  const qry = "SELECT * FROM `srspf_check_print`.`ICURCHKR00` LEFT JOIN `srspf_check_print`.`SCOMMOND00` ON CCSSN = CDSSN WHERE CCHKNO LIKE('5%') ORDER BY CCHKNO";

  return new Promise((resolve, reject) => {
    execQuery(qry, function(err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
};

function getLocalTaxes(ssn, fiscal, area, checkno) {
  const qry = "SELECT * FROM `srspf_check_print`.`ICTAXDED00` WHERE CSSSN = '" + ssn + "' AND CSFYR = '" + fiscal + "' AND CSAREA = '" + area + "' AND CSCHKNO = '" + checkno + "';";

  return new Promise((resolve, reject) => {
    execQuery(qry, function(err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
};

async function printLocalTaxes(taxLine, ssn, fiscal, area, checkno) {
  const localtaxData = await getLocalTaxes(ssn, fiscal, area, checkno);
  
  for await (const tax of localtaxData) {

    if (tax.CSTAX > 0) {
      switch (tax.CSCSCD) {
        case '07':
          taxLine++;
          await printTaxLine(taxLine, 'California State Tax', tax.CSTAX);
          break;
        case '34':
          taxLine++;
          await printTaxLine(taxLine, 'New York State Tax', tax.CSTAX);
          break;
        case '80':
          taxLine++;
          await printTaxLine(taxLine, 'Revenue Canada', tax.CSTAX);
          break;
        case '81':
          taxLine++;
          await printTaxLine(taxLine, 'Quebec', tax.CSTAX);
          break;
        case '82':
          taxLine++;
          await printTaxLine(taxLine, 'Ontario', tax.CSTAX);
          break;
        case '83':
          taxLine++;
          await printTaxLine(taxLine, 'Newfoundland', tax.CSTAX);
          break;
        case '84':
          taxLine++;
          await printTaxLine(taxLine, 'Prince Edward Island', tax.CSTAX);
          break;
        case '85':
          taxLine++;
          await printTaxLine(taxLine, 'Nova Scotia', tax.CSTAX);
          break;
        case '86':
          taxLine++;
          await printTaxLine(taxLine, 'New Brunswick', tax.CSTAX);
          break;
        case '87':
          taxLine++;
          await printTaxLine(taxLine, 'Manitoba', tax.CSTAX);
          break;
        case '88':
          taxLine++;
          await printTaxLine(taxLine, 'Saskatchewan', tax.CSTAX);
          break;
        case '89':
          taxLine++;
          await printTaxLine(taxLine, 'Alberta', tax.CSTAX);
          break;
        case '90':
          taxLine++;
          await printTaxLine(taxLine, 'British Columbia', tax.CSTAX);
          break;
        case '91':
          taxLine++;
          await printTaxLine(taxLine, 'Northwest Territories', tax.CSTAX);
          break;
        case '92':
          taxLine++;
          await printTaxLine(taxLine, 'Yukon Territory', tax.CSTAX);
          break;
        case '93':
          taxLine++;
          await printTaxLine(taxLine, 'Nunavut', tax.CSTAX);
          break;
        case '98':
          taxLine++;
          await printTaxLine(taxLine, 'California Disability', tax.CSTAX);
          break;
        case '99':
          taxLine++;
          await printTaxLine(taxLine, 'New York City Tax', tax.CSTAX);
          break;
        default:
          console.error('Invalid Tax Code: ' + tax.CSCSCD)
          break;
      };
    };

  };

  return taxLine;

};

async function printTaxLine(line, desc, amt) {

  switch (line) {
    case 1:
      doc
      .font("Courier-Bold", 10)
      .text(desc.padEnd(23) + formatDec.format(amt).padStart(13),	232.4409449, 345.8267717);
      // return true;
      break;
    case 2:
      doc
      .font("Courier-Bold", 10)
      .text(desc.padEnd(23) + formatDec.format(amt).padStart(13),	232.4409449,	357.1653543);
      // return true;
      break;
    case 3:
      doc
      .font("Courier-Bold", 10)
      .text(desc.padEnd(23) + formatDec.format(amt).padStart(13),	232.4409449,	368.503937);
      // return true;
      break;
    case 4:
      doc
      .font("Courier-Bold", 10)
      .text(desc.padEnd(23) + formatDec.format(amt).padStart(13),	232.4409449,	379.8425197);
      // return true;
      break;
    case 5:
      doc
      .font("Courier-Bold", 10)
      .text(desc.padEnd(23) + formatDec.format(amt).padStart(13),	232.4409449,	391.1811024);
      // return true;
      break;
    case 6:
      doc
      .font("Courier-Bold", 10)
      .text(desc.padEnd(23) + formatDec.format(amt).padStart(13),	232.4409449,	402.519685);
      // return true;
      break;
    case 7:
      doc
      .font("Courier-Bold", 10)
      .text(desc.padEnd(23) + formatDec.format(amt).padStart(13),	232.4409449,	413.8582677);
      // return true;
      break;
    case 8:
      doc
      .font("Courier-Bold", 10)
      .text(desc.padEnd(23) + formatDec.format(amt).padStart(13),	232.4409449,	425.1968504);
      // return true;
      break;
    case 9:
      doc
      .font("Courier-Bold", 10)
      .text(desc.padEnd(23) + formatDec.format(amt).padStart(13),	232.4409449,	436.5354331);
      // return true;
      break;
    case 10:
      doc
      .font("Courier-Bold", 10)
      .text(desc.padEnd(23) + formatDec.format(amt).padStart(13),	232.4409449,	447.8740157);
      // return true;
      break;
    case 11:
      doc
      .font("Courier-Bold", 10)
      .text(desc.padEnd(23) + formatDec.format(amt).padStart(13),	232.4409449,	459.2125984);
      // return true;
      break;
    case 12:
      doc
      .font("Courier-Bold", 10)
      .text(desc.padEnd(23) + formatDec.format(amt).padStart(13),	232.4409449,	470.5511811);
      // return true;
      break;
    case 13:
      doc
      .font("Courier-Bold", 10)
      .text(desc.padEnd(23) + formatDec.format(amt).padStart(13),	232.4409449,	481.8897638);
      // return true;
      break;
    case 14:
      doc
      .font("Courier-Bold", 10)
      .text(desc.padEnd(23) + formatDec.format(amt).padStart(13),	232.4409449,	493.2283465);
      // return true;
      break;
    case 15:
      doc
      .font("Courier-Bold", 10)
      .text(desc.padEnd(23) + formatDec.format(amt).padStart(13),	232.4409449,	504.5669291);
      // return true;
      break;
  
    default:
      console.error('Tax Lines exceeded max lines: ' + line)
      // return false;
      break;
  }

};

async function createChecks() {

  const checkData = await getData();

  for await (const check of checkData) {

    let taxLine = 0;
    let taxPrinted = false;
  
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
      .text("DATE " + check.CCISS.toString().substr(4,2) + '/' + check.CCISS.toString().substr(6,2) + '/' + check.CCISS.toString().substr(0,4),	34.01574803, 291.9685039)
      .text(check.CCHKNO,	535.7480315, 291.9685039);
      // .text(check.CCFYR,	34.01574803, 345.8267717); Not on current check stub (never populated in program)

    if (check.MBRUID) {
      doc
        .text("SRSPF ID   " + check.MBRUID,	34.01574803, 308.976378)  
    }
      

      if (check.CCGROSS > 0) {
        taxLine++;
        await printTaxLine(taxLine, 'Gross Payment', check.CCGROSS);
      }

      if (check.CCFEDTAX > 0) {
        taxLine++;
        await printTaxLine(taxLine, 'Federal Tax', check.CCFEDTAX);  
      }

      if (check.CCFICA > 0) {
        taxLine++;
        await printTaxLine(taxLine, 'F.I.C.A.', check.CCFICA);  
      }

      if (check.CCMEDTAX > 0) {
        taxLine++;
        await printTaxLine(taxLine, 'Medicare', check.CCMEDTAX);  
      }

      taxLine = await printLocalTaxes(taxLine, check.CCSSN, check.CCFYR, check.CCAREA, check.CCHKNO);

      taxLine++;
      await printTaxLine(taxLine, 'Net Amount', check.CCNET);

    const checkDate = "DATE " + check.CCISS.toString().substr(4,2) + '/' + check.CCISS.toString().substr(6,2) + '/' + check.CCISS.toString().substr(0,4);
    const checkFiscal = "  FISCAL " + check.CCFYR;

    doc
      .font("Helvetica-Bold", 8)
      .text(check.CCHKNO,	535.7480315,	557.007874)
      .text(checkDate + checkFiscal,	36.8503937, 571.1811024);

    doc
      .font("Times-Bold", 9)
      .text("*" + format$.format(check.CCNET), 507.4015748, 613.7007874);
       
    doc
      .font("Courier-BoldOblique", 9)
      .text((num2words.toWords(check.CCNET).toUpperCase() + ' AND ' + formatDec.format(check.CCNET).toString().split('.')[1] + '/100').padStart(75, '*'),	34.01574803,	622.2047244)

    doc
    .font("fonts/SecurePay6a.ttf", 20)
    .text("[=" + format$.format(check.CCNET) + "]", 272.1259843,	653.3858268);

    doc
    .font("fonts/SecurePay6a.ttf", 20)
    .text("p", 36.8503937,	661);

    doc
      .font("Helvetica-Bold", 10)
      .text(check.CCTNAM,	104.8818898,	674.6456693)
      .text(check.CCADD1,	104.8818898,	684.5669291)
      .text(check.CCADD2,	104.8818898,	694.488189)
      .text(check.CCADD3,	104.8818898,	704.4094488)
      .text(check.CCADD4,	104.8818898,	714.3307087);

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

createChecks();
