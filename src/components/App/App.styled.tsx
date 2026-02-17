export function AppContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden bg-gray-50 fixed top-0 left-0">
      {children}
    </div>
  );
}

export function AppGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen grid grid-cols-[30%_70%] overflow-hidden">
      {children}
    </div>
  );
}

export function LoadingContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      {children}
    </div>
  );
}

export function LoadingContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center">
      {children}
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
  );
}

export function LoadingText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-gray-600">{children}</p>
  );
}

export function ErrorContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-6 overflow-auto">
      {children}
    </div>
  );
}

export function ErrorContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center max-w-2xl">
      {children}
    </div>
  );
}

export function ErrorIconContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-red-600 mb-4">
      {children}
    </div>
  );
}

export function ErrorIcon() {
  return (
    <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );
}

export function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-lg font-semibold text-gray-900 mb-2">{children}</p>
  );
}

export function ErrorDetails({ children }: { children: React.ReactNode }) {
  return (
    <pre className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded text-left text-xs text-gray-800 whitespace-pre-wrap break-all font-mono overflow-x-auto">
      {children}
    </pre>
  );
}

export function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Reintentar
    </button>
  );
}
