import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Fonction pour obtenir la valeur initiale du localStorage
  const getStoredValue = () => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      // Si aucune valeur n'existe, on stocke la valeur initiale
      localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    } catch (error) {
      console.error(`Erreur lors de la lecture de ${key}:`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Fonction pour mettre à jour la valeur
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
      // Déclencher un événement personnalisé pour la synchronisation
      window.dispatchEvent(new CustomEvent('storage-update', {
        detail: { key, value: valueToStore }
      }));
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de ${key}:`, error);
    }
  };

  // Écouter les changements de localStorage dans d'autres onglets
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    // Écouter les changements locaux
    const handleLocalChange = (e: CustomEvent) => {
      if (e.detail.key === key && e.detail.value !== storedValue) {
        setStoredValue(e.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage-update', handleLocalChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage-update', handleLocalChange as EventListener);
    };
  }, [key]);

  return [storedValue, setValue] as const;
}
