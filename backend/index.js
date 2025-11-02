import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mocked Data - Star Wars Theme
const profileData = {
  userId: 'JEDI-2187',
  status: 'Mister',
  firstName: 'Luke',
  lastName: 'Skywalker',
  middleName: 'Force',
  prefix: 'Jedi Master',
  suffix: 'Jr.',
  phoneNumber: '+1 555 JEDI 001',
  email: 'luke.skywalker@jediorder.org',
  secondNumber: '+1 555 REBEL 123',
  country: 'USA',
  addressLine1: '1138 Desert View Lane, Tatooine District, AZ 85001',
  addressLine2: 'Moisture Farm #42',
  state: 'AZ',
  city: 'Mos Eisley',
  zipCode: '77777',
  initials: 'LS',
  photoUrl: null // Will store base64 encoded image
};

// Mocked contracts data
const contractsData = [
  { id: 1, contractNumber: 'FU8434434' },
  { id: 2, contractNumber: 'FU8434435' },
  { id: 3, contractNumber: 'FU8434436' },
  { id: 4, contractNumber: 'FU8434437' },
  { id: 5, contractNumber: 'FU8434438' },
];

// Counter for generating new family member IDs
let familyMemberIdCounter = 6;

// Balance page mocked data
const balanceData = {
  contacts: [
    {
      id: 1,
      name: 'Joanna Lu',
      role: 'Counsellor',
      descriptionPrefix: 'Contact Counsellor in case you have any',
      descriptionBold: 'contract related questions.',
      email: 'joanna.lu@example.com',
      initials: 'JL'
    },
    {
      id: 2,
      name: 'Leo Dou',
      role: 'Account Services',
      descriptionPrefix: 'Contact Account Services for account',
      descriptionBold: 'payment related questions.',
      email: 'leo.dou@example.com',
      phone: '+1 (650) 550-8808',
      initials: 'LD'
    }
  ],
  contractBalances: [
    {
      id: 1,
      type: 'Cemetery contract',
      contractId: 'CE8434434',
      owner: { name: 'Marie Parker', badge: 'PN', initials: 'MP' },
      totalAmount: 25000.00,
      payOffAmount: 5000.00,
      balanceDue: 5000.00,
      nextPayment: {
        amount: 10000.00,
        dueDate: 'Nov 23 2025',
        label: 'Instalment payment due'
      },
      remainingMonths: 12,
      overduePayments: []
    },
    {
      id: 2,
      type: 'Funeral trust contract',
      contractId: 'CE8434434',
      owner: { name: 'Marie Parker', badge: 'PN', initials: 'MP' },
      totalAmount: 25000.00,
      statementBalanceDue: 5000.00,
      nextPayment: {
        amount: 10000.00,
        dueDate: 'Nov 23 2025',
        label: 'Monthly payment due'
      },
      remainingMonths: 12,
      overduePayments: [
        { amount: 10000.00, dueDate: 'Feb 01 2025' },
        { amount: 10000.00, dueDate: 'Dec 01 2025' }
      ]
    }
  ],
  accountStatements: {
    funeral: [
      { id: 'FU8434434', name: 'FinalStatment.pdf', date: 'Oct 23 2025', size: '4.4mb' },
      { id: 'FU8434434', name: 'SepStatment.pdf', date: 'Sep 23 2025', size: '2.4mb' },
      { id: 'FU8434434', name: 'AugStatment.pdf', date: 'Aug 23 2025', size: '2.4mb' }
    ],
    cemetery: [
      { id: 'CE8434434', name: 'FinalStatment.pdf', date: 'Oct 23 2025', size: '4.4mb' },
      { id: 'CE8434434', name: 'SepStatment.pdf', date: 'Sep 23 2025', size: '2.4mb' },
      { id: 'CE8434434', name: 'AugStatment.pdf', date: 'Aug 23 2025', size: '2.4mb' }
    ]
  },
  paymentHistory: [
    {
      id: 1,
      contractId: 'FU8434434',
      beneficiary: { name: 'Marie Parker', badge: 'AN', initials: 'MP' },
      dateTime: '11/03/2025 3:24 PM',
      paymentMethod: 'Cash in store',
      amount: 25000.00,
      balance: 0.00
    },
    {
      id: 2,
      contractId: 'FU8434434',
      beneficiary: { name: 'Marie Parker', badge: 'PN', initials: 'MP' },
      dateTime: '10/22/2025 3:24 PM',
      paymentMethod: '** 5758',
      amount: 5000.00,
      balance: 25000.00
    },
    {
      id: 3,
      contractId: 'CE8434434',
      beneficiary: { name: 'Ken Parker', badge: 'PN', initials: 'KP' },
      dateTime: '9/21/2025 3:24 PM',
      paymentMethod: '** 026',
      amount: 14000.00,
      balance: 12000.00
    },
    {
      id: 4,
      contractId: 'FU8434434',
      beneficiary: { name: 'Marie Parker', badge: 'PN', initials: 'MP' },
      dateTime: '9/22/2025 3:24 PM',
      paymentMethod: '** 5758',
      amount: 5000.00,
      balance: 30000.00
    },
    {
      id: 5,
      contractId: 'FU8434434',
      beneficiary: { name: 'Marie Parker', badge: 'PN', initials: 'MP' },
      dateTime: '8/22/2025 3:24 PM',
      paymentMethod: '** 5758',
      amount: 5000.00,
      balance: 35000.00
    }
  ],
  contracts: [
    {
      id: 1,
      type: 'Funeral trust contract',
      contractNumber: 'FU8434434',
      status: 'Fully payed',
      role: 'Owner',
      beneficiary: { name: 'Marie Parker', badge: 'PN', initials: 'MP' },
      sharedWith: 5,
      totalAmount: 25000.00,
      balanceDue: 15000.00
    },
    {
      id: 2,
      type: 'Funeral insurance contract',
      contractNumber: 'CE8434434',
      policyId: 'INS-843434',
      insuranceCarrier: 'HomesteadersLife Co.',
      role: 'Owner',
      beneficiary: { name: 'Marie Parker', badge: 'PN', initials: 'MP' },
      sharedWith: 5,
      totalAmount: 25000.00
    }
  ],
  ownedProperty: [
    {
      id: 1,
      contractId: 'CE8434434',
      type: 'Family burial',
      owner: { name: 'Luna Miller', badge: 'AN', initials: 'LM' },
      location: 'Location',
      status: 'Paid',
      image: 'https://images.unsplash.com/photo-1566305977571-5666677c6e98?w=400'
    },
    {
      id: 2,
      contractId: 'CE8434434',
      type: 'Family burial',
      owner: { name: 'Luna Miller', badge: 'AN', initials: 'LM' },
      location: 'Location',
      status: 'Paid',
      image: 'https://images.unsplash.com/photo-1566305977571-5666677c6e98?w=400'
    },
    {
      id: 3,
      contractId: 'CE8434434',
      type: 'Columbarium',
      owner: { name: 'Luna Miller', badge: 'AN', initials: 'LM' },
      location: 'Location',
      status: 'Paid',
      image: 'https://images.unsplash.com/photo-1566305977571-5666677c6e98?w=400'
    }
  ]
};

