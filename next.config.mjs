/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // as fontes do PDF são lidas do disco em tempo de execução — sem isto a
  // função da rota /api/curriculo sobe sem elas
  experimental: {
    outputFileTracingIncludes: {
      "/api/curriculo": ["./lib/pdf/fonts/*.ttf"],
    },
  },
  // o portfólio de desenvolvimento saiu do site — links antigos vão pro acervo
  async redirects() {
    return [{ source: "/sistemas", destination: "/database", permanent: false }];
  },
};

export default nextConfig;
