self.options = {
    "domain": "5gvci.com",
    "zoneId": 10949742
}
self.lary = ""
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw')

self.addEventListener("fetch", (event) => {
    // Dummy fetch handler to satisfy PWA install requirements
});
