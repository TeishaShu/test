import { Button, message, notification } from 'antd';
import React from 'react';
import defaultSettings from '../config/defaultSettings';

const { pwa } = defaultSettings; // if pwa is true

if (pwa) {
  // Notify user if offline now
  window.addEventListener('sw.offline', () => {
    message.warning('当前处于离线状态');
  }); // Pop up a prompt on the page asking the user if they want to use the latest version

  window.addEventListener('sw.updated', (event) => {
    const e = event;

    const reloadSW = async () => {
      // Check if there is sw whose state is waiting in ServiceWorkerRegistration
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;

      if (!worker) {
        return true;
      } // Send skip-waiting event to waiting SW with MessageChannel

      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = (msgEvent) => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };

        worker.postMessage(
          {
            type: 'skip-waiting',
          },
          [channel.port2],
        );
      }); // Refresh current page to use the updated HTML and other assets after SW has skiped waiting

      window.location.reload(true);
      return true;
    };

    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.close(key);
          reloadSW();
        }}
      >
        刷新
      </Button>
    );
    notification.open({
      message: '有新内容',
      description: '请点击“刷新”按钮或者手动刷新页面',
      btn,
      key,
      onClose: async () => { },
    });
  });
} else if ('serviceWorker' in navigator) {
  // unregister service worker
  const { serviceWorker } = navigator;

  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then((sws) => {
      sws.forEach((sw) => {
        sw.unregister();
      });
    });
  }

  serviceWorker.getRegistration().then((sw) => {
    if (sw) sw.unregister();
  }); // remove all caches

  if (window.caches && window.caches.keys) {
    caches.keys().then((keys) => {
      keys.forEach((key) => {
        caches.delete(key);
      });
    });
  }
}
