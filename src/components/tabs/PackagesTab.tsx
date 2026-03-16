import React, { useEffect, useState } from 'react'
import Loading from '../../loadash/Loading'
import { usePackageStore } from '../../stores/packageStore'
import { useTicketStore } from '../../stores/useTicketStore'
import SearchBar from '../SearchBar'

const PackagesTab: React.FC = () => {
  const {packages, fetchPackages, loading} = usePackageStore();
  const addItem = useTicketStore((state) => state.addItem);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPackages();
  }, []);

  const filteredPackages = packages.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <Loading message='Loading Packages...'/>;
  }
  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="flex justify-between items-center px-10 border-b border-base-300 py-4">
        <h1 className="uppercase tracking-tighter font-extrabold">
          Package Sale
        </h1>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search packages..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4 p-20">
        {filteredPackages.map((p) => (
          <div
            key={p.id}
            onClick={() =>
              addItem({
                id: p.id,
                name: p.name,
                price: p.price,
                type: "PACKAGE",
                quantity: 1,
              })
            }
            className="p-4 bg-base-200 rounded-xl hover:bg-primary/20 cursor-pointer flex justify-between items-center"
          >
            <span>{p.name}</span>
            <span>{p.price} FCFA</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PackagesTab
