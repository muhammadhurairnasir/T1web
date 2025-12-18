# BESAFARI - E-commerce Website

Express.js application with MongoDB for product management.

## Project Structure

This project is divided into two separate folders:

### 📁 Lab Task 3 (`lab-task-3/`)
**Basic Express.js with EJS templates (NO MongoDB)**
- Convert HTML/CSS to Express.js
- EJS template system
- Routes and views
- Partials

**Port:** 3000

### 📁 Assignment 3 (`assignment-3/`)
**Full app with MongoDB integration**
- Everything from Lab Task 3 PLUS:
- MongoDB connection
- Product model
- Pagination
- Filtering (category, price)
- Sample data

**Port:** 3001

## Quick Start

### Lab Task 3
```bash
cd lab-task-3
npm install
npm run dev
```
Open `http://localhost:3000`

### Assignment 3
```bash
cd assignment-3
npm install
# Create .env file with MONGO_URI
npm run seed
npm run dev
```
Open `http://localhost:3001`

## Requirements

- Node.js (v14+)
- MongoDB (for Assignment 3 only)

See individual README files in each folder for detailed instructions.
