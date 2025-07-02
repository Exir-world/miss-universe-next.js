import React from 'react';

export const TaskSkeleton: React.FC = () => {
  return (
    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg border border-white/10 animate-pulse">
      <div className="flex w-full items-center justify-center gap-4">
        <div className="flex gap-2 flex-col w-2/3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white/30 rounded"></div>
            <div className="h-4 bg-white/30 rounded w-3/4"></div>
          </div>
          <div className="h-3 bg-white/20 rounded w-1/2"></div>
        </div>
        <div className="w-1/3 flex justify-center">
          <div className="h-8 bg-white/30 rounded-full w-24"></div>
        </div>
      </div>
    </div>
  );
};