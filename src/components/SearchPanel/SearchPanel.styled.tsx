export function PanelContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full flex flex-col bg-white border-r border-gray-200 max-h-screen">
      {children}
    </div>
  );
}

export function HeaderContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-shrink-0 p-4 border-b border-gray-200 max-h-[180px]">
      {children}
    </div>
  );
}

export function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-gray-900 mb-4">
      {children}
    </h2>
  );
}

export function SearchInputContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
    </div>
  );
}

export function SearchInput({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <input
      type="text"
      placeholder="Search organizations..."
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
    />
  );
}

export function SearchIcon() {
  return (
    <svg
      className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

export function ResultCount({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 text-sm text-gray-600">
      {children}
    </div>
  );
}

export function ScrollableContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 overflow-y-scroll h-0">
      {children}
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 text-center text-gray-500">
      {children}
    </div>
  );
}

export function CardList({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4">
      {children}
    </div>
  );
}

export function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3">
      {children}
    </div>
  );
}
