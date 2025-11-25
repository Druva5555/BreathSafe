import React from 'react';

export default function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="mt-6 flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        placeholder="Enter city name e.g., Delhi"
        className="flex-1 rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={onSearch}
        className="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}
