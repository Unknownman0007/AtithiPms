import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const matchingShortcut = shortcuts.find(shortcut => {
        return (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !!event.ctrlKey === !!shortcut.ctrlKey &&
          !!event.altKey === !!shortcut.altKey &&
          !!event.shiftKey === !!shortcut.shiftKey
        );
      });

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

export const globalShortcuts = [
  { key: 'h', ctrlKey: true, description: 'Go to Dashboard' },
  { key: 'r', ctrlKey: true, description: 'Go to Reservations' },
  { key: 'g', ctrlKey: true, description: 'Go to Guests' },
  { key: 'm', ctrlKey: true, description: 'Go to Rooms' },
  { key: 's', ctrlKey: true, description: 'Go to Settings' },
  { key: 'n', ctrlKey: true, description: 'New Reservation' },
  { key: 'f', ctrlKey: true, description: 'Search/Find' },
  { key: '/', description: 'Show Keyboard Shortcuts' },
];