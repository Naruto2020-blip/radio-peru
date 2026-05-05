#!/bin/bash
# ============================================================
# RADIO PERÚ - Script para compilar el APK de Android
# ============================================================
# Ejecuta este archivo desde la carpeta del proyecto:
#   bash BUILD_APK.sh
# ============================================================

echo "=== Radio Perú - Build APK ==="

# 1. Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js no está instalado."
  echo "Descárgalo en: https://nodejs.org"
  exit 1
fi

# 2. Instalar dependencias
echo ""
echo "→ Instalando dependencias..."
npm install

# 3. Instalar EAS CLI si no está
if ! command -v eas &> /dev/null; then
  echo ""
  echo "→ Instalando EAS CLI..."
  npm install -g eas-cli
fi

# 4. Iniciar sesión en Expo
echo ""
echo "→ Iniciando sesión en Expo..."
echo "   (Se abrirá el navegador para iniciar sesión)"
eas login

# 5. Compilar APK
echo ""
echo "→ Compilando APK para Android (esto tarda ~5-10 min en la nube)..."
eas build -p android --profile preview

echo ""
echo "✓ Listo! Cuando termine, EAS te dará un enlace para descargar el APK."
echo "  También puedes verlo en: https://expo.dev/accounts/oscar2026/projects/mobile/builds"
