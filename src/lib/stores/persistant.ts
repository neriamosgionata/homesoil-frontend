import {writable, type Writable} from 'svelte/store';
import 'node-localstorage/register';
import SLS from "secure-ls";

const ls = new SLS({
    encodingType: 'aes',
    isCompression: false,
    encryptionSecret: '32871903bhn2k,gyc8soia783t2yhu1jklbgdyhl^#&*@^!&#*@'
});

const initializeStore = <T>(key: string, initialValue: T): T => {
    if (typeof window !== 'undefined') {
        const storedValue = ls.get(key);
        return storedValue ? JSON.parse(storedValue) : initialValue;
    } else {
        return initialValue;
    }
};

const saveToLocalStorage = <T>(key: string, value: T): void => {
    if (typeof window !== 'undefined') {
        ls.set(key, JSON.stringify(value));
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