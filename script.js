/* ============================================================
   Unit Converter - script.js
   Length & weight conversion using a base-unit approach.
   ============================================================ */

// --- Configuration: conversion factors to a base unit ----------
// Length base unit: meters (m). Weight base unit: kilograms (kg).
const CATEGORIES = {
  length: {
    base: "m",
    defaultFrom: "m",
    defaultTo: "ft",
    defaultValue: "10",
    units: {
      mm: { name: "Millimeters", symbol: "mm", factor: 0.001 },
      cm: { name: "Centimeters", symbol: "cm", factor: 0.01 },
      m:  { name: "Meters",       symbol: "m",  factor: 1 },
      km: { name: "Kilometers",   symbol: "km", factor: 1000 },
      in: { name: "Inches",       symbol: "in", factor: 0.0254 },
      ft: { name: "Feet",         symbol: "ft", factor: 0.3048 },
      yd: { name: "Yards",        symbol: "yd", factor: 0.9144 },
      mi: { name: "Miles",        symbol: "mi", factor: 1609.344 }
    }
  },
  weight: {
    base: "kg",
    defaultFrom: "kg",
    defaultTo: "lb",
    defaultValue: "1",
    units: {
      mg: { name: "Milligrams",  symbol: "mg", factor: 0.000001 },
      g:  { name: "Grams",       symbol: "g",  factor: 0.001 },
      kg: { name: "Kilograms",   symbol: "kg", factor: 1 },
      t:  { name: "Metric Tons", symbol: "t",  factor: 1000 },
      oz: { name: "Ounces",      symbol: "oz", factor: 0.028349523125 },
      lb: { name: "Pounds",      symbol: "lb", factor: 0.45359237 },
      st: { name: "Stones",      symbol: "st", factor: 6.35029318 }
    }
  }
};

// --- DOM references --------------------------------------------
const tabLength = document.getElementById("tabLength");
const tabWeight = document.getElementById("tabWeight");
const valueInput = document.getElementById("valueInput");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const swapBtn = document.getElementById("swapBtn");
const resetBtn = document.getElementById("resetBtn");
const resultText = document.getElementById("resultText");
const status = document.getElementById("status");

// --- State -----------------------------------------------------
let currentCategory = "length";

// --- Helpers ---------------------------------------------------
function populateUnits(category) {
  const units = CATEGORIES[category].units;
  const from = fromUnit;
  const to = toUnit;
  from.innerHTML = "";
  to.innerHTML = "";
  Object.keys(units).forEach((key) => {
    const u = units[key];
    const optFrom = document.createElement("option");
    optFrom.value = key;
    optFrom.textContent = `${u.name} (${u.symbol})`;
    from.appendChild(optFrom);

    const optTo = document.createElement("option");
    optTo.value = key;
    optTo.textContent = `${u.name} (${u.symbol})`;
    to.appendChild(optTo);
  });
}

function formatNumber(n) {
  if (!isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs === 0) return "0";
  // Use exponential notation for very large / very small magnitudes.
  if (abs >= 1e15 || abs < 1e-6) {
    return n.toExponential(6);
  }
  let s = n.toFixed(6);
  if (s.indexOf(".") !== -1) {
    s = s.replace(/\.?0+$/, "");
  }
  if (s === "-0") s = "0";
  return s;
}

function unitName(category, key) {
  return CATEGORIES[category].units[key].name;
}

function unitSymbol(category, key) {
  return CATEGORIES[category].units[key].symbol;
}

function convert(value, category, fromKey, toKey) {
  const units = CATEGORIES[category].units;
  const baseValue = value * units[fromKey].factor; // to base unit
  return baseValue / units[toKey].factor;          // from base to target
}

function updateResult() {
  const raw = valueInput.value.trim();
  if (raw === "") {
    resultText.textContent = "—";
    status.textContent = "Enter a value to convert.";
    return;
  }
  const value = Number(raw);
  if (!isFinite(value) || raw === "") {
    resultText.textContent = "—";
    status.textContent = "Please enter a valid number.";
    return;
  }
  // Guard against non-numeric strings that Number() may accept as NaN already handled.
  if (Number.isNaN(value)) {
    resultText.textContent = "—";
    status.textContent = "Please enter a valid number.";
    return;
  }

  const fromKey = fromUnit.value;
  const toKey = toUnit.value;
  const result = convert(value, currentCategory, fromKey, toKey);

  if (!isFinite(result)) {
    resultText.textContent = "—";
    status.textContent = "Result is too large to display.";
    return;
  }

  const fromLabel = unitName(currentCategory, fromKey);
  const toLabel = unitName(currentCategory, toKey);
  resultText.textContent = `${formatNumber(value)} ${fromLabel} = ${formatNumber(result)} ${toLabel}`;
  status.textContent = "";
}

function setCategory(category) {
  currentCategory = category;
  // Update tabs
  const isLength = category === "length";
  tabLength.classList.toggle("is-active", isLength);
  tabWeight.classList.toggle("is-active", !isLength);
  tabLength.setAttribute("aria-selected", String(isLength));
  tabWeight.setAttribute("aria-selected", String(!isLength));

  populateUnits(category);
  const cfg = CATEGORIES[category];
  fromUnit.value = cfg.defaultFrom;
  toUnit.value = cfg.defaultTo;
  valueInput.value = cfg.defaultValue;
  updateResult();
}

function swapUnits() {
  const tmp = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = tmp;
  updateResult();
}

function resetState() {
  setCategory("length");
}

// --- Event listeners -------------------------------------------
tabLength.addEventListener("click", () => setCategory("length"));
tabWeight.addEventListener("click", () => setCategory("weight"));

valueInput.addEventListener("input", updateResult);
fromUnit.addEventListener("change", updateResult);
toUnit.addEventListener("change", updateResult);
swapBtn.addEventListener("click", swapUnits);
resetBtn.addEventListener("click", resetState);

// --- Init ------------------------------------------------------
setCategory("length");
