import classes from "./users.module.css";

import { User } from "../../../../User/User";
import { useUserFilter } from "../../../../../hooks/useUserFilter";
import UserFilter from "./UserFilter";

export default function Users({ allUsers, isLoading }) {
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
      ) : (
        <ul className={classes.userList}>
          {filteredUsers.map((user) => (
            <li key={user.id} className={classes.userItem}>
              <User user={user} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
