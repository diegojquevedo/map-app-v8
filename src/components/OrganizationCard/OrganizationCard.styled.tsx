interface CardContainerProps {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function CardContainer({ isSelected, onClick, children }: CardContainerProps) {
  const borderClass = isSelected ? 'border-2 border-blue-600 shadow-lg' : 'border border-gray-200';
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer ${borderClass}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ isSelected }: { isSelected: boolean }) {
  const bgClass = isSelected ? 'bg-blue-600' : 'bg-black';
  
  return (
    <div className={`h-2 rounded-t-lg ${bgClass}`} />
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4">
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-bold text-lg text-gray-900 uppercase mb-2 leading-tight">
      {children}
    </h3>
  );
}

export function CardDetails({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-2 text-sm text-gray-600">
      {children}
    </div>
  );
}

export function MissionText({ children }: { children: React.ReactNode }) {
  return (
    <p className="line-clamp-3">
      {children}
    </p>
  );
}

export function DetailRow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start">
      {children}
    </p>
  );
}

export function DetailLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-medium mr-1">{children}</span>
  );
}

export function DetailValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-blue-600 hover:text-blue-800 truncate">
      {children}
    </span>
  );
}

export function DetailText({ children }: { children: React.ReactNode }) {
  return (
    <span>{children}</span>
  );
}
