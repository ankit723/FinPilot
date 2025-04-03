"use client";

import ProfileStatus from "./profile-status";

interface ProfileStatusWrapperProps {
  hasCustomerProfile: boolean;
  firstName: string;
  lastName: string;
}

export default function ProfileStatusWrapper({
  hasCustomerProfile,
  firstName,
  lastName,
}: ProfileStatusWrapperProps) {
  return (
    <ProfileStatus
      hasCustomerProfile={hasCustomerProfile}
      firstName={firstName}
      lastName={lastName}
    />
  );
} 