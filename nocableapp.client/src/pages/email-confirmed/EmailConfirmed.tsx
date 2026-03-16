import { useSearchParams, Link } from 'react-router-dom';

export default function EmailConfirmed() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success') === 'true';

  return (
    <div className="d-flex justify-content-center align-items-center w-100 py-5">
      <div className="text-center" style={{ maxWidth: 420 }}>
        {success ? (
          <>
            <div className="mb-3" style={{ fontSize: 48 }}>✓</div>
            <h2 className="mb-2">Email Verified!</h2>
            <p className="text-secondary mb-4">
              Your email has been confirmed. You can now log in to your account.
            </p>
            <Link to="/login" className="btn btn-primary">
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <div className="mb-3" style={{ fontSize: 48 }}>✗</div>
            <h2 className="mb-2">Verification Failed</h2>
            <p className="text-secondary mb-4">
              The confirmation link is invalid or has expired. Please register again or contact support.
            </p>
            <Link to="/register" className="btn btn-primary">
              Register Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
