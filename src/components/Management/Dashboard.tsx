import Loading from "../../loadash/Loading";

const Dashboard = () => {
  const loading = true;
  if (loading)
    return (
      // <Loading message="Charging Statistics..."/>
      <></>
    );

  return <div></div>;
};

export default Dashboard;
