import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'overview' && <Dashboard />}
      {activeTab === 'trends' && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-white mb-6">Detailed Trend Analysis</h2>
          <Dashboard />
        </div>
      )}
      {activeTab === 'explorer' && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-white mb-6">Data Grid Explorer</h2>
          <Dashboard />
        </div>
      )}
    </Layout>
  );
}

export default App;
