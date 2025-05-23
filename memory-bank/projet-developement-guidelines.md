# ✅ Project Development Guidelines

These are the strict rules all development work must follow for this project. Read them carefully and follow them exactly.

---

## 🚦 Server & Runtime Behavior

* After making any changes, **ALWAYS start a new clean server instance** so I can test it.
* **Kill all previously running related servers** before starting a new one.

---

## 🔁 Code Reuse & Simplicity

* **Always prefer simple solutions** — avoid over-engineering.
* **Never create new code** if similar code already exists.
* **Iterate on existing patterns and components** whenever possible.
* **Follow the current project structure and naming conventions strictly** — do not introduce new folders, layers, or patterns unless explicitly requested.
* **Avoid duplicating logic or functionality** — check thoroughly for existing utilities/components.

---

## 🌐 Environment Awareness

* Ensure your code supports and respects all environments: `dev`, `test`, and `prod`.
* Never add mock or stubbed data logic outside of test files.
* Never overwrite or edit `.env` without explicit permission.

---

## 🔒 Safe & Controlled Changes

* Only modify code that is:

  * Explicitly requested
  * Clearly related to the task
  * Well understood in its impact
* **Never change unrelated parts of the app**.

---

## 🛠️ Fixes & Refactoring

* When fixing bugs:

  * First, exhaust all existing solutions and patterns
  * Only introduce new logic if absolutely necessary — and **remove the old one if you do**
* Avoid one-time scripts in main files — isolate them
* No file should exceed **200–300 lines** — split and refactor

---

## 📁 Clean Codebase

* Keep the codebase clean, readable, and organized
* Respect existing folder and file structures
* Match naming and styling conventions already in place

---

## 🧪 Testing

* Write thorough tests for any major logic or features
* Only use mocked or fake data in test files — never in live environments

---

## 📌 Summary

* Stick to current architecture, patterns, and structure
* Avoid introducing new patterns, tools, or workflows unless explicitly instructed
* Think about the broader system: what else might be affected by your changes?

If you are ever unsure: **stop and ask for clarification before continuing**.
