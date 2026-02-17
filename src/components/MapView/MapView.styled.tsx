export function MapContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full relative overflow-hidden">
      {children}
    </div>
  );
}

export function MapCanvasContainer({ mapRef }: { mapRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div 
      ref={mapRef}
      className="absolute top-0 left-0 right-0 bottom-0 h-full w-full"
    />
  );
}

export function LoadingOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
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
