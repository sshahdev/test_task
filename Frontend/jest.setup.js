require('@testing-library/jest-dom');

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: function mockMatchMedia() {
    return {
      matches: false,
      media: '',
      onchange: null,
      addListener: function() {},
      removeListener: function() {},
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() {},
    };
  },
}); 