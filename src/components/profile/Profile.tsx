import { useState } from "react";
import UseModal from "../../hooks/UseModal";
import { useForm, type FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import useContextPro from "../../hooks/useContextPro";
import useLoading from "../../hooks/useLoading";
import useProducts from "../../hooks/useProducts";
import { useProfile } from "../../hooks/useProfile";

function Profile() {
  const { reviews } = useProducts();
  const { loading } = useLoading();
  const {
    state: { user, cart }
  } = useContextPro();

  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: formSubmittingProfile },
  } = useForm();

  const {
    register: registerPass,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    formState: { isSubmitting: formSubmittingPass },
  } = useForm();

  const { updateProfile, changePassword, updatingProfile, updatingPassword } =
    useProfile();

  const userId = user?.id ?? user?.user_id ?? user?.uid; 

  const updateProfileHandler = async (data: FieldValues) => {
    if (!userId) {
      toast.error("User ID topilmadi");
      return;
    }

    const payload: Record<string, string> = {};
    if (data.name && data.name !== user?.name) payload.name = data.name;
    if (data.email && data.email !== user?.email) payload.email = data.email;

    if (Object.keys(payload).length === 0) {
      toast.info("O‘zgarish yo‘q");
      return;
    }

    await updateProfile({ userId, payload });
    setOpen(false);
    reset();
  };

  const changePasswordHandler = async (data: FieldValues) => {
    if (!userId) {
      toast.error("User ID topilmadi");
      return;
    }

    await changePassword({
      userId,
      payload: {
        old_password: data.oldPassword,
        new_password: data.newPassword,
      },
    });

    setOpenPassword(false);
    resetPass();
  };

  const userReviews = reviews.filter(
    (review) => review.userId === user?.id || review.userId === user?.uid,
  );

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-state">
          <div className="dash-loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        {" "}
        <div className="profile-avatar">
          {" "}
          <div className="profile-avatar-circle">
            {" "}
            {user?.name?.charAt(0) || "U"}{" "}
          </div>{" "}
          <div className="online-indicator"></div>{" "}
        </div>{" "}
        <div className="profile-info">
          {" "}
          <h1 className="profile-name">{user?.name || "User"}</h1>{" "}
          <p className="profile-email">{user?.email || "No email provided"}</p>{" "}
          <div className="profile-badge">Breakfast Lover 🥐</div>{" "}
        </div>{" "}
      </div>
      <div className="profile-stats">
        {" "}
        <div className="profile-stat-card">
          {" "}
          <div className="profile-stat-icon">🛒</div>{" "}
          <div className="profile-stat-content">
            {" "}
            <div className="profile-stat-number">{cart?.length || 0}</div>{" "}
            <div className="profile-stat-label">Cart Items</div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="profile-stat-card">
          {" "}
          <div className="profile-stat-icon">⭐</div>{" "}
          <div className="profile-stat-content">
            {" "}
            <div className="profile-stat-number">
              {userReviews?.length}
            </div>{" "}
            <div className="profile-stat-label">Reviews</div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="profile-stat-card">
          {" "}
          <div className="profile-stat-icon">❤️</div>{" "}
          <div className="profile-stat-content">
            {" "}
            <div className="profile-stat-number">28</div>{" "}
            <div className="profile-stat-label">Favorites</div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="profile-details">
        {" "}
        <div className="profile-detail-section">
          {" "}
          <h3 className="section-title">Personal Information</h3>{" "}
          <div className="profile-detail-grid">
            {" "}
            <div className="profile-detail-item">
              {" "}
              <label>Full Name</label>{" "}
              <p>{user?.name || "Not provided"}</p>{" "}
            </div>{" "}
            <div className="profile-detail-item">
              {" "}
              <label>Email Address</label>{" "}
              <p>{user?.email || "Not provided"}</p>{" "}
            </div>{" "}
            <div className="profile-detail-item">
              {" "}
              <label>Member Since</label> <p>January 2024</p>{" "}
            </div>{" "}
            <div className="profile-detail-item">
              {" "}
              <label>Favorite Item</label> <p>Croissant & Coffee ☕</p>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      </div>
      <div className="detail-section mt-4">
        {" "}
        <h3 className="section-title">Preferences</h3>{" "}
        <div className="preferences">
          {" "}
          <span className="preference-tag">Morning Person</span>{" "}
          <span className="preference-tag">Coffee Lover</span>{" "}
          <span className="preference-tag">Pastry Enthusiast</span>{" "}
          <span className="preference-tag">Healthy Options</span>{" "}
        </div>{" "}
        <div className="update-buttons">
          {" "}
          <button className="update-profile-btn" onClick={() => setOpen(true)}>
            Update Profile
          </button>{" "}
          <button
            className="change-password-btn"
            onClick={() => setOpenPassword(true)}
          >
            Change Password
          </button>{" "}
        </div>{" "}
      </div>
      <UseModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Update Profile"
        size="md"
      >
        <form onSubmit={handleSubmit(updateProfileHandler)}>
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              className="form-control"
              type="text"
              id="name"
              defaultValue={user?.name}
              {...register("name")}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              className="form-control"
              type="email"
              id="email"
              defaultValue={user?.email}
              {...register("email")}
            />
          </div>

          <button
            className="update-profile-btn mt-3 w-100"
            type="submit"
            disabled={updatingProfile || formSubmittingProfile}
            style={{
              opacity: updatingProfile || formSubmittingProfile ? 0.5 : 1,
            }}
          >
            {updatingProfile || formSubmittingProfile
              ? "Updating..."
              : "Update Profile"}
          </button>
        </form>
      </UseModal>
      <UseModal
        isOpen={openPassword}
        onClose={() => setOpenPassword(false)}
        title="Change Password"
        size="md"
      >
        <form onSubmit={handlePassSubmit(changePasswordHandler)}>
          <div className="mb-3">
            <label className="form-label" htmlFor="oldPassword">
              Old Password
            </label>
            <input
              className="form-control"
              type="password"
              id="oldPassword"
              {...registerPass("oldPassword", { required: true })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="newPassword">
              New Password
            </label>
            <input
              className="form-control"
              type="password"
              id="newPassword"
              {...registerPass("newPassword", { required: true, minLength: 6 })}
            />
          </div>

          <button
            className="change-password-btn mt-3 w-100"
            type="submit"
            disabled={updatingPassword || formSubmittingPass}
            style={{
              opacity: updatingPassword || formSubmittingPass ? 0.5 : 1,
            }}
          >
            {updatingPassword || formSubmittingPass
              ? "Updating..."
              : "Change Password"}
          </button>
        </form>
      </UseModal>
    </div>
  );
}

export default Profile;
