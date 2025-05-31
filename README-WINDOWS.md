# Windows Setup Guide for Harvest Direct

This project uses ESM modules which can cause issues on Windows. Here are reliable ways to run the project:

## Quick Start Options

### Option 1: Use the Windows Batch File (Recommended)
```bash
start-windows.bat
```

### Option 2: Use Node.js directly
```bash
node start.js
```

### Option 3: Use tsx with proper flags
```bash
npx tsx server/index.ts
```

### Option 4: Manual Node.js execution
```bash
set NODE_ENV=development
set NODE_OPTIONS=--import tsx/esm
node server/index.ts
```

## Troubleshooting

If you get `ERR_UNSUPPORTED_ESM_URL_SCHEME` error:

1. **Check Node.js version**: Ensure you have Node.js 18+ or 20+
   ```bash
   node --version
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Try the tsx method**:
   ```bash
   npx tsx --version
   npx tsx server/index.ts
   ```

4. **Use the Windows-specific startup**:
   - Double-click `start-windows.bat`
   - Or run: `start-windows.bat` from command prompt

## For Deployment

When deploying to production or other environments:
- The build process will handle ESM properly
- Use `npm run build` then `npm start`
- The built files don't have the Windows ESM issue

## Environment Variables

Make sure these are set:
- `NODE_ENV=development` (for development)
- `DATABASE_URL` (should be automatically set in Replit)

## Common Issues

1. **"tsx must be loaded with --import instead of --loader"**
   - This is a Node.js 20+ requirement
   - Use the provided startup scripts which handle this

2. **Windows drive letter issues (d:, c:, etc.)**
   - The startup scripts resolve paths properly
   - Always use the provided startup methods

3. **Module resolution errors**
   - Ensure you're in the project root directory
   - Check that `package.json` has `"type": "module"`