// Unregister service worker to force fresh content
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
    console.log('Service worker unregistered - refreshing...');
    window.location.reload();
  });
}

export {};
