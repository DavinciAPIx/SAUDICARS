import { useEffect, useState, useRef } from 'react';
import { useColorScheme as _useColorScheme } from 'react-native';

// The useColorScheme value is always either light or dark, but the built-in
// type suggests that it can be null. This will not happen in practice, so this
// makes it a bit easier to work with.
export function useColorScheme(): NonNullable<ReturnType<typeof _useColorScheme>> {
  const [colorScheme, setColorScheme] = useState<NonNullable<ReturnType<typeof _useColorScheme>>>('light');
  const deviceColorScheme = _useColorScheme() as NonNullable<ReturnType<typeof _useColorScheme>>;
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (isMountedRef.current) {
      setColorScheme(deviceColorScheme ?? 'light');
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [deviceColorScheme]);

  return colorScheme;
}

export { useColorScheme }