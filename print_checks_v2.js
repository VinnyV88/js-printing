// import { PDFDocument } from 'pdf-lib';
// import fontkit from '@pdf-lib/fontkit';
const { PDFDocument } = require('pdf-lib');
const { StandardFonts } = require('pdf-lib');
const { PageSizes } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');

const fs = require("fs");
const pool = require("./config/connection.js");
const num2words = require('number-to-words');

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

async function printLocalTaxes(page, height, taxLine, ssn, fiscal, area, checkno) {
  const localtaxData = await getLocalTaxes(ssn, fiscal, area, checkno);
  
  for await (const tax of localtaxData) {

    if (tax.CSTAX > 0) {
      switch (tax.CSCSCD) {
        case '07':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'California State Tax', tax.CSTAX);
          break;
        case '34':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'New York State Tax', tax.CSTAX);
          break;
        case '80':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'Revenue Canada', tax.CSTAX);
          break;
        case '81':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'Quebec', tax.CSTAX);
          break;
        case '82':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'Ontario', tax.CSTAX);
          break;
        case '83':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'Newfoundland', tax.CSTAX);
          break;
        case '84':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'Prince Edward Island', tax.CSTAX);
          break;
        case '85':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'Nova Scotia', tax.CSTAX);
          break;
        case '86':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'New Brunswick', tax.CSTAX);
          break;
        case '87':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'Manitoba', tax.CSTAX);
          break;
        case '88':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'Saskatchewan', tax.CSTAX);
          break;
        case '89':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'Alberta', tax.CSTAX);
          break;
        case '90':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'British Columbia', tax.CSTAX);
          break;
        case '91':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'Northwest Territories', tax.CSTAX);
          break;
        case '92':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'Yukon Territory', tax.CSTAX);
          break;
        case '93':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'Nunavut', tax.CSTAX);
          break;
        case '98':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'California Disability', tax.CSTAX);
          break;
        case '99':
          taxLine++;
          await printTaxLine(page, height, taxLine, 'New York City Tax', tax.CSTAX);
          break;
        default:
          console.error('Invalid Tax Code: ' + tax.CSCSCD)
          break;
      };
    };

  };

  return taxLine;

};

async function printTaxLine(page, height, line, desc, amt) {

  switch (line) {
    case 1:
      page.setFontSize(10)
      page.drawText(desc.padEnd(23) + formatDec.format(amt).padStart(13), {x:232.4409449, y:height - 345.8267717});
      // return true;
      break;
    case 2:
      page.setFontSize(10)
      page.drawText(desc.padEnd(23) + formatDec.format(amt).padStart(13), {x:232.4409449, y:height - 357.1653543});
      // return true;
      break;
    case 3:
      page.setFontSize(10)
      page.drawText(desc.padEnd(23) + formatDec.format(amt).padStart(13), {x:232.4409449, y:height - 368.503937});
      // return true;
      break;
    case 4:
      page.setFontSize(10)
      page.drawText(desc.padEnd(23) + formatDec.format(amt).padStart(13), {x:232.4409449, y:height - 379.8425197});
      // return true;
      break;
    case 5:
      page.setFontSize(10)
      page.drawText(desc.padEnd(23) + formatDec.format(amt).padStart(13), {x:232.4409449, y:height - 391.1811024});
      // return true;
      break;
    case 6:
      page.setFontSize(10)
      page.drawText(desc.padEnd(23) + formatDec.format(amt).padStart(13), {x:232.4409449, y:height - 402.519685});
      // return true;
      break;
    case 7:
      page.setFontSize(10)
      page.drawText(desc.padEnd(23) + formatDec.format(amt).padStart(13), {x:232.4409449, y:height - 413.8582677});
      // return true;
      break;
    case 8:
      page.setFontSize(10)
      page.drawText(desc.padEnd(23) + formatDec.format(amt).padStart(13), {x:232.4409449, y:height - 425.1968504});
      // return true;
      break;
    case 9:
      page.setFontSize(10)
      page.drawText(desc.padEnd(23) + formatDec.format(amt).padStart(13), {x:232.4409449, y:height - 436.5354331});
      // return true;
      break;
    case 10:
      page.setFontSize(10)
      page.drawText(desc.padEnd(23) + formatDec.format(amt).padStart(13), {x:232.4409449, y:height - 447.8740157});
      // return true;
      break;
    case 11:
      page.setFontSize(10)
      page.drawText(desc.padEnd(23) + formatDec.format(amt).padStart(13), {x:232.4409449, y:height - 459.2125984});
      // return true;
      break;
    case 12:
      page.setFontSize(10)
      page.drawText(desc.padEnd(23) + formatDec.format(amt).padStart(13), {x:232.4409449, y:height - 470.5511811});
      // return true;
      break;
    case 13:
      page.setFontSize(10)
      page.drawText(desc.padEnd(23) + formatDec.format(amt).padStart(13), {x:232.4409449, y:height - 481.8897638});
      // return true;
      break;
    case 14:
      page.setFontSize(10)
      page.drawText(desc.padEnd(23) + formatDec.format(amt).padStart(13), {x:232.4409449, y:height - 493.2283465});
      // return true;
      break;
    case 15:
      page.setFontSize(10)
      page.drawText(desc.padEnd(23) + formatDec.format(amt).padStart(13), {x:232.4409449, y:height - 504.5669291});
      // return true;
      break;
  
    default:
      console.error('Tax Lines exceeded max lines: ' + line)
      // return false;
      break;
  }

};

