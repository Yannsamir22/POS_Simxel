
const Loading = () => {
  return (
    <div>
      <div>
            <div className="p-10 space-y-8 ">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-primary">Simxel Dashboard</h1>
        <div className="badge badge-secondary badge-outline">Winter Theme Active</div>
      </header>

      {/* Stats Section */}
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div className="stat-title">Total Sales</div>
          <div className="stat-value text-primary">2.6M FCFA</div>
          <div className="stat-desc">Jan 1st - Feb 1st</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          </div>
          <div className="stat-title">New Users</div>
          <div className="stat-value text-secondary">4,200</div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </div>
      </div>

      {/* Sample Table */}
      <div className="overflow-x-auto bg-base-100 rounded-box shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
              <th><button className="btn btn-ghost btn-xs">details</button></th>
            </tr>
            <tr className="hover">
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
              <th><button className="btn btn-ghost btn-xs">details</button></th>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex gap-4">
        <button className="btn btn-primary">Save Changes</button>
        <button className="btn btn-outline">Cancel</button>
      </div>
    </div>
            
      </div>
    </div>
  )
}

export default Loading
