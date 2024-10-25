import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DashboardLoading() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}