// All family members in a single collection
const familyMembers = [
  {
    id: 2,
    name: 'Leia Organa',
    relationship: 'Sister',
    phone: '+1 555 REBEL 777',
    email: 'leia.organa@rebellion.org',
    accesses: [
      { id: 'FU8434434', type: 'viewer', label: 'ID: FU8434434' },
      { id: 'FU8434435', type: 'viewer', label: 'ID: FU8434435' },
      { type: 'viewer', label: 'My Wishes' }
    ],
    isStarred: true,
    isNextOfKin: false,
    initials: 'LO'
  },
  {
    id: 3,
    name: 'Han Solo',
    relationship: 'Brother-in-law',
    phone: '+1 555 FCON 420',
    email: 'han.solo@millenniumfalcon.com',
    accesses: [
      { id: 'FU8434434', type: 'viewer', label: 'ID: FU8434434' },
      { type: 'viewer', label: 'My Wishes' }
    ],
    isStarred: true,
    isNextOfKin: false,
    initials: 'HS'
  },
  {
    id: 4,
    name: 'Chewbacca',
    relationship: 'Co-pilot & Friend',
    phone: '+1 555 WOOKIE 190',
    email: 'chewie@millenniumfalcon.com',
    accesses: [
      { id: 'FU8434436', type: 'viewer', label: 'ID: FU8434436' },
      { id: 'FU8434437', type: 'viewer', label: 'ID: FU8434437' },
      { type: 'viewer', label: 'My Wishes' }
    ],
    isStarred: false,
    isNextOfKin: false,
    initials: 'CB'
  },
  {
    id: 5,
    name: 'R2-D2',
    relationship: 'Droid Companion',
    phone: '+1 555 BEEP BOOP',
    email: 'r2d2@astromech.droid',
    accesses: [
      { id: 'FU8434438', type: 'viewer', label: 'ID: FU8434438' },
      { type: 'viewer', label: 'My Wishes' }
    ],
    isStarred: false,
    isNextOfKin: false,
    initials: 'R2'
  }
];

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Customer Care Center Demo Backend API',
    version: '1.0.0',
    endpoints: {
      profile: '/api/profile',
      family: '/api/family'
    }
  });
});

// Profile endpoints
app.get('/api/profile', (req, res) => {
  res.json({ success: true, data: profileData });
});

