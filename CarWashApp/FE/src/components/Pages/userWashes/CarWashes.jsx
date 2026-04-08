import { useContext } from "react";
import { UserContext } from "../../ContextComponents/UserContext/UserContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export default function CarWashes() {
  const user = useContext(UserContext).user;
  const {
    status,
    error,
    isFetching,
    data: userWashes,
  } = useQuery({
    queryKey: ["userWashes"],
    queryFn: async () => {
      await fetchUserData(user.id);
    },
  });

  async function fetchUserData(userId) {
    try {
      console.log(userId);
      const response = await axios.get(
        "http://localhost:5173/wash/user_washes" + `/${userId}`,

        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  }

  return <div></div>;
}
