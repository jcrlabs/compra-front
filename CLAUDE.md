# CLAUDE.md — compra-front

> Dominio prod: compra.jcrlabs.net | test: compra-test.jcrlabs.net
> Namespace K8s: compra
> Mobile: APK via Capacitor shell (appId: net.jcrlabs.compra)

## CI local

Ejecutar **antes de cada commit**:

```bash
npm ci
npx tsc --noEmit
npm run lint
npm run build
```

## Git

- Ramas: `feature/`, `bugfix/`, `hotfix/`, `release/`
- Commits: convencional (`feat:`, `fix:`, `chore:`, etc.)
