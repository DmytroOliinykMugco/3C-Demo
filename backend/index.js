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
    funeral: (() => {
      const statements = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const statementTypes = ['Monthly', 'Quarterly', 'Annual', 'Final', 'Interim', 'Summary', 'Detailed'];
      const years = [2022, 2023, 2024, 2025];

      // Generate statements for the past 3 years
      let counter = 1;
      for (const year of years) {
        // Generate monthly statements
        for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
          const month = months[monthIdx];
          const day = Math.floor(Math.random() * 28) + 1;
          const statementType = monthIdx % 3 === 0 && monthIdx > 0
            ? statementTypes[Math.floor(Math.random() * statementTypes.length)]
            : 'Monthly';
          const fileSize = (Math.random() * 4 + 1).toFixed(1);

          statements.push({
            id: 'FU8434434',
            name: `${statementType}Statement_${month}${year}.pdf`,
            date: `${month} ${String(day).padStart(2, '0')} ${year}`,
            size: `${fileSize}mb`
          });
          counter++;
        }

        // Add annual summary for each year
        const annualSize = (Math.random() * 6 + 3).toFixed(1);
        statements.push({
          id: 'FU8434434',
          name: `AnnualSummary_${year}.pdf`,
          date: `Dec 31 ${year}`,
          size: `${annualSize}mb`
        });
      }

      return statements.reverse(); // Most recent first
    })(),
    cemetery: (() => {
      const statements = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const statementTypes = ['Monthly', 'Quarterly', 'Maintenance', 'Service', 'Annual', 'Summary'];
      const years = [2022, 2023, 2024, 2025];

      // Generate statements for the past 3 years
      let counter = 1;
      for (const year of years) {
        // Generate monthly statements
        for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
          const month = months[monthIdx];
          const day = Math.floor(Math.random() * 28) + 1;
          const statementType = monthIdx % 3 === 0 && monthIdx > 0
            ? statementTypes[Math.floor(Math.random() * statementTypes.length)]
            : 'Monthly';
          const fileSize = (Math.random() * 3.5 + 0.8).toFixed(1);

          statements.push({
            id: 'CE8434434',
            name: `${statementType}Report_${month}${year}.pdf`,
            date: `${month} ${String(day).padStart(2, '0')} ${year}`,
            size: `${fileSize}mb`
          });
          counter++;
        }

        // Add annual maintenance report for each year
        const annualSize = (Math.random() * 5 + 2.5).toFixed(1);
        statements.push({
          id: 'CE8434434',
          name: `AnnualMaintenanceReport_${year}.pdf`,
          date: `Dec 31 ${year}`,
          size: `${annualSize}mb`
        });
      }

      return statements.reverse(); // Most recent first
    })()
  },
  paymentHistory: (() => {
    const payments = [];
    const beneficiaries = [
      { name: 'Marie Parker', initials: 'MP' },
      { name: 'Ken Parker', initials: 'KP' },
      { name: 'John Smith', initials: 'JS' },
      { name: 'Sarah Johnson', initials: 'SJ' },
      { name: 'Michael Brown', initials: 'MB' },
      { name: 'Emily Davis', initials: 'ED' },
      { name: 'David Wilson', initials: 'DW' },
      { name: 'Jessica Martinez', initials: 'JM' },
      { name: 'Robert Anderson', initials: 'RA' },
      { name: 'Lisa Thompson', initials: 'LT' },
      { name: 'James White', initials: 'JW' },
      { name: 'Mary Garcia', initials: 'MG' },
      { name: 'William Rodriguez', initials: 'WR' },
      { name: 'Patricia Lee', initials: 'PL' },
      { name: 'Christopher Walker', initials: 'CW' }
    ];

    const contractIds = [
      'FU8434434', 'FU8434435', 'FU8434436', 'FU8434437', 'FU8434438',
      'CE8434434', 'CE8434435', 'CE8434436', 'CE8434437', 'CE8434438'
    ];

    const paymentMethods = [
      'Cash in store',
      '** 5758',
      '** 4242',
      '** 1234',
      '** 5678',
      '** 9012',
      '** 3456',
      '** 7890',
      'Bank transfer',
      'Check',
      'ACH',
      'Wire transfer'
    ];

    const badges = ['AN', 'PN', 'BN', 'OK'];

    const amounts = [500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 7500, 10000, 12500, 15000, 20000, 25000];

    // Start from recent date and go backwards
    let currentDate = new Date('2025-11-03');
    let runningBalances = {}; // Track balance per contract

    // Initialize balances for each contract
    contractIds.forEach(contractId => {
      runningBalances[contractId] = 0;
    });

    for (let i = 1; i <= 200; i++) {
      // Random contract
      const contractId = contractIds[Math.floor(Math.random() * contractIds.length)];

      // Random beneficiary
      const beneficiary = beneficiaries[Math.floor(Math.random() * beneficiaries.length)];

      // Random badge
      const badge = badges[Math.floor(Math.random() * badges.length)];

      // Random payment method
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      // Random amount
      const amount = amounts[Math.floor(Math.random() * amounts.length)];

      // Calculate balance (add payment to current balance)
      const balance = runningBalances[contractId];
      runningBalances[contractId] += amount;

      // Generate date (go backwards in time)
      const daysBack = Math.floor(Math.random() * 15) + 1; // 1-15 days back
      currentDate.setDate(currentDate.getDate() - daysBack);

      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const year = currentDate.getFullYear();
      const hours = Math.floor(Math.random() * 12) + 1;
      const minutes = Math.floor(Math.random() * 60);
      const period = Math.random() > 0.5 ? 'PM' : 'AM';

      const dateTime = `${month}/${String(day).padStart(2, '0')}/${year} ${hours}:${String(minutes).padStart(2, '0')} ${period}`;

      payments.unshift({
        id: i,
        contractId,
        beneficiary: {
          name: beneficiary.name,
          badge,
          initials: beneficiary.initials
        },
        dateTime,
        paymentMethod,
        amount,
        balance
      });
    }

    return payments;
  })(),
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
  ownedProperty: (() => {
    const properties = [];

    const propertyTypes = [
      'Family burial',
      'Single burial',
      'Columbarium',
      'Cremation niche',
      'Mausoleum',
      'Garden plot',
      'Memorial bench',
      'Estate plot'
    ];

    const owners = [
      { name: 'Luna Miller', initials: 'LM' },
      { name: 'Ken Parker', initials: 'KP' },
      { name: 'Marie Parker', initials: 'MP' },
      { name: 'John Smith', initials: 'JS' },
      { name: 'Sarah Johnson', initials: 'SJ' },
      { name: 'Michael Brown', initials: 'MB' },
      { name: 'Emily Davis', initials: 'ED' },
      { name: 'David Wilson', initials: 'DW' },
      { name: 'Jessica Martinez', initials: 'JM' },
      { name: 'Robert Anderson', initials: 'RA' },
      { name: 'Lisa Thompson', initials: 'LT' },
      { name: 'James White', initials: 'JW' }
    ];

    const locations = [
      'Section A, Row 12',
      'Section B, Row 5',
      'Section C, Row 8',
      'East Garden, Block 3',
      'West Garden, Block 7',
      'North Hill, Plot 15',
      'South Valley, Plot 22',
      'Memorial Grove, Area 4',
      'Peaceful Meadow, Lot 18',
      'Serenity Garden, Plot 9',
      'Eternal Rest, Section D',
      'Tranquil Hills, Row 14',
      'Garden of Remembrance',
      'Veterans Memorial',
      'Sunset View, Block 6'
    ];

    const contractIds = [
      'CE8434434', 'CE8434435', 'CE8434436', 'CE8434437', 'CE8434438',
      'CE8434439', 'CE8434440', 'CE8434441', 'CE8434442', 'CE8434443'
    ];

    const statuses = ['Paid', 'Active', 'Reserved'];
    const badges = ['AN', 'PN', 'BN', 'OK'];

    const images = [
      'https://images.unsplash.com/photo-1566305977571-5666677c6e98?w=400',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400',
      'https://images.unsplash.com/photo-1605116959016-b4e8afbbb7c5?w=400',
      'https://images.unsplash.com/photo-1571380401583-72ca84994796?w=400'
    ];

    // Generate properties - spanning several years
    const years = [2020, 2021, 2022, 2023, 2024, 2025];

    for (const year of years) {
      // Generate 8-12 properties per year
      const propertiesPerYear = Math.floor(Math.random() * 5) + 8;

      for (let i = 0; i < propertiesPerYear; i++) {
        const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
        const owner = owners[Math.floor(Math.random() * owners.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const contractId = contractIds[Math.floor(Math.random() * contractIds.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const badge = badges[Math.floor(Math.random() * badges.length)];
        const image = images[Math.floor(Math.random() * images.length)];

        properties.push({
          id: properties.length + 1,
          contractId,
          type: propertyType,
          owner: {
            name: owner.name,
            badge,
            initials: owner.initials
          },
          location,
          status,
          image,
          purchaseYear: year
        });
      }
    }

    return properties.reverse(); // Most recent first
  })(),
  additionalInvoices: (() => {
    const services = [
      'Cleaning', 'Maintenance', 'FlowerArrangement', 'MemorialService',
      'Transportation', 'Catering', 'Photography', 'VideoRecording',
      'MusicServices', 'PrintedMaterials', 'Cremation', 'Embalming',
      'CasketRental', 'UrnsAndKeepsakes', 'GraveMaintenance', 'HeadstoneEngraving',
      'ObituaryNotices', 'DeathCertificates', 'MemorialCards', 'ThankYouCards'
    ];

    const statuses = ['Payed', 'Ongoing', 'Pending', 'Cancelled'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const invoices = [];

    for (let i = 1; i <= 100; i++) {
      const service = services[Math.floor(Math.random() * services.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const month = months[Math.floor(Math.random() * months.length)];
      const day = Math.floor(Math.random() * 28) + 1;
      const year = Math.random() > 0.3 ? 2025 : 2024;
      const amount = (Math.floor(Math.random() * 5000) + 100);
      const fileSize = (Math.random() * 5 + 0.5).toFixed(1);
      const invoiceIdNum = 8400000 + i;

      invoices.push({
        id: i,
        fileName: `InvoiceFor${service}.pdf`,
        fileSize: `${fileSize}mb`,
        invoiceId: invoiceIdNum.toString(),
        paymentDue: `${month} ${String(day).padStart(2, '0')} ${year}`,
        status: status,
        amount: amount
      });
    }

    return invoices;
  })()
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
