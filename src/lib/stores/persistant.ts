import {writable, type Writable} from 'svelte/store';

const initializeStore = <T>(key: string, initialValue: T): T => {
    if (typeof window !== 'undefined') {
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : initialValue;
        } catch {
            return initialValue;
        }
    } else {
        return initialValue;
    }
};

const saveToLocalStorage = <T>(key: string, value: T): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

const persistentWritable = <T>(key: string, initialValue: T): Writable<T> => {
    const store: Writable<T> = writable(initializeStore(key, initialValue));

    store.subscribe((value: any) => {
        saveToLocalStorage(key, value);
    });

    return store;
};

export {persistentWritable};
