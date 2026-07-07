import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

const NotAuthorizedPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted/30 text-center px-4">
      <h1 className="text-6xl font-bold text-destructive">403</h1>
      <h2 className="text-2xl font-semibold">Access Denied</h2>
      <p className="text-muted-foreground max-w-sm">
        You don't have permission to access this page. Please contact an
        administrator if you believe this is a mistake.
      </p>
      <Link to="/dashboard">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
};

export default NotAuthorizedPage;
