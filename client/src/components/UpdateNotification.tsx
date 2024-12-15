import { useEffect, useState } from 'react';
import '../styles.css';

const UpdateNotification = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    let newWorker:any;

    const onNewServiceWorker = (registration:any, callback:any) => {
      if (registration.waiting) {
        callback();
        return;
      }

      const onInstalled = () => {
        registration.installing.addEventListener('statechange', () => {
          if (registration.waiting) {
            callback();
          }
        });
      };

      if (registration.installing) {
        onInstalled();
      }

      registration.addEventListener('updatefound', onInstalled);
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        onNewServiceWorker(registration, () => {
          newWorker = registration.waiting;
          setUpdateAvailable(true);
        });
      });
    }

    return () => {
      if (newWorker) {
        newWorker.removeEventListener('statechange', () => {});
      }
    };
  }, []);

  const refreshPage = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
    setUpdateAvailable(false);
    window.location.reload();
  };

  return (
    updateAvailable && (
      <div className="update-notification">
        <p>New content is available! Refresh to update?</p>
        <button onClick={refreshPage}>Refresh</button>
      </div>
    )
  );
};

export default UpdateNotification;