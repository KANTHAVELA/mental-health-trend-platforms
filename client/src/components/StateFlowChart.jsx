
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Mood Entry' },
        position: { x: 250, y: 25 },
        style: { background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '12px', width: 120 }
    },
    {
        id: '2',
        data: { label: 'Trend Analysis' },
        position: { x: 250, y: 125 },
        style: { background: '#1e293b', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', width: 150 }
    },
    {
        id: '3',
        data: { label: 'Pattern Recognition' },
        position: { x: 100, y: 225 },
        style: { background: '#334155', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }
    },
    {
        id: '4',
        data: { label: 'Keyword Extraction' },
        position: { x: 400, y: 225 },
        style: { background: '#334155', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }
    },
    {
        id: '5',
        type: 'output',
        data: { label: 'Personalized Insight' },
        position: { x: 250, y: 325 },
        style: { background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', width: 160, fontWeight: 'bold' }
    },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#94a3b8' } },
    { id: 'e2-3', source: '2', target: '3', style: { stroke: '#94a3b8' } },
    { id: 'e2-4', source: '2', target: '4', style: { stroke: '#94a3b8' } },
    { id: 'e3-5', source: '3', target: '5', animated: true, style: { stroke: '#10b981' } },
    { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#10b981' } },
];

const StateFlowChart = () => {
    return (
        <div className="h-[400px] w-full bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 pb-0">
                <h3 className="text-lg font-semibold text-foreground">MindFlow Processing</h3>
            </div>
            <div style={{ height: '350px' }}>
                <ReactFlow
                    nodes={initialNodes}
                    edges={initialEdges}
                    fitView
                    attributionPosition="bottom-right"
                    proOptions={{ hideAttribution: true }}
                >
                    <Background color="#94a3b8" gap={16} size={1} style={{ opacity: 0.1 }} />
                    <Controls showInteractive={false} className="bg-slate-800 border-white/10" />
                </ReactFlow>
            </div>
        </div>
    );
};

export default StateFlowChart;
