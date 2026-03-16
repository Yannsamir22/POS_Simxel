import React, {useState, useEffect} from 'react'
import Loading from '../../loadash/Loading'
import { useServiceStore } from '../../stores/serviceStore'
import { useTicketStore } from '../../stores/useTicketStore'
import SearchBar from '../SearchBar'
const ServicesTab: React.FC = () => {
  const {services, fetchServices, loading} = useServiceStore();
  const addItem = useTicketStore((state) => state.addItem);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter((service) => service.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <Loading message='Loading Services...'/>;
  }
  return (
    <div>
      <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="flex justify-between items-center px-10 border-b border-base-300 py-4">
        <h1 className="uppercase tracking-tighter font-extrabold">
          Service Sale
        </h1>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search Services..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4 p-20">
        {filteredServices.map((s) => (
          <div
            key={s.id}
            onClick={() =>
              addItem({
                id: s.id,
                name: s.name,
                price: s.price,
                type: "SERVICE",
                quantity: 1,
              })
            }
            className="p-4 bg-base-200 rounded-xl hover:bg-primary/20 cursor-pointer flex justify-between items-center"
          >
            <span>{s.name}</span>
            <span>{s.price} FCFA</span>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default ServicesTab
