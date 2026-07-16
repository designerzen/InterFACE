# Netronome Bundler Compatibility Fix

## Problem

Netronome's compiled ESM build uses hardcoded string URLs for Web Workers:

```javascript
new Worker("/timing.audiocontext.worker-HASH.js")
```

This pattern **does not work** with Parcel and other bundlers because:
- Parcel needs to understand which files are workers
- The `import.meta.url` pattern allows bundlers to properly resolve worker modules
- String literals prevent bundler static analysis

## Solution

The `fix-netronome.mjs` script patches the compiled netronome distribution to use the universal `import.meta.url` pattern:

```javascript
new Worker(new URL("./timing.audiocontext.worker.js", import.meta.url))
```

This pattern works with **all** modern bundlers (Webpack, Vite, Parcel, Rollup, esbuild, etc.).

## How It Works

1. **Automatic fix on install**: The `postinstall` hook in `package.json` runs `fix-netronome.mjs` after npm installs
2. **Replaces pattern**: Converts hardcoded paths to dynamic `import.meta.url` references
3. **Preserves functionality**: All netronome features work identically

## Files

- `fix-netronome.mjs` - Node script that patches netronome's dist files
- `package.json` - Added `postinstall` hook to run the fix automatically

## When to Run Manually

If you need to re-apply the patch after reinstalling netronome:

```bash
node fix-netronome.mjs
```

## Upstream Fix

This is a workaround until netronome's source code (https://github.com/designerzen/netronome) is updated to use dynamic imports in its compilation process. The fix should be made in the Vite config to output bundler-compatible worker imports.

Recommended upstream changes to `vite.lib.config.ts`:
- Use dynamic `import('./workers/...')` instead of `?worker` syntax
- Or configure Vite to output proper URL constructor calls for all bundlers
