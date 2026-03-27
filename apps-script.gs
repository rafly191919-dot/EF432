/**
 * OPTIONAL BACKEND - Google Apps Script
 *
 * 1) Buka spreadsheet target.
 * 2) Extensions > Apps Script.
 * 3) Tempel file ini.
 * 4) Deploy > New deployment > Web app.
 * 5) Who has access: Anyone.
 * 6) Copy URL web app lalu isi ke APPS_SCRIPT_URL di app.js.
 *
 * Sheet yang dipakai:
 * - Transactions
 * - Suppliers
 */

function doGet(e) {
  const action = (e.parameter.action || '').toLowerCase();
  if (action === 'list') {
    return jsonOutput({
      transactions: readSheetData_('Transactions'),
      suppliers: readSheetData_('Suppliers')
    });
  }
  return jsonOutput({ ok: true, message: 'Use ?action=list' });
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || '{}');
  const action = (payload.action || '').toLowerCase();

  if (payload.suppliers && Array.isArray(payload.suppliers)) {
    writeSheetData_('Suppliers', payload.suppliers);
  }

  if (action === 'upsert' && payload.transaction) {
    const data = readSheetData_('Transactions');
    const idx = data.findIndex(row => row.id === payload.transaction.id);
    if (idx >= 0) data[idx] = payload.transaction;
    else data.unshift(payload.transaction);
    writeSheetData_('Transactions', data);
    return jsonOutput({ ok: true });
  }

  if (action === 'delete' && payload.transaction && payload.transaction.id) {
    const data = readSheetData_('Transactions').filter(row => row.id !== payload.transaction.id);
    writeSheetData_('Transactions', data);
    return jsonOutput({ ok: true });
  }

  return jsonOutput({ ok: false, message: 'Unknown action' });
}

function readSheetData_(sheetName) {
  const sh = getOrCreateSheet_(sheetName);
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).filter(row => row.join('') !== '').map(row => {
    const obj = {};
    headers.forEach((key, index) => obj[key] = row[index]);
    return obj;
  });
}

function writeSheetData_(sheetName, items) {
  const sh = getOrCreateSheet_(sheetName);
  sh.clearContents();

  const headers = sheetName === 'Suppliers'
    ? ['id', 'name', 'wa', 'active']
    : ['id', 'date', 'time', 'supplier', 'driver', 'plate', 'tenera', 'dura', 'total', 'percentTenera', 'percentDura', 'createdAt'];

  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (!items.length) return;

  const rows = items.map(item => headers.map(header => item[header] ?? ''));
  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function getOrCreateSheet_(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(sheetName);
  if (!sh) sh = ss.insertSheet(sheetName);
  return sh;
}

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
