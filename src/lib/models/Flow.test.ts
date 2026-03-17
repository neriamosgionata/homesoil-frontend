import { describe, it, expect } from 'vitest';
import type Flow from './Flow';

describe('Flow model', () => {
    it('can create a flow object matching the interface', () => {
        const flow: Flow = {
            id: 1,
            title: 'Temperature Control',
            graph: JSON.stringify({
                nodes: [
                    { id: 's1', type: 'sensor_input', data: { sensor_id: 1 }, position: { x: 100, y: 200 } },
                    { id: 'c1', type: 'constant', data: { value: 30 }, position: { x: 300, y: 200 } },
                    { id: 'cmp1', type: 'comparison', data: { operator: '>' }, position: { x: 500, y: 200 } },
                    { id: 'a1', type: 'actuator_output', data: { actuator_id: 5, pulse: false }, position: { x: 700, y: 200 } },
                ],
                edges: [
                    { id: 'e1', source: 's1', sourceHandle: 'value', target: 'cmp1', targetHandle: 'a' },
                    { id: 'e2', source: 'c1', sourceHandle: 'output', target: 'cmp1', targetHandle: 'b' },
                    { id: 'e3', source: 'cmp1', sourceHandle: 'output', target: 'a1', targetHandle: 'trigger' },
                ],
            }),
            enabled: true,
            created_at: '2026-03-17T10:00:00',
            updated_at: null,
        };

        expect(flow.id).toBe(1);
        expect(flow.title).toBe('Temperature Control');
        expect(flow.enabled).toBe(true);

        const graph = JSON.parse(flow.graph);
        expect(graph.nodes).toHaveLength(4);
        expect(graph.edges).toHaveLength(3);
    });

    it('graph can be parsed as FlowGraph structure', () => {
        const flow: Flow = {
            id: 1,
            title: 'Test',
            graph: '{"nodes":[],"edges":[]}',
            enabled: false,
            created_at: '',
            updated_at: undefined,
        };

        const graph = JSON.parse(flow.graph);
        expect(graph.nodes).toEqual([]);
        expect(graph.edges).toEqual([]);
    });

    it('handles null and undefined updated_at', () => {
        const flowNull: Flow = { id: 1, title: '', graph: '{}', enabled: false, created_at: '', updated_at: null };
        const flowUndef: Flow = { id: 2, title: '', graph: '{}', enabled: false, created_at: '', updated_at: undefined };

        expect(flowNull.updated_at).toBeNull();
        expect(flowUndef.updated_at).toBeUndefined();
    });

    it('node types are correctly typed in graph JSON', () => {
        const nodeTypes = ['sensor_input', 'actuator_output', 'comparison', 'logic_gate', 'constant'];

        const nodes = nodeTypes.map((type, i) => ({
            id: `n${i}`,
            type,
            data: {},
            position: { x: i * 100, y: 0 },
        }));

        const graph = JSON.stringify({ nodes, edges: [] });
        const parsed = JSON.parse(graph);

        expect(parsed.nodes.map((n: any) => n.type)).toEqual(nodeTypes);
    });

    it('edge handles follow naming convention', () => {
        const edges = [
            { id: 'e1', source: 's1', sourceHandle: 'value', target: 'cmp1', targetHandle: 'a' },
            { id: 'e2', source: 'c1', sourceHandle: 'output', target: 'cmp1', targetHandle: 'b' },
            { id: 'e3', source: 'cmp1', sourceHandle: 'output', target: 'a1', targetHandle: 'trigger' },
        ];

        const validSourceHandles = ['value', 'output'];
        const validTargetHandles = ['a', 'b', 'trigger', 'input'];

        for (const edge of edges) {
            expect(validSourceHandles).toContain(edge.sourceHandle);
            expect(validTargetHandles).toContain(edge.targetHandle);
        }
    });
});

describe('Flow graph validation', () => {
    it('detects empty graph', () => {
        const graph = JSON.parse('{"nodes":[],"edges":[]}');
        expect(graph.nodes.length).toBe(0);
    });

    it('can count node types', () => {
        const graph = {
            nodes: [
                { id: 's1', type: 'sensor_input', data: {} },
                { id: 's2', type: 'sensor_input', data: {} },
                { id: 'c1', type: 'comparison', data: {} },
                { id: 'a1', type: 'actuator_output', data: {} },
            ],
            edges: [],
        };

        const sensorCount = graph.nodes.filter(n => n.type === 'sensor_input').length;
        const actuatorCount = graph.nodes.filter(n => n.type === 'actuator_output').length;

        expect(sensorCount).toBe(2);
        expect(actuatorCount).toBe(1);
    });

    it('edges reference existing nodes', () => {
        const graph = {
            nodes: [
                { id: 'n1', type: 'sensor_input', data: {} },
                { id: 'n2', type: 'actuator_output', data: {} },
            ],
            edges: [
                { id: 'e1', source: 'n1', target: 'n2' },
            ],
        };

        const nodeIds = new Set(graph.nodes.map(n => n.id));
        for (const edge of graph.edges) {
            expect(nodeIds.has(edge.source)).toBe(true);
            expect(nodeIds.has(edge.target)).toBe(true);
        }
    });

    it('detects dangling edges', () => {
        const graph = {
            nodes: [{ id: 'n1', type: 'sensor_input', data: {} }],
            edges: [{ id: 'e1', source: 'n1', target: 'n_missing' }],
        };

        const nodeIds = new Set(graph.nodes.map(n => n.id));
        const dangling = graph.edges.filter(e => !nodeIds.has(e.source) || !nodeIds.has(e.target));

        expect(dangling).toHaveLength(1);
    });
});
