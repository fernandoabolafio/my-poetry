#!/usr/bin/env node

const { exec } = require("child_process");

console.log("Generating database schema...");
exec('npx prisma generate')