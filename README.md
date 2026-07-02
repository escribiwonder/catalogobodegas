# Bodega Baco

MVP responsive del catalogo de botellas de una bodega, basado en el diseno movil de referencia y preparado para generar APK con GitHub Actions.

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

- Cabecera tipo app movil con marca `BODEGA BACO`.
- Menu lateral funcional con filtros por tipo de vino.
- Busqueda desplegable por nombre, tipo, uva, anada o descripcion.
- Tarjeta de resumen con conteo de botellas por tipo.
- Tres botellas iniciales de una misma bodega: Baco Tempranillo, Baco Airen y Baco Garnacha Rose.
- Listado de botellas con franja lateral, fotos realistas, precio, uva, descripcion y fotos.
- Ficha individual al tocar cada botella, con descripcion, cata, servicio y maridaje.
- Boton flotante para anadir nuevas botellas, limitado a un maximo de 10 referencias.
- Persistencia local en el navegador para las botellas creadas.
