const ExpenseManagement = () => {
  const loading = true;
  if (loading)
    return (
      <div className="h-full w-full flex flex-col items-center justify-center  bg-base-100">
        <span className="loading loading-ball loading-lg text-accent"></span>
        <p className="font-black uppercase tracking-[0.4em] text-[10px] opacity-50">
          Charging Expenses...
        </p>
      </div>
    );

  return <div></div>;
};

export default ExpenseManagement;
