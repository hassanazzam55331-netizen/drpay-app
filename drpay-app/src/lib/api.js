// API client for Dr. Pay system
const API_BASE = '/api';

// Fetch the service catalog
export async function fetchServiceCatalog() {
  const res = await fetch(`${API_BASE}/catalog`);
  if (!res.ok) throw new Error('Failed to fetch catalog');
  return res.json();
}

// Get account balance
export async function getBalance() {
  const res = await fetch(`${API_BASE}/balance`);
  if (!res.ok) throw new Error('Failed to get balance');
  return res.json();
}

// Perform inquiry
export async function performInquiry(serviceCode, fields) {
  const res = await fetch(`${API_BASE}/inquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ srv: serviceCode, ...fields }),
  });
  if (!res.ok) throw new Error('Inquiry failed');
  return res.json();
}

// Perform payment
export async function performPayment(serviceCode, fields, apiId) {
  const res = await fetch(`${API_BASE}/payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ srv: serviceCode, APIID: apiId, ...fields }),
  });
  if (!res.ok) throw new Error('Payment failed');
  return res.json();
}

// Check transaction status
export async function checkStatus(apiId) {
  const res = await fetch(`${API_BASE}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ APIID: apiId }),
  });
  if (!res.ok) throw new Error('Status check failed');
  return res.json();
}

// Login
export async function login(accessCode, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessCode, password }),
  });
  return res.json();
}

// Get daily report
export async function getDailyReport(date) {
  const res = await fetch(`${API_BASE}/daily?date=${date || ''}`);
  if (!res.ok) throw new Error('Failed to get report');
  return res.json();
}

// Generate unique transaction ID
export function generateAPIID() {
  const now = new Date();
  const ts = now.getFullYear().toString().slice(-2) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `DP${ts}${rand}`;
}
