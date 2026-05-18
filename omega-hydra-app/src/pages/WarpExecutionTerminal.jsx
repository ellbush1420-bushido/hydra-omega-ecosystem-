import { useState } from 'react';

export default function WarpExecutionTerminal() {
  const [logs, setLogs] = useState([
    { timestamp: '00:00:01', level: 'info', message: 'Warp.dev connection established' },
    { timestamp: '00:00:02', level: 'info', message: 'Pipeline initialized' },
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const handleDeploy = () => {
    setIsRunning(true);
    setLogs([
      ...logs,
      { timestamp: new Date().toLocaleTimeString(), level: 'info', message: 'Starting deployment...' },
      { timestamp: new Date().toLocaleTimeString(), level: 'info', message: 'Connecting to Warp.dev...' },
    ]);

    setTimeout(() => {
      setLogs(prev => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), level: 'success', message: 'Deployment completed successfully!' },
      ]);
      setIsRunning(false);
    }, 3000);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-emerald-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex flex-col">
      <div className="p-4 border-b border-[#1a1a2e]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-violet-400 flex items-center gap-2">
            <span>⚡</span>
            Warp Execution Terminal
          </h2>
          <button
            onClick={handleDeploy}
            disabled={isRunning}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            {isRunning && (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Deploy to Warp.dev
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Terminal */}
        <div className="flex-1 flex flex-col bg-[#0d0d14]">
          <div className="p-3 border-b border-[#1a1a2e] flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs text-gray-500 font-mono">warp-terminal</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-3 mb-1">
                <span className="text-gray-600">[{log.timestamp}]</span>
                <span className={getLevelColor(log.level)}>{log.level.toUpperCase()}</span>
                <span className="text-gray-300">{log.message}</span>
              </div>
            ))}
            {isRunning && (
              <div className="flex items-center gap-2 text-gray-400 mt-2">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Running...
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[#1a1a2e]">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="$ Enter command..."
                className="flex-1 bg-[#0a0a0f] border border-[#1a1a2e] rounded-lg p-2 text-sm text-gray-200 placeholder-gray-600 focus:border-violet-500 focus:outline-none font-mono"
              />
              <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors">
                Execute
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Visual Pipeline */}
        <div className="w-96 bg-[#0d0d14] border-l border-[#1a1a2e] flex flex-col">
          <div className="p-4 border-b border-[#1a1a2e]">
            <h3 className="text-lg font-bold text-violet-400">Pipeline Status</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* Pipeline Stages */}
              {[
                { name: 'Build', status: 'completed', icon: '🔨' },
                { name: 'Test', status: 'completed', icon: '✅' },
                { name: 'Deploy', status: isRunning ? 'running' : 'pending', icon: '🚀' },
                { name: 'Verify', status: 'pending', icon: '🔍' },
              ].map((stage, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    stage.status === 'completed'
                      ? 'bg-emerald-500/10 border-emerald-500'
                      : stage.status === 'running'
                      ? 'bg-blue-500/10 border-blue-500'
                      : 'bg-[#0a0a0f] border-[#1a1a2e]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{stage.icon}</span>
                      <span className="font-medium text-gray-200">{stage.name}</span>
                    </div>
                    {stage.status === 'running' && (
                      <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    )}
                    {stage.status === 'completed' && (
                      <span className="text-emerald-400">✓</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {stage.status === 'completed' && 'Completed successfully'}
                    {stage.status === 'running' && 'In progress...'}
                    {stage.status === 'pending' && 'Waiting to start'}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-[#0a0a0f] border border-[#1a1a2e] rounded-lg">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Deployment Info</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Environment:</span>
                  <span className="text-gray-300">Production</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Region:</span>
                  <span className="text-gray-300">us-west-2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={isRunning ? 'text-blue-400' : 'text-gray-400'}>
                    {isRunning ? 'Deploying' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors">
                View Full Logs
              </button>
              <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors">
                Cancel Deployment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
