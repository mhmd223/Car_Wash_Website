import classes from "./userFilter.module.css";

export default function UserFilter({
  phoneFilter,
  roleFilter,
  verificationFilter,
  searchType,
  setSearchType,
  setPhoneFilter,
  setRoleFilter,
  setVerificationFilter,
}) {
  const searchLabels = {
    phone: "phone number",
    id: "ID",
    email: "email",
  };

  return (
    <div className={classes.filterBar}>
      <select
        className={classes.select}
        value={searchType}
        onChange={(event) => setSearchType(event.target.value)}
        aria-label="Search by"
      >
        <option value="phone">Phone</option>
        <option value="id">ID</option>
        <option value="email">Email</option>
      </select>
      <input
        className={classes.phoneInput}
        type={searchType === "phone" ? "tel" : "text"}
        placeholder={`Filter by ${searchLabels[searchType]}`}
        value={phoneFilter}
        onChange={(event) => setPhoneFilter(event.target.value)}
      />
      <select
        className={classes.select}
        value={roleFilter}
        onChange={(event) => setRoleFilter(event.target.value)}
        aria-label="Filter by role"
      >
        <option value="all">All roles</option>
        <option value="customer">Customer</option>
        <option value="washer">Washer</option>
        <option value="admin">Admin</option>
      </select>
      <select
        className={classes.select}
        value={verificationFilter}
        onChange={(event) => setVerificationFilter(event.target.value)}
        aria-label="Filter by verification status"
      >
        <option value="all">All statuses</option>
        <option value="verified">Verified</option>
        <option value="unverified">Unverified</option>
      </select>
    </div>
  );
}
