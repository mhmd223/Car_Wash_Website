import classes from "./users.module.css";

import { User } from "../../../../User/User";
import { useUserFilter } from "../../../../../hooks/useUserFilter";
import UserFilter from "./UserFilter";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Users({ allUsers, isLoading, isError, updateUser }) {
  const {
    filteredUsers,
    phoneFilter,
    roleFilter,
    verificationFilter,
    searchType,
    setSearchType,
    setPhoneFilter,
    setRoleFilter,
    setVerificationFilter,
  } = useUserFilter(allUsers);

  useEffect(() => {
    if (isError) {
      toast.error("Could not load users.");
    }
  }, [isError]);

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Users</h2>
      <UserFilter
        phoneFilter={phoneFilter}
        roleFilter={roleFilter}
        verificationFilter={verificationFilter}
        searchType={searchType}
        setSearchType={setSearchType}
        setPhoneFilter={setPhoneFilter}
        setRoleFilter={setRoleFilter}
        setVerificationFilter={setVerificationFilter}
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p role="alert">Unable to load users.</p>
      ) : (
        <ul className={classes.userList}>
          {filteredUsers.map((user) => (
            <li key={user.id} className={classes.userItem}>
              <User user={user} updateUser={updateUser} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
