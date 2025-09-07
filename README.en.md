
---

### 📄 `README.en.md` (English)

```markdown
# MMM

[Русская версия](./README.md)

## Project description
MMM is an open-source application for tracking cryptocurrency transactions, managing portfolios, and analyzing market data.  
It includes frontend, backend, and a desktop wrapper with Electron, plus integrations with external APIs.

---

## Table of contents
- [Frontend](#frontend)
- [Backend](#backend)
- [Electron](#electron)
- [API](#api)
- [Features](#features)
  - [Transaction & Portfolio Tracking](#transaction--portfolio-tracking)
  - [Market Data](#market-data)
  - [Import & Export](#import--export)
- [Installation](#installation)

---

## Frontend
**Description:**  
Interacts with backend and APIs, runs locally in Electron or in a browser.

**Stack:**
- Vue 3 `v3.5.13`
- Vue-router `v4.5.1`
- Vite `v6.3.5`
- Pinia `v3.0.3`
- Vue-chartjs `v5.3.2`
- i18n `v11.1.11`
- Other dependencies — see `package.json`

---

## Backend
**Description:**  
CRUD API for DB and external integrations.  
Can run standalone or inside Electron.

**Stack:**
- Nest.js `v11.0.1`
- Prisma `v6.10.1`
- SQLite3 `v5.1.7`
- Fast-csv `v5.0.2`
- Other dependencies — see `package.json`

---

## Electron
**Description:**  
Electron wraps the application, runs backend as a process and frontend on localhost.

**Stack:**
- Electron `v37.2.6`
- Electron-builder `v26.0.12`

---

## API
- **CoinGecko API** — market data, prices, coin identifiers.  
- **Alternative.me API** — Fear & Greed Index.

---

## Features

### Transaction & Portfolio Tracking
- Add, edit and delete transactions.  
- Filtering by portfolio, ASC/DESC sorting.  
- Dynamic dashboards with charts.  

### Market Data
- Searchable and sortable table.  
- Fields: price, market cap, 24h high/low, % change.  
- Sync time ~20 min (API rate-limits).  

### Import & Export
- Exported to `exports` folder.  
- Import appends new records without removing old ones.  

---

## Installation
```bash
git clone https://github.com/your-org/mmm.git
cd mmm
npm install
npm run dev
npm run build