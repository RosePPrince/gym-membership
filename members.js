const members = [];

const addMember = (name, email, startDate) => {
  const member = {
    name,
    email,
    startDate,
    isActive: true
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

module.exports = {
  addMember,
  findMember,
  findAllActiveMembers,
  cancelMember,
  modifyMembershipStartDate
};
