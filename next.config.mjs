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
  // o site agora é uma página só (o modelo é darioamodei.com): as páginas
  // antigas levam ao início, e o portfólio de desenvolvimento saiu do ar
  async redirects() {
    return ["/sobre", "/contato", "/database", "/sistemas"].map((source) => ({
      source,
      destination: "/",
      permanent: false,
    }));
  },
};

export default nextConfig;
