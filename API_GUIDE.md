# FireOps CRM — API Integration Guide

## Overview

The CRM uses a simple API layer. Every data fetch goes through:

```js
async function fetchData(endpoint, mockData) {
  if (!API_BASE) return mockData;  // ← mock mode when no API_BASE set
  const res = await fetch(`${API_BASE}${endpoint}`);
  return await res.json();
}
```

Set `API_BASE` in `FirefighterCRM.jsx` to your backend URL to go live.

---

## FREE Options (Recommended)

### Option 1 — Google Sheets API (FREE, no backend needed)
Best if your data stays in the Google Sheets you already have.

**Steps:**
1. Go to https://console.cloud.google.com → Create project → Enable "Google Sheets API"
2. Create credentials → API Key (for read-only) or OAuth2 (for read/write)
3. Make your sheet public (read-only) or use OAuth for private access

**URL format:**
```
https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{SHEET}!A1:Z1000?key={API_KEY}
```

**Example — fetch Database sheet:**
```js
const SHEET_ID = "1G3PFoAUELiKiDIqEFYfJkF0O3fs4X9WlxStodPMVfuA";
const API_KEY  = "YOUR_GOOGLE_API_KEY";

async function fetchEmployees() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Database!A2:M500?key=${API_KEY}`;
  const res  = await fetch(url);
  const json = await res.json();
  const rows = json.values || [];
  return rows.map(r => ({
    platoon:  r[0], station: r[1], machine: r[2],
    empId:    r[3], name:    r[4], rank:    r[5],
    status:   r[6], date:    r[7],
  }));
}
```

**Required endpoints to build:**
| CRM Page      | Sheet to read               | Columns          |
|---------------|-----------------------------|------------------|
| Employees     | `Employees Master Sheet`    | A–H              |
| Workforce     | `Database`                  | A–M              |
| Leave         | `Leave Records`             | A–P (col 16 = status) |
| Payroll       | `PayRoll`                   | A–P              |
| Timesheets    | `TimeSheetData`             | A–J              |
| DET           | `DET Records`               | A–I              |

---

### Option 2 — Google Apps Script Web App (FREE)
Turn your existing Apps Script into a REST API.

**Steps:**
1. In your Google Sheet → Extensions → Apps Script
2. Add this function:

```js
function doGet(e) {
  const action = e.parameter.action;
  const ss = SpreadsheetApp.openById("YOUR_SHEET_ID");
  
  if (action === "employees") {
    const data = ss.getSheetByName("Employees Master Sheet")
                   .getDataRange().getValues();
    return ContentService.createTextOutput(JSON.stringify(data))
                         .setMimeType(ContentService.MimeType.JSON);
  }
  // add more actions: "leave", "payroll", "database", etc.
}
```

3. Deploy → New Deployment → Web App → "Anyone" access
4. Copy the Web App URL — that becomes your `API_BASE`

**Example call from CRM:**
```js
const API_BASE = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
// Then: fetch(`${API_BASE}?action=employees`)
```

---

### Option 3 — Supabase (FREE tier, PostgreSQL backend)
Best if you want a proper database with real-time updates.

1. Sign up at https://supabase.com (free forever tier)
2. Create tables: `employees`, `leave_records`, `payroll`, `workforce`
3. Import your Excel data via CSV upload
4. Use Supabase JS client:

```js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("YOUR_SUPABASE_URL", "YOUR_ANON_KEY");

// In fetchData:
const { data } = await supabase.from("employees").select("*");
```

---

### Option 4 — JSONBin.io (FREE, simplest)
For small read-only datasets. Store your JSON data as a "bin".

```js
const API_BASE = "https://api.jsonbin.io/v3/b";
const BIN_ID   = "YOUR_BIN_ID";
const API_KEY  = "$2a$..."; // free API key

const res = await fetch(`${API_BASE}/${BIN_ID}/latest`, {
  headers: { "X-Master-Key": API_KEY }
});
const json = await res.json();
const data = json.record;
```

---

## Expected API Response Format

Each endpoint should return JSON in this shape:

### GET /employees
```json
[
  { "id": 45798, "name": "Jess A. Soldani", "rank": "FF", "platoon": "A",
    "station": "Station 12", "machine": "E118", "email": "...", "status": "Active" }
]
```

### GET /leave
```json
[
  { "id": 1, "empId": 45798, "empName": "Jess A. Soldani", "type": "AL",
    "leaveDate": "2025-10-04", "endDate": "2025-10-04",
    "startTime": "07:00", "endTime": "08:30", "station": "St. 12",
    "platoon": "A", "status": "Approved" }
]
```

### GET /payroll
```json
[
  { "platoon": "B", "station": "St. 11", "rank": "Capt", "empName": "T. Schultz",
    "worked": 17.0, "actingPos": "—", "actingHrs": 0,
    "leaveType": "AL", "leaveHrs": 3.5, "date": "Jan 12" }
]
```

### GET /workforce
```json
[
  { "name": "Station 11", "machine": "E118",
    "assigned": 8, "onDuty": 6, "det": 1, "mwa": 0, "ot": 1 }
]
```

### GET /timesheets?empId=45798&endDate=2026-01-11
```json
[
  { "dateIn": "Dec 29", "dateOut": "Dec 30", "timeIn": "7:00 AM",
    "timeOut": "7:00 AM", "hours": 24.0, "type": "" }
]
```

---

## Quick Start (Recommended Path)

1. **Right now** → The CRM runs on mock data. No setup needed.
2. **Next step** → Use Option 2 (Apps Script Web App) since you already have the Apps Script code written.
3. **Long term** → Migrate to Option 3 (Supabase) for real-time updates and write operations.

---

## Write Operations (POST/PUT)

For approving leave, creating payroll entries, etc., you'll need a write-capable backend.

With Apps Script:
```js
function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const action  = payload.action;
  
  if (action === "approve_leave") {
    const sheet = SpreadsheetApp.openById("...").getSheetByName("Leave Records");
    // find row by empId + date and update status column
    sheet.getRange(payload.row, 16).setValue("Approved");
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
```

From CRM:
```js
await fetch(`${API_BASE}`, {
  method: "POST",
  body: JSON.stringify({ action: "approve_leave", row: 42 })
});
```
