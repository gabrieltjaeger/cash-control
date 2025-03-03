export function useLocalStorage() {
  const setInLocalStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };
  const getFromLocalStorage = (key: string) => {
    return localStorage.getItem(key);
  };
  return { setInLocalStorage, getFromLocalStorage };
}
