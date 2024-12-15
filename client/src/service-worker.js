import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

// Precache assets
precacheAndRoute(self.__WB_MANIFEST);

//api data to cache
const cacheConfigs = [
  {
    pathMatcher: ({ url }) => url.pathname === "/api/auth/user-meta-data",
    cacheName: "user-meta-data-cache",
    maxEntries: 5,
    maxAgeSeconds: 60 * 60 * 24, // 1 day
  },
  {
    pathMatcher: ({ url }) => url.pathname.startsWith("/api/flights"),
    cacheName: "flights-cache",
    maxEntries: 20,
    maxAgeSeconds: 60 * 60 * 6, // 6 hours
  },
  {
    pathMatcher: ({ url }) =>
      url.pathname.startsWith("/api/bookings/user-bookings"),
    cacheName: "users-booking",
    maxEntries: 20,
    maxAgeSeconds: 60 * 60 * 6, // 6 hours
  },
];

// Dynamically register routes
cacheConfigs.forEach(
  ({ pathMatcher, cacheName, maxEntries, maxAgeSeconds }) => {
    registerRoute(
      pathMatcher,
      new StaleWhileRevalidate({
        cacheName,
        plugins: [
          new CacheableResponsePlugin({
            // make sure only success api's data is cached
            statuses: [200], 
          }),
          new ExpirationPlugin({
            maxEntries,
            maxAgeSeconds,
          }),
        ],
      })
    );
  }
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", (event) => {
  self.skipWaiting(); // Optional: Forces immediate activation for testing
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    clients.claim() // Take control of open clients
  );
});
