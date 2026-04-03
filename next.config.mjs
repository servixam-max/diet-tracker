/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow dev access from local/Tailscale hosts
  allowedDevOrigins: ['localhost', '127.0.0.1', '100.126.164.101', '*.ts.net'],
  
  // Enable static exports for PWA
  output: 'standalone',
  
  // Asegurar que los estáticos se sirvan correctamente
  assetPrefix: '/',
  
  // Optimizar para producción
  productionBrowserSourceMaps: false,
  
  // Configurar rutas dinámicas que usan autenticación
  experimental: {
    // Permitir rutas dinámicas en build estático
    // isrMemoryCacheSize: 0, // Removido - no es válido en Next.js 14
  },
};

export default nextConfig;