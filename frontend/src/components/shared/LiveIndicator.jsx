// Live Connection Status Indicator
import React from 'react';
import { getConnectionStatus, CONNECTION_STATUS } from '../../socket';

export const LiveIndicator = () => {
  const [status, setStatus] = React.useState(getConnectionStatus());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getConnectionStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case CONNECTION_STATUS.CONNECTED:
        return 'bg-green-500';
      case CONNECTION_STATUS.CONNECTING:
      case CONNECTION_STATUS.RECONNECTING:
        return 'bg-yellow-500';
      case CONNECTION_STATUS.DISCONNECTED:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case CONNECTION_STATUS.CONNECTED:
        return 'Live';
      case CONNECTION_STATUS.CONNECTING:
        return 'Connecting...';
      case CONNECTION_STATUS.RECONNECTING:
        return 'Reconnecting...';
      case CONNECTION_STATUS.DISCONNECTED:
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
      <div
        className={`w-2 h-2 rounded-full ${getStatusColor()} ${
          status === CONNECTION_STATUS.CONNECTED ? 'animate-pulse' : ''
        }`}
      />
      <span className="text-xs font-medium">{getStatusText()}</span>
    </div>
  );
};
