# Mi Bodega

Maqueta responsive del catalogo de botellas basada en el diseno de referencia.

## Uso

```bash
npm install
npm run dev
```

Abrir `http://127.0.0.1:8131/`.

## APK

```bash
npm run build:apk
```

El APK debug se genera en:

`android/app/build/outputs/apk/debug/app-debug.apk`

En GitHub Actions el workflow se llama `botellero1` y publica el artefacto `botellero1-debug-apk`.

## Incluye

- Cabecera tipo app movil con marca `MI BODEGA`.
- Tarjeta de resumen con conteo de botellas por tipo.
- Listado de botellas con franja lateral, botella visual, precio, descripcion y fotos.
- Boton flotante para anadir nuevas botellas.
- Persistencia local en el navegador para las botellas creadas.
