/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://velosta.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/404"],
  robotsTxtOptions: {
    additionalSitemaps: ["https://velosta.com/sitemap.xml"],
  },
};
