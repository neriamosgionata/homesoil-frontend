import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';

const mockStorage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
    getItem: (key: string) => mockStorage[key] ?? null,
    setItem: (key: string, value: string) => { mockStorage[key] = value; },
    removeItem: (key: string) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
});

import { persistentWritable } from './persistant';

describe('persistentWritable', () => {
    beforeEach(() => {
        Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    });

    it('uses initial value when localStorage is empty', () => {
        const store = persistentWritable('test_key', { name: 'default' });
        expect(get(store)).toEqual({ name: 'default' });
    });

    it('reads from localStorage if value exists', () => {
        mockStorage['existing_key'] = JSON.stringify({ name: 'stored' });
        const store = persistentWritable('existing_key', { name: 'default' });
        expect(get(store)).toEqual({ name: 'stored' });
    });

    it('writes to localStorage on set', () => {
        const store = persistentWritable('write_key', 'initial');
        store.set('updated');
        expect(mockStorage['write_key']).toBe(JSON.stringify('updated'));
    });

    it('writes to localStorage on update', () => {
        const store = persistentWritable('update_key', 0);
        store.update(n => n + 1);
        expect(mockStorage['update_key']).toBe('1');
    });

    it('handles complex objects', () => {
        const store = persistentWritable('complex_key', { token: '', pin: undefined });
        store.set({ token: 'abc', pin: '123456' });
        const stored = JSON.parse(mockStorage['complex_key']);
        expect(stored.token).toBe('abc');
        expect(stored.pin).toBe('123456');
    });

    it('handles invalid JSON in localStorage gracefully', () => {
        mockStorage['bad_json'] = 'not valid json{{{';
        const store = persistentWritable('bad_json', 'fallback');
        expect(get(store)).toBe('fallback');
    });
});
