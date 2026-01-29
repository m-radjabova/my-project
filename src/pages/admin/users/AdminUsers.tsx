import { useState } from "react";
import Select, { type MultiValue } from "react-select";
import { FaSave, FaTrash, FaUser } from "react-icons/fa";
import useUsers from "../../../hooks/useUsers";
import { customSelectStyles } from "../../../utils";
import UseModal from "../../../hooks/UseModal";

type RoleOption = {
  value: string;
  label: string;
};

function AdminUsers() {
  const {
    users,
    updateUserRole,
    loading,
    deleteUser,
    searchTerm,
    setSearchTerm,
  } = useUsers();
  const [selectedRoles, setSelectedRoles] = useState<{
    [key: string]: string[];
  }>({});
  const [isSaving, setIsSaving] = useState<{ [key: string]: boolean }>({});

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const roleOptions = (): RoleOption[] => [
    { value: "admin", label: "admin" },
    { value: "chef", label: "chef" },
    { value: "waiter", label: "waiter" },
    { value: "user", label: "user" },
  ];

  const handleRoleChange = (
    userId: string,
    selected: MultiValue<{ value: string; label: string }>
  ) => {
    const roles = selected.map((option) => option.value);
    setSelectedRoles((prev) => ({ ...prev, [userId]: roles }));
  };

  const saveRoleChange = async (userId: string) => {
    const roles = selectedRoles[userId] ?? [];
    setIsSaving((prev) => ({ ...prev, [userId]: true }));
    try {
      await updateUserRole(userId, roles);
    } finally {
      setIsSaving((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await deleteUser(deleteTarget);
      setDeleteTarget(null);
      setIsOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-carousel">
        <div className="loading-state">
          <div className="dash-loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const getUserInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="container py-4 admin-users-container">
      <div className="admin-users-header text-white text-center">
        <div>
          <h2 className="fw-bold display-6 d-flex align-items-center justify-content-center mb-3">
          <FaUser className="me-3" />
          User Management
        </h2>
        <p className="lead mb-4">Manage user roles and permissions</p>
        </div>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control search-input"
          placeholder="Search users..."
          type="search"
        />
      </div>

      <div className="card shadow-soft border-0 rounded-4 overflow-hidden user-management-card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-header">
                <tr>
                  <th className="ps-4 py-3 fw-bold">User Information</th>
                  <th className="py-3 fw-bold">Current Roles</th>
                  <th className="py-3 fw-bold">Assign Roles</th>
                  <th className="pe-4 py-3 fw-bold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => {
                    const currentRoles = selectedRoles[user.id] ?? user.roles ?? [];
                    return (
                      <tr key={user.id} className="user-row">
                        <td className="ps-4">
                          <div className="user-info-container">
                            <div className="user-avatar">
                              {getUserInitial(user.name)}
                            </div>
                            <div className="d-flex flex-column">
                              <span className="fw-semibold fs-6">{user.name}</span>
                              <small className="text-muted">{user.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {user.roles?.length ? (
                              user.roles.map((role) => (
                                <span 
                                  key={role} 
                                  className={`role-badge role-${role.toLowerCase()}`}
                                >
                                  {role}
                                </span>
                              ))
                            ) : (
                              <span className="badge bg-soft-secondary text-secondary">
                                No roles
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="role-select-container">
                          <Select
                            isMulti
                            options={roleOptions()}
                            value={currentRoles.map((r) => ({
                              value: r,
                              label: r,
                            }))}
                            styles={{
                              ...customSelectStyles,
                              control: (base) => ({
                                ...base,
                                border: '1px solid rgba(102, 126, 234, 0.3)',
                                borderRadius: '12px',
                                padding: '4px 8px',
                                '&:hover': {
                                  borderColor: 'rgba(102, 126, 234, 0.5)',
                                }
                              }),
                            }}
                            onChange={(selected) =>
                              handleRoleChange(user.id, selected)
                            }
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </td>
                        <td className="pe-4 actions-container">
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              className="btn btn-soft-save d-flex align-items-center"
                              onClick={() => saveRoleChange(user.id)}
                              disabled={isSaving[user.id]}
                            >
                              {isSaving[user.id] ? (
                                <span className="spinner-border spinner-border-sm me-2"></span>
                              ) : (
                                <FaSave className="me-2" />
                              )}
                              Save
                            </button>

                            <button
                              className="btn btn-soft-delete d-flex align-items-center"
                              onClick={() => {
                                setDeleteTarget(user.id);
                                setIsOpen(true);
                              }}
                            >
                              <FaTrash className="me-2" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-5">
                      <div className="no-results">
                        <FaUser className="no-results-icon" />
                        <h5 className="text-muted">No users found</h5>
                        <p className="text-muted">
                          {searchTerm ? 'Try a different search term' : 'No users available'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <UseModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="modal-confirm">
            <h5 className="mb-3">Confirm Deletion</h5>
            <p className="text-muted mb-4">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn btn-cancel"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-confirm" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </UseModal>
      </div>
    </div>
  );
}

export default AdminUsers;