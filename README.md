# 🚀 Playwright AI-Driven Automation Framework

## 🔧 Tech Stack

- Playwright (JavaScript)
- Page Object Model (POM)
- Data-Driven Testing (JSON)
- Dynamic Step Executor
- Simulated AI-based Test Generation

---

## 💡 Overview

This project is a modern automation framework built using Playwright with JavaScript. It follows a data-driven approach and introduces a dynamic step execution model where test steps are generated and executed based on input prompts.

The framework is designed to be scalable, reusable, and adaptable for real-world automation scenarios.

---

## ⚙️ Key Features

- Dynamic test execution using JSON-driven steps
- Reusable step executor supporting:
  - click
  - fill
  - select
  - assertions (visibility, text, URL, enabled, count)
- Simulated AI-based step generation (OpenAI-ready)
- Data-driven testing using external JSON files
- Dynamic test data generation (email, name, phone)
- Duplicate email validation using shared state
- Screenshot capture for debugging and validation
- Clean Page Object Model (POM) design

---

## 📂 Project Structure
playwright-automation/
│
├── pages/ # Page Object Model classes
├── tests/ # Test specifications
├── utils/ # Executor, AI generator, helpers
├── testData/ # JSON test data
├── README.md
├── package.json
├── playwright.config.ts
└── .gitignore

## ▶️ How to Run the Project

### 1. Install dependencies
npm install

### 2. Run all tests
npx playwright test

### 3. Run specific test
npx playwright test tests/login.spec.js --headed


---

## 📌 Test Scenarios Covered

### 🔐 Login Flow

- Login with valid credentials
- Login with invalid credentials
- Error validation

### 🧾 Registration Flow

- Register new user with dynamic data
- Validate duplicate email scenario
- End-to-end user creation

---

## 🧠 Framework Highlights

### 🔹 Dynamic Step Execution

Instead of hardcoding test steps, this framework executes steps dynamically using JSON instructions.

Example:

{
  "action": "fill",
  "target": "emailAddress",
  "value": "user@test.com"
}

🔹 Simulated AI Integration
Converts user prompts into test steps
Designed for OpenAI integration
Currently uses simulated logic for cost-efficient execution

🔹 Data-Driven Testing
Uses JSON files for test inputs
Supports multiple scenarios easily
Enhances scalability and maintainability

🔹 Dynamic Test Data
Generates unique email, name, and phone dynamically
Prevents duplicate conflicts
Improves test reliability


🔹 Shared State Handling
Stores generated email
Reuses it for duplicate validation
Mimics real-world behavior

🔮 Future Enhancements
OpenAI API integration for real AI step generation
API automation using Playwright request fixture
CI/CD integration (GitHub Actions / Jenkins)
Advanced reporting and dashboards
Parallel execution optimization

🎯 Key Takeaways
Demonstrates transition from Selenium to Playwright
Shows framework design and reusable architecture
Implements dynamic and scalable automation approach
Focuses on real-world test scenarios

👨‍💻 Author
Kadiyala Srisai
Built as part of upskilling journey from Selenium to Playwright automation with focus on modern testing practices and framework design.
