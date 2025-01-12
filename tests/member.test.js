const {
  addMember,
  findMember,
  findAllActiveMembers,
  cancelMember,
  modifyMembershipStartDate,
  addPayment,
  trackAttendance,
  addReferral
} = require('../members');

describe('Gym Membership Management', () => {
  test('should add a new member with tier and referral code', () => {
    addMember('Gym Member3', 'gymmember3@example.com', '2025-01-10', 'Basic');
    const member = addMember('Gym Member1', 'gymmember1@example.com', '2025-01-15', 'Premium', 'gymmember3@example.com');
    
    expect(member).toMatchObject({
      name: 'Gym Member1',
      email: 'gymmember1@example.com',
      startDate: '2025-01-15',
      tier: 'Premium',
      referredBy: 'gymmember3@example.com', // This should now match the correct referrer
    });
  });
  
  test('should find an existing member', () => {
    addMember('Gym Member2', 'gymmember2@example.com', '2025-02-01', 'Basic', 'gymmember1@example.com');
    const member = findMember('gymmember2@example.com');
    expect(member).toBeDefined();
    expect(member.email).toBe('gymmember2@example.com');
  });

  test('should return all active members', () => {
    const activeMembers = findAllActiveMembers();
    expect(activeMembers.length).toBeGreaterThan(0);
  });

  test('should cancel a membership', () => {
    const member = cancelMember('gymmember1@example.com');
    expect(member.isActive).toBe(false);
  });

  test('should modify the start date of a membership', () => {
    const member = modifyMembershipStartDate('gymmember2@example.com', '2025-03-01');
    expect(member.startDate).toBe('2025-03-01');
  });

  test('should add payment for a member', () => {
    addMember('Gym Member3', 'gymmember3@example.com', '2025-01-10', 'Standard');
    const payment = addPayment('gymmember3@example.com', 50, '2025-01-12');
    expect(payment).toMatchObject({
      amount: 50,
      paymentDate: '2025-01-12',
      email: 'gymmember3@example.com', // Ensure email is included
    });
  });
  

  test('should track attendance for a member', () => {
    addMember('Gym Member4', 'gymmember4@example.com', '2025-01-12', 'Premium');
    const attendance = trackAttendance('gymmember4@example.com', '2025-01-14');
    expect(attendance).toMatchObject({
      email: 'gymmember4@example.com',
      visitDate: '2025-01-14'
    });
  });

  test('should add referral for a member', () => {
    addMember('Gym Member5', 'gymmember5@example.com', '2025-01-11', 'Basic');
    const referral = addReferral('gymmember5@example.com', 'gymmember4@example.com');
    expect(referral).toMatchObject({
      referringEmail: 'gymmember5@example.com',
      referredEmail: 'gymmember4@example.com',
    });
  });
  
});
