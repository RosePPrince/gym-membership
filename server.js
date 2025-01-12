const express = require('express');
const bodyParser = require('body-parser');
const {
  addMember,
  findMember,
  findAllActiveMembers,
  cancelMember,
  modifyMembershipStartDate
} = require('./members');

const app = express();
app.use(bodyParser.json());

// Register Membership API
app.post('/register', (req, res) => {
  const { name, email, startDate } = req.body;
  if (!name || !email || !startDate) {
    return res.status(400).json({ message: 'Name, email, and start date are required' });
  }
  const member = addMember(name, email, startDate);
  res.status(201).json({ message: 'Membership registered', member });
});

// View Membership Details API
app.get('/membership/:email', (req, res) => {
  const { email } = req.params;
  const member = findMember(email);
  if (!member) {
    return res.status(404).json({ message: 'Member not found or inactive' });
  }
  res.json(member);
});

// View All Active Members API
app.get('/members', (req, res) => {
  const activeMembers = findAllActiveMembers();
  res.json(activeMembers);
});

// Cancel Membership API
app.delete('/membership/:email', (req, res) => {
  const { email } = req.params;
  const member = cancelMember(email);
  if (!member) {
    return res.status(404).json({ message: 'Member not found or already inactive' });
  }
  res.json({ message: 'Membership cancelled', member });
});

// Modify Membership Start Date API
app.put('/membership/:email', (req, res) => {
  const { email } = req.params;
  const { newStartDate } = req.body;
  if (!newStartDate) {
    return res.status(400).json({ message: 'New start date is required' });
  }
  const member = modifyMembershipStartDate(email, newStartDate);
  if (!member) {
    return res.status(404).json({ message: 'Member not found or inactive' });
  }
  res.json({ message: 'Membership start date updated', member });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
