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

const familyData = {
  nextOfKin: {
    id: 1,
    name: 'Obi-Wan Kenobi',
    relationship: 'Mentor',
    phone: '+1 555 JEDI 999',
    email: 'obiwan.kenobi@jediorder.org',
    accesses: [
      { id: 'JEDI-9999', type: 'viewer', label: 'ID: JEDI-9999' },
      { type: 'viewer', label: 'My Wishes' }
    ],
    isStarred: false,
    initials: 'OK'
  },
  starredMembers: [
    {
      id: 2,
      name: 'Leia Organa',
      relationship: 'Sister',
      phone: '+1 555 REBEL 777',
      email: 'leia.organa@rebellion.org',
      accesses: [
        { id: 'PRIN-0001', type: 'viewer', label: 'ID: PRIN-0001' },
        { type: 'viewer', label: 'My Wishes' }
      ],
      isStarred: true,
      initials: 'LO'
    },
    {
      id: 3,
      name: 'Han Solo',
      relationship: 'Brother-in-law',
      phone: '+1 555 FCON 420',
      email: 'han.solo@millenniumfalcon.com',
      accesses: [
        { id: 'SMUG-1977', type: 'viewer', label: 'ID: SMUG-1977' },
        { type: 'viewer', label: 'My Wishes' }
      ],
      isStarred: true,
      initials: 'HS'
    }
  ],
  allMembers: [
    {
      id: 4,
      name: 'Chewbacca',
      relationship: 'Co-pilot & Friend',
      phone: '+1 555 WOOKIE 190',
      email: 'chewie@millenniumfalcon.com',
      accesses: [
        { id: 'WOOK-0200', type: 'viewer', label: 'ID: WOOK-0200' },
        { type: 'viewer', label: 'My Wishes' }
      ],
      isStarred: false,
      initials: 'CB'
    },
    {
      id: 5,
      name: 'R2-D2',
      relationship: 'Droid Companion',
      phone: '+1 555 BEEP BOOP',
      email: 'r2d2@astromech.droid',
      accesses: [
        { id: 'DROID-D2', type: 'viewer', label: 'ID: DROID-D2' },
        { type: 'viewer', label: 'My Wishes' }
      ],
      isStarred: false,
      initials: 'R2'
    }
  ]
};

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
  res.json({ success: true, data: familyData });
});

// Toggle star status for family member
app.patch('/api/family/:id/star', (req, res) => {
  const memberId = parseInt(req.params.id);

  // Find member in starred members
  let memberIndex = familyData.starredMembers.findIndex(m => m.id === memberId);
  let member;

  if (memberIndex !== -1) {
    // Member is starred, move to all members
    member = familyData.starredMembers.splice(memberIndex, 1)[0];
    member.isStarred = false;
    familyData.allMembers.push(member);
  } else {
    // Find in all members
    memberIndex = familyData.allMembers.findIndex(m => m.id === memberId);
    if (memberIndex !== -1) {
      // Member is not starred, move to starred members
      member = familyData.allMembers.splice(memberIndex, 1)[0];
      member.isStarred = true;
      familyData.starredMembers.push(member);
    } else {
      // Check if it's the next of kin
      if (familyData.nextOfKin.id === memberId) {
        familyData.nextOfKin.isStarred = !familyData.nextOfKin.isStarred;
        member = familyData.nextOfKin;
      } else {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }
    }
  }

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
    initials: initials
  };

  // Add to all members
  familyData.allMembers.push(newMember);

  res.json({ success: true, data: newMember, message: 'Family member added successfully' });
});

// Get contracts
app.get('/api/contracts', (req, res) => {
  res.json({ success: true, data: contractsData });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
