// public/service-worker.js
self.addEventListener('push', function (event) {
  const data = event.data?.json() || {};
  const title = data.title || "New Message";
  const options = {
    body: data.body || "You have a new message",
    icon: '/icon.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
