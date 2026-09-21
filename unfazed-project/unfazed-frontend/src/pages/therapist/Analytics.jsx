import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/analytics/StatCard';
import RevenueChart from '../../components/analytics/RevenueChart';
import { useEntitlement } from '../../hooks/useEntitlement';

export default function Analytics() {
  const [basic, setBasic] = useState(null);
  const [advanced, setAdvanced] = useState(null);
  const { canAccess, tier } = useEntitlement();

  useEffect(() => {
    if (canAccess('analytics:basic')) {
      api.get('/analytics/basic').then((res) => setBasic(res.data)).catch(() => setBasic(false));
    } else {
      setBasic(false);
    }
    if (canAccess('analytics:advanced')) {
      api.get('/analytics/advanced').then((res) => setAdvanced(res.data)).catch(() => setAdvanced(false));
    } else {
      setAdvanced(false);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-serif text-3xl mb-6">Analytics</h1>

      {basic === null && <Loader />}
      {basic === false && (
        <div className="border border-line rounded-card bg-white p-6 text-sm text-ink/70">
          Analytics is available on the Pro plan and above. You're currently on <span className="capitalize">{tier}</span>.
        </div>
      )}
      {basic && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <StatCard label="Active clients" value={basic.activeClients} />
            {advanced && <StatCard label="No-show rate" value={`${advanced.noShowRate}%`} />}
          </div>
          <RevenueChart data={basic.revenueTrend} />
          {advanced === false && (
            <p className="text-sm text-ink/50 mt-4">Upgrade to Premium for no-show rate and session-duration breakdowns.</p>
          )}
        </>
      )}
    </div>
  );
}