app.put('/api/profile', (req, res) => {
  // Update profile data with request body
  Object.assign(profileData, req.body);
  res.json({ success: true, data: profileData, message: 'Profile updated successfully' });
});

// Upload photo endpoint
app.post('/api/profile/photo', (req, res) => {
  const { photoUrl } = req.body;
  profileData.photoUrl = photoUrl;
  res.json({ success: true, data: { photoUrl }, message: 'Photo uploaded successfully' });
});

// Family endpoint
app.get('/api/family', (req, res) => {
  // Organize members based on their flags
  const nextOfKin = familyMembers.find(m => m.isNextOfKin) || null;
  const starredMembers = familyMembers.filter(m => !m.isNextOfKin && m.isStarred);
  const allMembers = familyMembers.filter(m => !m.isNextOfKin && !m.isStarred);

  const familyData = {
    nextOfKin,
    starredMembers,
    allMembers
  };

  res.json({ success: true, data: familyData });
});

// Toggle star status for family member
app.patch('/api/family/:id/star', (req, res) => {
  const memberId = parseInt(req.params.id);

  // Find member in the collection
  const member = familyMembers.find(m => m.id === memberId);

  if (!member) {
    return res.status(404).json({ success: false, message: 'Member not found' });
  }

  // Toggle the star status
  member.isStarred = !member.isStarred;

  res.json({ success: true, data: member, message: 'Star status updated' });
});

// Add family member
app.post('/api/family', (req, res) => {
  const { status, firstName, lastName, familyStatus, email, phone, contractId } = req.body;

  // Create initials
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  // Find contract
  const contract = contractsData.find(c => c.id === parseInt(contractId));
  const contractNumber = contract ? contract.contractNumber : '';

  // Create new member
  const newMember = {
    id: familyMemberIdCounter++,
    name: `${firstName} ${lastName}`,
    relationship: familyStatus,
    phone: phone || '',
    email: email,
    accesses: [
      { id: contractNumber, type: 'viewer', label: `ID: ${contractNumber}` },
      { type: 'viewer', label: 'My Wishes' }
    ],
    isStarred: false,
    isNextOfKin: false,
    initials: initials
  };

  // Add to members collection
  familyMembers.push(newMember);

  res.json({ success: true, data: newMember, message: 'Family member added successfully' });
});

// Get contracts
app.get('/api/contracts', (req, res) => {
  res.json({ success: true, data: contractsData });
});

// Get balance data
app.get('/api/balance', (req, res) => {
  res.json({ success: true, data: balanceData });
});

// Set/Assign Next of Kin
app.post('/api/family/next-of-kin', (req, res) => {
  const { memberId, email } = req.body;

  if (memberId) {
    // First, clear any existing next of kin
    familyMembers.forEach(m => m.isNextOfKin = false);

    // Find and assign the member as next of kin
    const member = familyMembers.find(m => m.id === memberId);

    if (member) {
      member.isNextOfKin = true;
      return res.json({ success: true, data: member, message: 'Next of kin assigned successfully' });
    } else {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
  } else if (email) {
    // For now, just show that email invite will be sent (not actually implemented)
    // In a real app, this would send an email invitation
    return res.json({ success: true, message: 'Invitation sent to ' + email });
  }

  return res.status(400).json({ success: false, message: 'Either memberId or email is required' });
});

// Update member accesses
app.patch('/api/family/:id/accesses', (req, res) => {
  const memberId = parseInt(req.params.id);
  const { contracts } = req.body;

  // Find the member
  const member = familyMembers.find(m => m.id === memberId);

  if (!member) {
    return res.status(404).json({ success: false, message: 'Member not found' });
  }

  // Update accesses based on contracts array
  const newAccesses = [
    ...contracts.map(contractNumber => ({
      id: contractNumber,
      type: 'viewer',
      label: `ID: ${contractNumber}`
    })),
    { type: 'viewer', label: 'My Wishes' }
  ];

  member.accesses = newAccesses;

  res.json({ success: true, data: member, message: 'Accesses updated successfully' });
});

// Delete family member
app.delete('/api/family/:id', (req, res) => {
  const memberId = parseInt(req.params.id);

  // Find the member
  const member = familyMembers.find(m => m.id === memberId);

  if (!member) {
    return res.status(404).json({ success: false, message: 'Member not found' });
  }

  // If it's the next of kin, just remove the flag (don't delete the member)
  if (member.isNextOfKin) {
    member.isNextOfKin = false;
    return res.json({ success: true, message: 'Next of kin removed successfully' });
  }

  // Otherwise, actually delete the member from the array
  const memberIndex = familyMembers.findIndex(m => m.id === memberId);
  familyMembers.splice(memberIndex, 1);

  return res.json({ success: true, message: 'Family member deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
