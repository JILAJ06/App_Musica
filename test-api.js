/**
 * 🧪 Script de Verificación de API de Spotify
 * 
 * Cómo usar:
 * 1. Abre la consola del navegador (F12)
 * 2. Copia y pega este código
 * 3. Presiona Enter
 * 4. Verás un reporte completo del estado de la API
 */

(function testSpotifyAPI() {
  console.log('🧪 Iniciando pruebas de API de Spotify...\n');
  
  // Test 1: Verificar que existe el servicio
  console.log('📋 Test 1: Verificando servicios Angular...');
  try {
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      console.log('✅ App Angular detectada');
    } else {
      console.log('❌ No se detectó la app Angular');
    }
  } catch (e) {
    console.log('❌ Error verificando app:', e.message);
  }
  
  // Test 2: Verificar peticiones de red
  console.log('\n📋 Test 2: Verificar peticiones de red...');
  console.log('👉 Abre la pestaña Network y haz una búsqueda');
  console.log('   Deberías ver:');
  console.log('   - POST https://accounts.spotify.com/api/token');
  console.log('   - GET https://api.spotify.com/v1/search');
  
  // Test 3: Información de configuración
  console.log('\n📋 Test 3: Configuración esperada...');
  console.log('Client ID debe empezar con: 794acf82...');
  console.log('API URL: https://api.spotify.com/v1');
  
  // Test 4: Guía de errores comunes
  console.log('\n📋 Test 4: Errores comunes y soluciones...');
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│ Error 401: Verifica credenciales en environment.ts     │');
  console.log('│ Error 429: Espera 30 segundos (demasiadas peticiones) │');
  console.log('│ Error CORS: Normal, ignóralo (debería funcionar igual) │');
  console.log('│ No hay resultados: Espera a ver "API Conectada"        │');
  console.log('└─────────────────────────────────────────────────────────┘');
  
  // Test 5: Instrucciones de prueba
  console.log('\n📋 Test 5: Pruebas recomendadas...');
  console.log('1. Haz clic en "Buscar"');
  console.log('2. Verifica el indicador verde "API Conectada"');
  console.log('3. Busca: "Imagine Dragons"');
  console.log('4. Deberías ver ~20 resultados con imágenes');
  console.log('5. Haz clic en cualquier canción');
  console.log('6. La canción debe aparecer en el panel principal');
  
  // Resumen
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Verificación completada!');
  console.log('📝 Ahora prueba hacer una búsqueda y verifica:');
  console.log('   ✓ Mensaje "Token obtenido correctamente"');
  console.log('   ✓ Indicador verde "API Conectada"');
  console.log('   ✓ Resultados de búsqueda aparecen');
  console.log('   ✓ Status 200 en Network tab');
  console.log('='.repeat(60));
  
  // Tips adicionales
  console.log('\n💡 Tips adicionales:');
  console.log('- Si no funciona, recarga la página (Ctrl+F5)');
  console.log('- Verifica que el servidor esté corriendo (npm start)');
  console.log('- Lee GUIA_PRUEBAS.md para más información');
  
})();

// Función helper para probar búsqueda manual
console.log('\n💡 Para probar manualmente una búsqueda, espera a que cargue');
console.log('   la app y luego usa el campo de búsqueda visual.');
