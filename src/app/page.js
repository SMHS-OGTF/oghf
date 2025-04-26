// IMPORT
import fetchData from '$/libs/mongo';
import UserDashboard from '#/UserDashboard';

// COMPONENT
export default async function Home() {
    const divisions = await fetchData({});

    return <UserDashboard initialDivisions={divisions} />;
}