export function StatusBadge({ status }) {
  const statusClasses = {
    pending: 'status-pending',
    processing: 'status-processing',
    shipped: 'status-shipped',
    delivered: 'status-delivered',
    cancelled: 'status-cancelled',
  };

  const statusLabels = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  return (
    <span className={`${statusClasses[status] || statusClasses.pending} px-3 py-1 rounded-full text-xs font-semibold`}>
      {statusLabels[status] || status}
    </span>
  );
}
