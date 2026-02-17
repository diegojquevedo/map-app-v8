export function PopupInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="mapbox-popup-inner">
      {children}
    </div>
  );
}

export function PopupHeader() {
  return (
    <div className="h-2 bg-black rounded-t-lg" />
  );
}

export function PopupBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4">
      {children}
    </div>
  );
}

export function PopupTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="m-0 mb-3 text-base font-bold text-gray-900 uppercase leading-tight pr-6">
      {children}
    </h3>
  );
}

export function PopupMission({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 mb-3 text-[13px] text-gray-600 leading-normal max-h-[120px] overflow-y-auto">
      {children}
    </p>
  );
}

export function PopupDetails({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs text-gray-500 leading-relaxed">
      {children}
    </div>
  );
}

export function PopupDetailRow({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 mb-1.5">
      {children}
    </p>
  );
}

export function PopupDetailLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-medium">{children}</span>
  );
}

export function PopupLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 no-underline break-all hover:underline"
    >
      {children}
    </a>
  );
}
