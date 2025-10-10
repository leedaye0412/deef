/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.deef.kr",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ["/api/*"],
};
