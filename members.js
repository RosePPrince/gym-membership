const members = [];

const addMember = (name, email, startDate, tier = 'Basic', referralCode = null) => {
  // Track the referrer if the member came through a referral
  const referredBy = referralCode ? findMember(referralCode) : null;

  const member = {
    name,
    email,
    startDate,
    tier,
    isActive: true,
    paymentHistory: [], // Tracks payments
    attendance: [], // Tracks attendance records
    referredBy: referredBy ? referredBy.email : null, // Track referrer (if any)
    referralCount: 0, // Initialize referral count
  };

  members.push(member);
  return member;
};

const findMember = (email) => {
  return members.find((member) => member.email === email && member.isActive);
};

const findAllActiveMembers = () => {
  return members.filter((member) => member.isActive);
};

const cancelMember = (email) => {
  const member = findMember(email);
  if (member) {
    member.isActive = false;
    return member;
  }
  return null;
};

const modifyMembershipStartDate = (email, newStartDate) => {
  const member = findMember(email);
  if (member) {
    member.startDate = newStartDate;
    return member;
  }
  return null;
};

// Add payment history when a payment is made
const addPayment = (email, amount, paymentDate) => {
  const member = findMember(email);
  if (member) {
    const payment = {
      email,
      amount,
      paymentDate,
    };
    member.paymentHistory.push(payment);
    return payment;
  }
  return null;
};

// Track attendance when a member visits the gym
const trackAttendance = (email, visitDate) => {
  const member = findMember(email);
  if (member) {
    member.attendance.push(visitDate);
    return { email, visitDate };
  }
  return null;
};

// Optionally, track referrals
const addReferral = (referringMemberEmail, referredMemberEmail) => {
  const referringMember = findMember(referringMemberEmail);
  const referredMember = findMember(referredMemberEmail);

  if (referringMember && referredMember && referringMember !== referredMember) {
    // Update the referring member with new referral
    referringMember.referralCount += 1;
    // Return just the emails of the referring and referred members
    return { referringEmail: referringMember.email, referredEmail: referredMember.email };
  }
  return null;
};

module.exports = {
  addMember,
  findMember,
  findAllActiveMembers,
  cancelMember,
  modifyMembershipStartDate,
  addPayment,
  trackAttendance,
  addReferral,
};
