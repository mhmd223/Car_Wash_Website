import { useMemo, useState } from "react";

export function useUserFilter(users = []) {
  const [phoneFilter, setPhoneFilter] = useState("");
  const [searchType, setSearchType] = useState("phone");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");

  const filteredUsers = useMemo(() => {
    const normalizedPhone = phoneFilter.replace(/\D/g, "");
    const normalizedSearch = phoneFilter.trim().toLowerCase();

    return users.filter((user) => {
      const normalizedUserPhone = String(user.phone ?? "").replace(/\D/g, "");
      const matchesSearch =
        searchType === "phone"
          ? normalizedUserPhone.includes(normalizedPhone)
          : String(user[searchType] ?? "")
              .toLowerCase()
              .includes(normalizedSearch);
      const matchesRole =
        roleFilter === "all" ||
        String(user.role ?? "").toLowerCase() === roleFilter;
      const matchesVerification =
        verificationFilter === "all" ||
        Boolean(user.verified) === (verificationFilter === "verified");

      return matchesSearch && matchesRole && matchesVerification;
    });
  }, [users, phoneFilter, searchType, roleFilter, verificationFilter]);

  return {
    filteredUsers,
    phoneFilter,
    searchType,
    setSearchType,
    roleFilter,
    verificationFilter,
    setPhoneFilter,
    setRoleFilter,
    setVerificationFilter,
  };
}
