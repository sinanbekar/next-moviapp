import Layout from "@/layouts/LayoutWithoutSidebar";
import { useSession, signIn } from "next-auth/react";

const Profile = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn("google");
    },
  });

  // When rendering client side don't display anything until loading is complete
  if (status === "loading") return null;

  return (
    <Layout>
      <h1 className="text-3xl md:text-4xl">Profile</h1>
      <div className="mt-6 flex w-full flex-col rounded-md bg-gray-500/70 p-5">
        <div className="text-lg md:text-2xl">
          Welcome Back, <span className="font-bold">{session.user!.name}</span>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
