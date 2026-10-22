/**
 * Central Domain Configuration & Ecosystem Directory
 * Root Domain: harshit107.online
 * FreelyEmail is the authoritative source for email routing and sender domains.
 */

const DOMAINS = Object.freeze({
  ROOT: "harshit107.online",

  // FreelyEmail Ecosystem (Email Source of Truth)
  EMAIL: Object.freeze({
    API: "https://freelyemail-api.harshit107.online",
    API_V1_EMAILS: "https://freelyemail-api.harshit107.online/api/v1/emails/",
    SHOWCASE_UI: "https://freelyemail.harshit107.online",
    LOGGER_API: "https://logger-api.harshit107.online",
    LOGGER_UI: "https://logger.harshit107.online",
    FROM_DOMAIN: "mail.harshit107.online",
    DEFAULT_FROM_EMAIL: "noreply@mail.harshit107.online",
    CONTACT_EMAIL: "contact@harshit107.online",
    SUPPORT_EMAIL: "support@harshit107.online",
  }),

  // OneLogin Single Sign-On & Identity Platform
  ONE_LOGIN: Object.freeze({
    API: "https://onelogin-api.harshit107.online",
    UI: "https://account.harshit107.online",
    COOKIE_DOMAIN: ".harshit107.online",
  }),

  // MyCloudMate Cloud Vault Platform
  CLOUD_MATE: Object.freeze({
    API: "https://mycloudmate.api.harshit107.online",
    UI: "https://mycloudmate.harshit107.online",
    APP_DOMAIN: "mycloudmate.harshit107.online",
  }),

  // TrimURL / LinkShorten Ecosystem
  LINK_SHORTEN: Object.freeze({
    API: "https://trimurl.online",
    UI: "https://trimurl.online",
    PRIMARY_DOMAIN: "trimurl.online",
    SHORTEN_SUBDOMAIN: "shorten.harshit107.online",
  }),

  // LinkNest Tool & Bookmarks Manager
  LINK_NEST: Object.freeze({
    API: "https://linknest-api.harshit107.online",
    UI: "https://linknest.harshit107.online",
  }),

  // Portfolio
  PORTFOLIO: Object.freeze({
    UI: "https://harshit107.online",
    EMAIL: "contact@harshit107.online",
  }),
});

module.exports = DOMAINS;
