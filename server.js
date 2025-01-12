const express = require('express');
const { swaggerUi, specs } = require('./swagger');
const bodyParser = require('body-parser');
const {
  addMember,
  findMember,
  findAllActiveMembers,
  cancelMember,
  modifyMembershipStartDate,
  addPayment,
  trackAttendance,
  addReferral
} = require('./members');

const app = express();
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Swagger Documentation Setup

/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - startDate
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         startDate:
 *           type: string
 *         tier:
 *           type: string
 *         referredBy:
 *           type: string
 *         referralCount:
 *           type: integer
 */

/**
 * @swagger
 * tags:
 *   - name: Membership
 *     description: Operations related to gym membership
 */

// Register Membership API
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new gym member
 *     tags: [Membership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       201:
 *         description: Member registered successfully
 *       400:
 *         description: Missing required fields
 */
app.post('/register', (req, res) => {
  const { name, email, startDate, tier, referralCode } = req.body;
  if (!name || !email || !startDate) {
    return res.status(400).json({ message: 'Name, email, and start date are required' });
  }
  const member = addMember(name, email, startDate, tier, referralCode);
  res.status(201).json({ message: 'Membership registered', member });
});

// View Membership Details API
/**
 * @swagger
 * /membership/{email}:
 *   get:
 *     summary: Get details of a specific member by email
 *     tags: [Membership]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member found
 *       404:
 *         description: Member not found or inactive
 */
app.get('/membership/:email', (req, res) => {
  const { email } = req.params;
  const member = findMember(email);
  if (!member) {
    return res.status(404).json({ message: 'Member not found or inactive' });
  }
  res.json(member);
});

// View All Active Members API
/**
 * @swagger
 * /members:
 *   get:
 *     summary: Get all active gym members
 *     tags: [Membership]
 *     responses:
 *       200:
 *         description: List of active members
 */
app.get('/members', (req, res) => {
  const activeMembers = findAllActiveMembers();
  res.json(activeMembers);
});

// Cancel Membership API
/**
 * @swagger
 * /membership/{email}:
 *   delete:
 *     summary: Cancel a specific membership
 *     tags: [Membership]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membership cancelled
 *       404:
 *         description: Member not found or already inactive
 */
app.delete('/membership/:email', (req, res) => {
  const { email } = req.params;
  const member = cancelMember(email);
  if (!member) {
    return res.status(404).json({ message: 'Member not found or already inactive' });
  }
  res.json({ message: 'Membership cancelled', member });
});

// Modify Membership Start Date API
/**
 * @swagger
 * /membership/{email}:
 *   put:
 *     summary: Modify the start date of a membership
 *     tags: [Membership]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newStartDate
 *             properties:
 *               newStartDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Membership start date updated
 *       400:
 *         description: Missing new start date
 *       404:
 *         description: Member not found or inactive
 */
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

// Add Payment API
/**
 * @swagger
 * /payment/{email}:
 *   post:
 *     summary: Add payment for a member
 *     tags: [Membership]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - paymentDate
 *             properties:
 *               amount:
 *                 type: number
 *               paymentDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment added
 *       400:
 *         description: Missing payment details
 *       404:
 *         description: Member not found or inactive
 */
app.post('/payment/:email', (req, res) => {
  const { email } = req.params;
  const { amount, paymentDate } = req.body;
  if (!amount || !paymentDate) {
    return res.status(400).json({ message: 'Amount and payment date are required' });
  }
  const payment = addPayment(email, amount, paymentDate);
  if (!payment) {
    return res.status(404).json({ message: 'Member not found or inactive' });
  }
  res.status(201).json({ message: 'Payment added', payment });
});

// Track Attendance API
/**
 * @swagger
 * /attendance/{email}:
 *   post:
 *     summary: Track attendance for a member
 *     tags: [Membership]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - visitDate
 *             properties:
 *               visitDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Attendance tracked
 *       400:
 *         description: Missing visit date
 *       404:
 *         description: Member not found or inactive
 */
app.post('/attendance/:email', (req, res) => {
  const { email } = req.params;
  const { visitDate } = req.body;
  if (!visitDate) {
    return res.status(400).json({ message: 'Visit date is required' });
  }
  const attendance = trackAttendance(email, visitDate);
  if (!attendance) {
    return res.status(404).json({ message: 'Member not found or inactive' });
  }
  res.status(201).json({ message: 'Attendance tracked', attendance });
});

// Add Referral API
/**
 * @swagger
 * /referral/{referringEmail}:
 *   post:
 *     summary: Add a referral for a member
 *     tags: [Membership]
 *     parameters:
 *       - in: path
 *         name: referringEmail
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - referredEmail
 *             properties:
 *               referredEmail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Referral added
 *       400:
 *         description: Missing referred member email
 *       404:
 *         description: Member not found or inactive
 */
app.post('/referral/:referringEmail', (req, res) => {
  const { referringEmail } = req.params;
  const { referredEmail } = req.body;
  if (!referredEmail) {
    return res.status(400).json({ message: 'Referred member email is required' });
  }
  const referral = addReferral(referringEmail, referredEmail);
  if (!referral) {
    return res.status(404).json({ message: 'Member not found or inactive' });
  }
  res.status(201).json({ message: 'Referral added', referral });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
