import LayoutWithoutSidebar from "@/components/LayoutWithoutSidebar";
import { useUser } from "@/features/auth/authHooks";
import { useRouter } from "next/router";
import React from "react";

const Profile: React.FC = () => {
  const user = useUser({ redirectTo: "/" });
  const router = useRouter();
  const [counter, setCounter] = React.useState(5);

  React.useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    if (counter === 0) {
      router.push("/");
    }
    return () => clearInterval(timer as NodeJS.Timer);
  }, [counter]);

  if (user.loading || !user.authentication) return <LayoutWithoutSidebar />;
  return (
    <LayoutWithoutSidebar>
      <div className="flex flex-col gap-4 justify-center items-center text-center">
        <div className="text-3xl font-bold">User: {user.data.displayName}</div>
        <div className="text-3xl">...</div>
      </div>
    </LayoutWithoutSidebar>
  );
};

export default Profile;
