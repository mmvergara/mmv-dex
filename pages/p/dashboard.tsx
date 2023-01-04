import Head from "next/head";
import DashboardLinks from "../../components/admin-dashboard/DashboardLinks";
import DashboardFeed from "../../components/admin-dashboard/DashboardFeed";
const AdminDashboard: React.FC = () => {
  return (
    <>
      <Head>
        <title>Dex | Admin Dashboard</title>
      </Head>
      <section className='flex justify-center flex-col gap-4 items-center mt-8 mb-16'>
        <h1 className='text-3xl sm:text-5xl font-Poppins font-semibold'>Admin Dashboard</h1>
        <DashboardLinks />
        <DashboardFeed />
      </section>
    </>
  );
};

export default AdminDashboard;
