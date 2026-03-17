import React from 'react'
import { useT } from '../../../hooks/useT';

const NoSales = () => {
      const {t} = useT();
  return (
    <div className="flex flex-col items-center justify-center py-16 opacity-20 gap-3">
          <p className="font-black uppercase tracking-widest text-sm">
            {t("dashboard.noSales")}
          </p>
        </div>
  )
}

export default NoSales