async function createChecks() {
  // create a document and pipe to a blob
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const CourierBoldFont = await doc.embedFont(StandardFonts.CourierBold);
  const HelveticaBoldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const TimesRomanBoldFont = await doc.embedFont(StandardFonts.TimesRomanBold);
  const CourierBoldObliqueFont = await doc.embedFont(StandardFonts.CourierBoldOblique);

  const secureFontData = fs.readFileSync("fonts/SecurePay6a.ttf");
  const secureFont = await doc.embedFont(secureFontData);

  const micrFontData = fs.readFileSync("fonts/micr.ttf");
  const micrFont = await doc.embedFont(micrFontData);

  const checkOverlayFile = fs.readFileSync('sampling_overlay.pdf');
  const checkOverlayPDF = await PDFDocument.load(checkOverlayFile);
  const [checkOverlay] = await doc.embedPdf(checkOverlayPDF);
  const checkData = await getData();

  for await (const check of checkData) {
    const page = doc.addPage(PageSizes.Letter);
    const pgHeight = page.getHeight();
    const height = pgHeight - 10;
    page.drawPage(checkOverlay);

    let taxLine = 0;
    page.setFont(CourierBoldFont);
  
    // draw some text
      page.setFontSize(12)
      page.drawText(check.CCTNAM,	{x:82.20472441, y:height - 180})
      page.drawText(check.CCADD1,	{x:82.20472441, y:height - 189.9212598})
      page.drawText(check.CCADD2,	{x:82.20472441, y:height - 199.8425197})
      page.drawText(check.CCADD3,	{x:82.20472441, y:height - 209.7637795})
      page.drawText(check.CCADD4,	{x:82.20472441, y:height - 219.6850394});

      page.setFontSize(10)
      page.drawText("DATE " + check.CCISS.toString().substr(4,2) + '/' + check.CCISS.toString().substr(6,2) + '/' + check.CCISS.toString().substr(0,4),	{x:34.01574803, y:height - 291.9685039})
      page.drawText(check.CCHKNO,	{x:535.7480315, y:height - 291.9685039});

    if (check.MBRUID) {
          page.drawText("SRSPF ID   " + check.MBRUID,	{x:34.01574803, y:height - 308.976378})  
    }
      

      if (check.CCGROSS > 0) {
        taxLine++;
        await printTaxLine(page, height, taxLine, 'Gross Payment', check.CCGROSS);
      }

      if (check.CCFEDTAX > 0) {
        taxLine++;
        await printTaxLine(page, height, taxLine, 'Federal Tax', check.CCFEDTAX);  
      }

      if (check.CCFICA > 0) {
        taxLine++;
        await printTaxLine(page, height, taxLine, 'F.I.C.A.', check.CCFICA);  
      }

      if (check.CCMEDTAX > 0) {
        taxLine++;
        await printTaxLine(page, height, taxLine, 'Medicare', check.CCMEDTAX);  
      }

      taxLine = await printLocalTaxes(page, height, taxLine, check.CCSSN, check.CCFYR, check.CCAREA, check.CCHKNO);

      taxLine++;
      await printTaxLine(page, height, taxLine, 'Net Amount', check.CCNET);

    const checkDate = "DATE " + check.CCISS.toString().substr(4,2) + '/' + check.CCISS.toString().substr(6,2) + '/' + check.CCISS.toString().substr(0,4);
    const checkFiscal = "  FISCAL " + check.CCFYR;

      page.setFont(HelveticaBoldFont)
      page.setFontSize(8)
      page.drawText(check.CCHKNO,	{x:535.7480315,	y:height - 557.007874})
      page.drawText(checkDate + checkFiscal,	{x:36.8503937, y:height - 571.1811024});

      page.setFont(TimesRomanBoldFont)
      page.setFontSize(9)
      page.drawText("*" + format$.format(check.CCNET), {x:507.4015748, y:height - 613.7007874});
       
      page.setFont(CourierBoldObliqueFont)
      page.setFontSize(9)
      page.drawText((num2words.toWords(check.CCNET).toUpperCase() + ' AND ' + formatDec.format(check.CCNET).toString().split('.')[1] + '/100').padStart(75, '*'),	{x:34.01574803,	y:height - 622.2047244})

    page.setFont(secureFont)
    page.setFontSize(28)
    page.drawText("[=" + format$.format(check.CCNET) + "]", {x:272.1259843,	y:height - 653.3858268});

    page.setFont(secureFont)
    page.setFontSize(20)
    page.drawText("p", {x:36.8503937,	y:height - 676.5});

      page.setFont(HelveticaBoldFont)
      page.setFontSize(10)
      page.drawText(check.CCTNAM,	{x:104.8818898,	y:height - 674.6456693})
      page.drawText(check.CCADD1,	{x:104.8818898,	y:height - 684.5669291})
      page.drawText(check.CCADD2,	{x:104.8818898,	y:height - 694.488189})
      page.drawText(check.CCADD3,	{x:104.8818898,	y:height - 704.4094488})
      page.drawText(check.CCADD4,	{x:104.8818898,	y:height - 714.3307087});

    page.setFont(micrFont)
    page.setFontSize(18)
    page.drawText('C' + check.CCHKNO + 'C', {x:103.4645669, y:height - 768.1889764})
    page.drawText('A021309379A',  {x:202.6771654, y:height - 768.1889764})
    page.drawText('615777015C',  {x:347.2440945, y:height - 768.1889764});

  }

  fs.writeFileSync('./output_v3.pdf', await doc.save());
  console.log("DONE");
}

createChecks().catch(err => console.log(err));
