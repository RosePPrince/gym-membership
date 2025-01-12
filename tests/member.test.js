const {
    addMember,
    findMember,
    findAllActiveMembers,
    cancelMember,
    modifyMembershipStartDate
  } = require('../members');
  
  describe('Gym Membership Management', () => {
    test('should add a new member', () => {
      const member = addMember('John Doe', 'john@example.com', '2025-01-15');
      expect(member).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        startDate: '2025-01-15',
        isActive: true
      });
    });
  
    test('should find an existing member', () => {
      addMember('Jane Doe', 'jane@example.com', '2025-02-01');
      const member = findMember('jane@example.com');
      expect(member).toBeDefined();
      expect(member.email).toBe('jane@example.com');
    });
  
    test('should return all active members', () => {
      const activeMembers = findAllActiveMembers();
      expect(activeMembers.length).toBeGreaterThan(0);
    });
  
    test('should cancel a membership', () => {
      const member = cancelMember('john@example.com');
      expect(member.isActive).toBe(false);
    });
  
    test('should modify the start date of a membership', () => {
      const member = modifyMembershipStartDate('jane@example.com', '2025-03-01');
      expect(member.startDate).toBe('2025-03-01');
    });
  });
  