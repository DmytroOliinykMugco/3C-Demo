import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mocked Data - Star Wars Theme
const profileData = {
  userId: "JEDI-2187",
  status: "Mister",
  firstName: "Luke",
  lastName: "Skywalker",
  middleName: "Force",
  prefix: "Jedi Master",
  suffix: "Jr.",
  phoneNumber: "+1 555 JEDI 001",
  email: "luke.skywalker@jediorder.org",
  secondNumber: "+1 555 REBEL 123",
  country: "USA",
  addressLine1: "1138 Desert View Lane, Tatooine District, AZ 85001",
  addressLine2: "Moisture Farm #42",
  state: "AZ",
  city: "Mos Eisley",
  zipCode: "77777",
  initials: "LS",
  photoUrl: null, // Will store base64 encoded image
};

// Mocked contracts data
const contractsData = [
  { id: 1, contractNumber: "FU8434434" },
  { id: 2, contractNumber: "FU8434435" },
  { id: 3, contractNumber: "FU8434436" },
  { id: 4, contractNumber: "FU8434437" },
  { id: 5, contractNumber: "FU8434438" },
];

// Counter for generating new family member IDs
let familyMemberIdCounter = 6;

// Balance page mocked data
const balanceData = {
  contacts: [
    {
      id: 1,
      name: "Joanna Lu",
      role: "Counsellor",
      descriptionPrefix: "Contact Counsellor in case you have any",
      descriptionBold: "contract related questions.",
      email: "joanna.lu@example.com",
      initials: "JL",
    },
    {
      id: 2,
      name: "Leo Dou",
      role: "Account Services",
      descriptionPrefix: "Contact Account Services for account",
      descriptionBold: "payment related questions.",
      email: "leo.dou@example.com",
      phone: "+1 (650) 550-8808",
      initials: "LD",
    },
  ],
  contractBalances: [
    {
      id: 1,
      type: "Cemetery contract",
      contractId: "CE8434434",
      owner: { name: "Marie Parker", badge: "PN", initials: "MP" },
      totalAmount: 25000.0,
      payOffAmount: 5000.0,
      balanceDue: 5000.0,
      nextPayment: {
        amount: 10000.0,
        dueDate: "Nov 23 2025",
        label: "Instalment payment due",
      },
      remainingMonths: 12,
      overduePayments: [],
    },
    {
      id: 2,
      type: "Funeral trust contract",
      contractId: "CE8434434",
      owner: { name: "Marie Parker", badge: "PN", initials: "MP" },
      totalAmount: 25000.0,
      statementBalanceDue: 5000.0,
      nextPayment: {
        amount: 10000.0,
        dueDate: "Nov 23 2025",
        label: "Monthly payment due",
      },
      remainingMonths: 12,
      overduePayments: [
        { amount: 10000.0, dueDate: "Feb 01 2025" },
        { amount: 10000.0, dueDate: "Dec 01 2025" },
      ],
    },
  ],
  accountStatements: {
    funeral: (() => {
      const statements = [];
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const statementTypes = [
        "Monthly",
        "Quarterly",
        "Annual",
        "Final",
        "Interim",
        "Summary",
        "Detailed",
      ];
      const years = [2022, 2023, 2024, 2025];

      // Generate statements for the past 3 years
      let counter = 1;
      for (const year of years) {
        // Generate monthly statements
        for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
          const month = months[monthIdx];
          const day = Math.floor(Math.random() * 28) + 1;
          const statementType =
            monthIdx % 3 === 0 && monthIdx > 0
              ? statementTypes[
                  Math.floor(Math.random() * statementTypes.length)
                ]
              : "Monthly";
          const fileSize = (Math.random() * 4 + 1).toFixed(1);

          statements.push({
            id: "FU8434434",
            name: `${statementType}Statement_${month}${year}.pdf`,
            date: `${month} ${String(day).padStart(2, "0")} ${year}`,
            size: `${fileSize}mb`,
          });
          counter++;
        }

        // Add annual summary for each year
        const annualSize = (Math.random() * 6 + 3).toFixed(1);
        statements.push({
          id: "FU8434434",
          name: `AnnualSummary_${year}.pdf`,
          date: `Dec 31 ${year}`,
          size: `${annualSize}mb`,
        });
      }

      return statements.reverse(); // Most recent first
    })(),
    cemetery: (() => {
      const statements = [];
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const statementTypes = [
        "Monthly",
        "Quarterly",
        "Maintenance",
        "Service",
        "Annual",
        "Summary",
      ];
      const years = [2022, 2023, 2024, 2025];

      // Generate statements for the past 3 years
      let counter = 1;
      for (const year of years) {
        // Generate monthly statements
        for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
          const month = months[monthIdx];
          const day = Math.floor(Math.random() * 28) + 1;
          const statementType =
            monthIdx % 3 === 0 && monthIdx > 0
              ? statementTypes[
                  Math.floor(Math.random() * statementTypes.length)
                ]
              : "Monthly";
          const fileSize = (Math.random() * 3.5 + 0.8).toFixed(1);

          statements.push({
            id: "CE8434434",
            name: `${statementType}Report_${month}${year}.pdf`,
            date: `${month} ${String(day).padStart(2, "0")} ${year}`,
            size: `${fileSize}mb`,
          });
          counter++;
        }

        // Add annual maintenance report for each year
        const annualSize = (Math.random() * 5 + 2.5).toFixed(1);
        statements.push({
          id: "CE8434434",
          name: `AnnualMaintenanceReport_${year}.pdf`,
          date: `Dec 31 ${year}`,
          size: `${annualSize}mb`,
        });
      }

      return statements.reverse(); // Most recent first
    })(),
  },
  paymentHistory: (() => {
    const payments = [];
    const beneficiaries = [
      { name: "Marie Parker", initials: "MP" },
      { name: "Ken Parker", initials: "KP" },
      { name: "John Smith", initials: "JS" },
      { name: "Sarah Johnson", initials: "SJ" },
      { name: "Michael Brown", initials: "MB" },
      { name: "Emily Davis", initials: "ED" },
      { name: "David Wilson", initials: "DW" },
      { name: "Jessica Martinez", initials: "JM" },
      { name: "Robert Anderson", initials: "RA" },
      { name: "Lisa Thompson", initials: "LT" },
      { name: "James White", initials: "JW" },
      { name: "Mary Garcia", initials: "MG" },
      { name: "William Rodriguez", initials: "WR" },
      { name: "Patricia Lee", initials: "PL" },
      { name: "Christopher Walker", initials: "CW" },
    ];

    const contractIds = [
      "FU8434434",
      "FU8434435",
      "FU8434436",
      "FU8434437",
      "FU8434438",
      "CE8434434",
      "CE8434435",
      "CE8434436",
      "CE8434437",
      "CE8434438",
    ];

    const paymentMethods = [
      "Cash in store",
      "** 5758",
      "** 4242",
      "** 1234",
      "** 5678",
      "** 9012",
      "** 3456",
      "** 7890",
      "Bank transfer",
      "Check",
      "ACH",
      "Wire transfer",
    ];

    const badges = ["AN", "PN", "BN", "OK"];

    const amounts = [
      500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 7500,
      10000, 12500, 15000, 20000, 25000,
    ];

    // Start from recent date and go backwards
    let currentDate = new Date("2025-11-03");
    let runningBalances = {}; // Track balance per contract

    // Initialize balances for each contract
    contractIds.forEach((contractId) => {
      runningBalances[contractId] = 0;
    });

    for (let i = 1; i <= 200; i++) {
      // Random contract
      const contractId =
        contractIds[Math.floor(Math.random() * contractIds.length)];

      // Random beneficiary
      const beneficiary =
        beneficiaries[Math.floor(Math.random() * beneficiaries.length)];

      // Random badge
      const badge = badges[Math.floor(Math.random() * badges.length)];

      // Random payment method
      const paymentMethod =
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

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
      const period = Math.random() > 0.5 ? "PM" : "AM";

      const dateTime = `${month}/${String(day).padStart(
        2,
        "0"
      )}/${year} ${hours}:${String(minutes).padStart(2, "0")} ${period}`;

      payments.unshift({
        id: i,
        contractId,
        beneficiary: {
          name: beneficiary.name,
          badge,
          initials: beneficiary.initials,
        },
        dateTime,
        paymentMethod,
        amount,
        balance,
      });
    }

    return payments;
  })(),
  contracts: [
    {
      id: 1,
      type: "Funeral trust contract",
      contractNumber: "FU8434434",
      status: "Fully payed",
      role: "Owner",
      beneficiary: { name: "Marie Parker", badge: "PN", initials: "MP" },
      sharedWith: 5,
      totalAmount: 25000.0,
      balanceDue: 15000.0,
    },
    {
      id: 2,
      type: "Funeral insurance contract",
      contractNumber: "CE8434434",
      policyId: "INS-843434",
      insuranceCarrier: "HomesteadersLife Co.",
      role: "Owner",
      beneficiary: { name: "Marie Parker", badge: "PN", initials: "MP" },
      sharedWith: 5,
      totalAmount: 25000.0,
    },
  ],
  ownedProperty: (() => {
    const properties = [];

    const propertyTypes = [
      "Family burial",
      "Single burial",
      "Columbarium",
      "Cremation niche",
      "Mausoleum",
      "Garden plot",
      "Memorial bench",
      "Estate plot",
    ];

    const owners = [
      { name: "Luna Miller", initials: "LM" },
      { name: "Ken Parker", initials: "KP" },
      { name: "Marie Parker", initials: "MP" },
      { name: "John Smith", initials: "JS" },
      { name: "Sarah Johnson", initials: "SJ" },
      { name: "Michael Brown", initials: "MB" },
      { name: "Emily Davis", initials: "ED" },
      { name: "David Wilson", initials: "DW" },
      { name: "Jessica Martinez", initials: "JM" },
      { name: "Robert Anderson", initials: "RA" },
      { name: "Lisa Thompson", initials: "LT" },
      { name: "James White", initials: "JW" },
    ];

    const locations = [
      "Section A, Row 12",
      "Section B, Row 5",
      "Section C, Row 8",
      "East Garden, Block 3",
      "West Garden, Block 7",
      "North Hill, Plot 15",
      "South Valley, Plot 22",
      "Memorial Grove, Area 4",
      "Peaceful Meadow, Lot 18",
      "Serenity Garden, Plot 9",
      "Eternal Rest, Section D",
      "Tranquil Hills, Row 14",
      "Garden of Remembrance",
      "Veterans Memorial",
      "Sunset View, Block 6",
    ];

    const contractIds = [
      "CE8434434",
      "CE8434435",
      "CE8434436",
      "CE8434437",
      "CE8434438",
      "CE8434439",
      "CE8434440",
      "CE8434441",
      "CE8434442",
      "CE8434443",
    ];

    const statuses = ["Paid", "Active", "Reserved"];
    const badges = ["AN", "PN", "BN", "OK"];

    const images = [
      "https://images.unsplash.com/photo-1566305977571-5666677c6e98?w=400",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
      "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400",
      "https://images.unsplash.com/photo-1605116959016-b4e8afbbb7c5?w=400",
      "https://images.unsplash.com/photo-1571380401583-72ca84994796?w=400",
    ];

    // Generate properties - spanning several years
    const years = [2020, 2021, 2022, 2023, 2024, 2025];

    for (const year of years) {
      // Generate 8-12 properties per year
      const propertiesPerYear = Math.floor(Math.random() * 5) + 8;

      for (let i = 0; i < propertiesPerYear; i++) {
        const propertyType =
          propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
        const owner = owners[Math.floor(Math.random() * owners.length)];
        const location =
          locations[Math.floor(Math.random() * locations.length)];
        const contractId =
          contractIds[Math.floor(Math.random() * contractIds.length)];
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
            initials: owner.initials,
          },
          location,
          status,
          image,
          purchaseYear: year,
        });
      }
    }

    return properties.reverse(); // Most recent first
  })(),
  additionalInvoices: (() => {
    const services = [
      "Cleaning",
      "Maintenance",
      "FlowerArrangement",
      "MemorialService",
      "Transportation",
      "Catering",
      "Photography",
      "VideoRecording",
      "MusicServices",
      "PrintedMaterials",
      "Cremation",
      "Embalming",
      "CasketRental",
      "UrnsAndKeepsakes",
      "GraveMaintenance",
      "HeadstoneEngraving",
      "ObituaryNotices",
      "DeathCertificates",
      "MemorialCards",
      "ThankYouCards",
    ];

    const statuses = ["Payed", "Ongoing", "Pending", "Cancelled"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const invoices = [];

    for (let i = 1; i <= 100; i++) {
      const service = services[Math.floor(Math.random() * services.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const month = months[Math.floor(Math.random() * months.length)];
      const day = Math.floor(Math.random() * 28) + 1;
      const year = Math.random() > 0.3 ? 2025 : 2024;
      const amount = Math.floor(Math.random() * 5000) + 100;
      const fileSize = (Math.random() * 5 + 0.5).toFixed(1);
      const invoiceIdNum = 8400000 + i;

      invoices.push({
        id: i,
        fileName: `InvoiceFor${service}.pdf`,
        fileSize: `${fileSize}mb`,
        invoiceId: invoiceIdNum.toString(),
        paymentDue: `${month} ${String(day).padStart(2, "0")} ${year}`,
        status: status,
        amount: amount,
      });
    }

    return invoices;
  })(),
};

// All family members in a single collection
const familyMembers = [
  {
    id: 2,
    name: "Leia Organa",
    relationship: "Sister",
    phone: "+1 555 REBEL 777",
    email: "leia.organa@rebellion.org",
    accesses: [
      { id: "FU8434434", type: "viewer", label: "ID: FU8434434" },
      { id: "FU8434435", type: "viewer", label: "ID: FU8434435" },
      { type: "viewer", label: "My Wishes" },
    ],
    isStarred: true,
    isNextOfKin: false,
    initials: "LO",
  },
  {
    id: 3,
    name: "Han Solo",
    relationship: "Brother-in-law",
    phone: "+1 555 FCON 420",
    email: "han.solo@millenniumfalcon.com",
    accesses: [
      { id: "FU8434434", type: "viewer", label: "ID: FU8434434" },
      { type: "viewer", label: "My Wishes" },
    ],
    isStarred: true,
    isNextOfKin: false,
    initials: "HS",
  },
  {
    id: 4,
    name: "Chewbacca",
    relationship: "Co-pilot & Friend",
    phone: "+1 555 WOOKIE 190",
    email: "chewie@millenniumfalcon.com",
    accesses: [
      { id: "FU8434436", type: "viewer", label: "ID: FU8434436" },
      { id: "FU8434437", type: "viewer", label: "ID: FU8434437" },
      { type: "viewer", label: "My Wishes" },
    ],
    isStarred: false,
    isNextOfKin: false,
    initials: "CB",
  },
  {
    id: 5,
    name: "R2-D2",
    relationship: "Droid Companion",
    phone: "+1 555 BEEP BOOP",
    email: "r2d2@astromech.droid",
    accesses: [
      { id: "FU8434438", type: "viewer", label: "ID: FU8434438" },
      { type: "viewer", label: "My Wishes" },
    ],
    isStarred: false,
    isNextOfKin: false,
    initials: "R2",
  },
];

// Cemetery page mocked data
const cemeteryData = {
  properties: (() => {
    const names = [
      "Marie Parker",
      "John Smith",
      "Sarah Johnson",
      "Michael Davis",
      "Emily Wilson",
      "David Brown",
      "Jessica Taylor",
      "Robert Anderson",
      "Jennifer Martinez",
      "William Garcia",
    ];
    const badges = ["PN", "FN", "CN"];
    const statuses = ["In Trust", "Not Purchased", "Used"];
    const sections = [
      "Section A",
      "Section B",
      "Section C",
      "Section D",
      "East Garden",
      "West Garden",
      "North Wing",
      "South Wing",
    ];
    const propertyTypes = [
      "ES-B Lot",
      "Columbarium",
      "Memorial",
      "Garden Plot",
      "Mausoleum",
      "Crypt",
    ];
    const images = [
      "https://images.unsplash.com/photo-1566305977571-5666677c6e98?w=400",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
      "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400",
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    ];

    const properties = [];
    for (let i = 1; i <= 100; i++) {
      const beneficiaryName = names[Math.floor(Math.random() * names.length)];
      const initials = beneficiaryName
        .split(" ")
        .map((n) => n[0])
        .join("");
      const contractNum = 8434434 + i;
      const serviceNum = 8434434 + Math.floor(Math.random() * 50);

      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      const year = Math.random() > 0.5 ? 2025 : 2024;
      const hour = Math.floor(Math.random() * 12) + 1;
      const minute = Math.floor(Math.random() * 60);
      const ampm = Math.random() > 0.5 ? "AM" : "PM";

      properties.push({
        id: i,
        contractId: `CE${contractNum}`,
        name: `${
          propertyTypes[Math.floor(Math.random() * propertyTypes.length)]
        } ${100 + i}`,
        beneficiary: {
          name: beneficiaryName,
          badge: badges[Math.floor(Math.random() * badges.length)],
          initials: initials,
        },
        dateTime: `${month}/${day}/${year} ${hour}:${minute
          .toString()
          .padStart(2, "0")} ${ampm}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        serviceId: `FU${serviceNum}`,
        location: `${
          sections[Math.floor(Math.random() * sections.length)]
        }, Row ${Math.floor(Math.random() * 20) + 1}`,
        image: images[Math.floor(Math.random() * images.length)],
      });
    }
    return properties;
  })(),
  services: (() => {
    const names = [
      "Marie Parker",
      "John Smith",
      "Sarah Johnson",
      "Michael Davis",
      "Emily Wilson",
      "David Brown",
      "Jessica Taylor",
      "Robert Anderson",
      "Jennifer Martinez",
      "William Garcia",
      "Luna Miller",
      "John Doe",
      "Alice Smith",
      "Robert Johnson",
      "Emily Davis",
      "Ken Parker",
    ];
    const badges = ["PN", "FN", "CN", "AN"];
    const statuses = ["Paid", "Pending", "In Trust"];
    const serviceTypes = [
      "Installation of gravestone",
      "Cremation services",
      "Memorial plaque",
      "Special handling full service",
      "Headstone engraving",
      "Flower arrangement",
      "Memorial service",
      "Burial service",
      "Grave opening/closing",
      "Monument installation",
    ];
    const locations = [
      "Location",
      "Crematory A",
      "Garden Area",
      "Chapel B",
      "North Section",
      "South Wing",
      "Memorial Hall",
      "East Garden",
    ];
    const images = [
      "https://images.unsplash.com/photo-1566305977571-5666677c6e98?w=400",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
      "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400",
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    ];

    const services = [];
    for (let i = 1; i <= 100; i++) {
      const beneficiaryName = names[Math.floor(Math.random() * names.length)];
      const initials = beneficiaryName
        .split(" ")
        .map((n) => n[0])
        .join("");
      const contractNum = 8434434 + i;
      const serviceNum = 8434434 + Math.floor(Math.random() * 50);

      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      const year = Math.random() > 0.5 ? 2025 : 2024;
      const hour = Math.floor(Math.random() * 12) + 1;
      const minute = Math.floor(Math.random() * 60);
      const ampm = Math.random() > 0.5 ? "AM" : "PM";

      services.push({
        id: i,
        contractId: `CE${contractNum}`,
        name: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
        beneficiary: {
          name: beneficiaryName,
          badge: badges[Math.floor(Math.random() * badges.length)],
          initials: initials,
        },
        dateTime: `${month}/${day}/${year} ${hour}:${minute
          .toString()
          .padStart(2, "0")} ${ampm}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        serviceId: `FU${serviceNum}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        image: images[Math.floor(Math.random() * images.length)],
      });
    }
    return services;
  })(),
  merchandise: (() => {
    const names = [
      "Marie Parker",
      "John Smith",
      "Sarah Johnson",
      "Michael Davis",
      "Emily Wilson",
      "David Brown",
      "Jessica Taylor",
      "Robert Anderson",
      "Jennifer Martinez",
      "William Garcia",
      "Luna Miller",
      "John Doe",
      "Alice Smith",
      "Robert Johnson",
      "Emily Davis",
      "Ken Parker",
    ];
    const badges = ["PN", "FN", "CN", "AN"];
    const statuses = ["Paid", "Not Purchased", "Used"];
    const merchandiseTypes = [
      "Gravestone",
      "Monument",
      "Memorial plaque",
      "Paving slabs",
      "Headstone",
      "Urn",
      "Memorial bench",
      "Bronze marker",
      "Granite marker",
      "Memorial vase",
    ];
    const locations = [
      "San Francisco, CA",
      "Los Angeles, CA",
      "New York, NY",
      "Chicago, IL",
      "Houston, TX",
      "Phoenix, AZ",
      "Philadelphia, PA",
      "San Antonio, TX",
    ];
    const images = [
      "https://images.unsplash.com/photo-1566305977571-5666677c6e98?w=400",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
      "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400",
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    ];

    const merchandise = [];
    for (let i = 1; i <= 100; i++) {
      const beneficiaryName = names[Math.floor(Math.random() * names.length)];
      const initials = beneficiaryName
        .split(" ")
        .map((n) => n[0])
        .join("");
      const contractNum = 8434434 + i;
      const serviceNum = 8434434 + Math.floor(Math.random() * 50);

      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      const year = Math.random() > 0.5 ? 2025 : 2024;
      const hour = Math.floor(Math.random() * 12) + 1;
      const minute = Math.floor(Math.random() * 60);
      const ampm = Math.random() > 0.5 ? "AM" : "PM";

      merchandise.push({
        id: i,
        contractId: `CE${contractNum}`,
        name: merchandiseTypes[
          Math.floor(Math.random() * merchandiseTypes.length)
        ],
        beneficiary: {
          name: beneficiaryName,
          badge: badges[Math.floor(Math.random() * badges.length)],
          initials: initials,
        },
        dateTime: `${month}/${day}/${year} ${hour}:${minute
          .toString()
          .padStart(2, "0")} ${ampm}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        serviceId: `FU${serviceNum}`,
        location:
          Math.random() > 0.5
            ? locations[Math.floor(Math.random() * locations.length)]
            : null,
        image: images[Math.floor(Math.random() * images.length)],
      });
    }
    return merchandise;
  })(),
  certificates: [
    {
      id: 1,
      name: "Certificate of Sepulcher",
      fileName: "CertificateOfSepulcher_8434434.pdf",
      size: "2.4mb",
      propertyId: "8434434",
    },
    {
      id: 2,
      name: "Certificate of Sepulcher",
      fileName: "CertificateOfSepulcher_8434434_2.pdf",
      size: "2.4mb",
      propertyId: "8434434",
    },
  ],
  designationRights: [
    {
      id: 1,
      location: "WS-location lotspace",
      status: "Available",
      assignee: { name: "Marie Parker", initials: "MP" },
    },
    {
      id: 2,
      location: "WS-location lotspace",
      status: "Available",
      assignee: { name: "Marie Parker", initials: "MP" },
    },
    {
      id: 3,
      location: "WS-location lotspace",
      status: "Used",
      assignee: { name: "Marie Parker", initials: "MP" },
    },
  ],
  documents: [
    {
      id: 1,
      name: "Designation of Interment Rights",
      fileName: "DesignationOfIntermentRights.pdf",
      size: "2.4mb",
      propertyId: null,
    },
    {
      id: 2,
      name: "Certificate of Sepulcher",
      fileName: "CertificateOfSepulcher_8434434.pdf",
      size: "2.4mb",
      propertyId: "8434434",
    },
    {
      id: 3,
      name: "Certificate of Sepulcher",
      fileName: "CertificateOfSepulcher_8434434_2.pdf",
      size: "2.4mb",
      propertyId: "8434434",
    },
  ],
};

// Wallet page mocked data
const walletData = {
  contractPaymentMethods: [
    {
      contractId: "CE8434434",
      hasPaymentMethod: false,
      nextPaymentDue: "Sep 23, 2025",
    },
    {
      contractId: "FU8434434",
      hasPaymentMethod: true,
      paymentMethod: {
        type: "Bank account",
        holderName: "Scott Milli Miller",
        lastDigits: "012",
        icon: "bank",
      },
      nextPayment: {
        date: "December 13, 2025",
        amount: 2384.0,
      },
    },
  ],
  allMethods: [
    {
      id: 1,
      type: "Credit card",
      holderName: "Scott Miller",
      lastDigits: "5758",
      expiryDate: "12/2026",
      icon: "card",
    },
    {
      id: 2,
      type: "Credit card",
      holderName: "Scott Miller",
      lastDigits: "5758",
      expiryDate: "12/2026",
      icon: "card",
    },
    {
      id: 3,
      type: "Credit card",
      holderName: "Scott Miller",
      lastDigits: "5758",
      expiryDate: "12/2026",
      icon: "card",
    },
  ],
  legalDocuments: [
    {
      id: 1,
      name: "Authorization Agreement for...",
      fileName: "AuthorizationAgreement_2025.pdf",
      size: "2.4mb",
      uploadDate: "2025-01-15",
    },
    {
      id: 2,
      name: "Payment Terms and Conditions",
      fileName: "PaymentTerms_2025.pdf",
      size: "1.8mb",
      uploadDate: "2025-01-10",
    },
  ],
};

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Customer Care Center Demo Backend API",
    version: "1.0.0",
    endpoints: {
      profile: "/api/profile",
      family: "/api/family",
    },
  });
});

// Profile endpoints
app.get("/api/profile", (req, res) => {
  res.json({ success: true, data: profileData });
});

app.put("/api/profile", (req, res) => {
  // Update profile data with request body
  Object.assign(profileData, req.body);
  res.json({
    success: true,
    data: profileData,
    message: "Profile updated successfully",
  });
});

// Upload photo endpoint
app.post("/api/profile/photo", (req, res) => {
  const { photoUrl } = req.body;
  profileData.photoUrl = photoUrl;
  res.json({
    success: true,
    data: { photoUrl },
    message: "Photo uploaded successfully",
  });
});

// Family endpoint
app.get("/api/family", (req, res) => {
  // Organize members based on their flags
  const nextOfKin = familyMembers.find((m) => m.isNextOfKin) || null;
  const starredMembers = familyMembers.filter(
    (m) => !m.isNextOfKin && m.isStarred
  );
  const allMembers = familyMembers.filter(
    (m) => !m.isNextOfKin && !m.isStarred
  );

  const familyData = {
    nextOfKin,
    starredMembers,
    allMembers,
  };

  res.json({ success: true, data: familyData });
});

// Toggle star status for family member
app.patch("/api/family/:id/star", (req, res) => {
  const memberId = parseInt(req.params.id);

  // Find member in the collection
  const member = familyMembers.find((m) => m.id === memberId);

  if (!member) {
    return res
      .status(404)
      .json({ success: false, message: "Member not found" });
  }

  // Toggle the star status
  member.isStarred = !member.isStarred;

  res.json({ success: true, data: member, message: "Star status updated" });
});

// Add family member
app.post("/api/family", (req, res) => {
  const {
    status,
    firstName,
    lastName,
    familyStatus,
    email,
    phone,
    contractId,
  } = req.body;

  // Create initials
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  // Find contract
  const contract = contractsData.find((c) => c.id === parseInt(contractId));
  const contractNumber = contract ? contract.contractNumber : "";

  // Create new member
  const newMember = {
    id: familyMemberIdCounter++,
    name: `${firstName} ${lastName}`,
    relationship: familyStatus,
    phone: phone || "",
    email: email,
    accesses: [
      { id: contractNumber, type: "viewer", label: `ID: ${contractNumber}` },
      { type: "viewer", label: "My Wishes" },
    ],
    isStarred: false,
    isNextOfKin: false,
    initials: initials,
  };

  // Add to members collection
  familyMembers.push(newMember);

  res.json({
    success: true,
    data: newMember,
    message: "Family member added successfully",
  });
});

// Get contracts
app.get("/api/contracts", (req, res) => {
  res.json({ success: true, data: contractsData });
});

// Get balance data
app.get("/api/balance", (req, res) => {
  res.json({ success: true, data: balanceData });
});

// Get wallet data
app.get("/api/wallet", (req, res) => {
  res.json({ success: true, data: walletData });
});

// Get cemetery data
app.get("/api/cemetery", (req, res) => {
  res.json({ success: true, data: cemeteryData });
});

// Funeral data
const funeralData = {
  funeralServices: (() => {
    const names = [
      "Marie Parker",
      "John Smith",
      "Sarah Johnson",
      "Robert Williams",
      "Emily Davis",
    ];
    const badges = ["AN", "PN", "CN"];
    const statuses = ["In Trust", "Not Purchased", "Used", "Paid"];
    const serviceTypes = [
      "Transportation of the deceased",
      "Conduct of the funeral service",
      "Organization of cremation",
      "Preparation of documents",
      "Conduct of the funeral",
      "Memorial service coordination",
      "Graveside service",
      "Cremation service",
    ];
    const images = [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
      "https://images.unsplash.com/photo-1590650046871-92c887180603?w=400",
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400",
      "https://images.unsplash.com/photo-1590650213165-f9bb42984f9f?w=400",
      "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=400",
    ];
    const locations = [
      "San Francisco, CA",
      "Crematory A",
      "Garden Area",
      "Chapel B",
      "Memorial Hall",
    ];

    const services = [];
    for (let i = 1; i <= 100; i++) {
      const beneficiaryName = names[Math.floor(Math.random() * names.length)];
      const initials = beneficiaryName
        .split(" ")
        .map((n) => n[0])
        .join("");
      const contractNum = 8434434 + i;
      const serviceNum = 8434434 + Math.floor(Math.random() * 50);

      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      const year = 2025;
      const hour = Math.floor(Math.random() * 12) + 1;
      const minute = Math.floor(Math.random() * 60);
      const ampm = Math.random() > 0.5 ? "AM" : "PM";

      services.push({
        id: i,
        contractId: `CE${contractNum}`,
        name: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
        beneficiary: {
          name: beneficiaryName,
          badge: badges[Math.floor(Math.random() * badges.length)],
          initials,
        },
        dateTime: `${month}/${day}/${year} ${hour}:${
          minute < 10 ? "0" : ""
        }${minute} ${ampm}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        serviceId: `FU${serviceNum}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        image: images[Math.floor(Math.random() * images.length)],
      });
    }
    return services;
  })(),

  merchandise: (() => {
    const names = [
      "Marie Parker",
      "John Smith",
      "Sarah Johnson",
      "Robert Williams",
      "Emily Davis",
    ];
    const badges = ["AN", "PN", "CN"];
    const statuses = ["In Trust", "Not Purchased", "Used", "Paid"];
    const merchandiseTypes = [
      "Coffins",
      "Urn for ashes",
      "Funeral clothing",
      "Flower basket",
      "Memorial plaque",
      "Casket",
      "Prayer cards",
      "Guest book",
    ];
    const images = [
      "https://images.unsplash.com/photo-1614267157481-ca2b81ac6fcc?w=400",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=400",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400",
      "https://images.unsplash.com/photo-1563207153-f403bf289096?w=400",
    ];
    const locations = [
      "San Francisco, CA",
      "Garden Area",
      "Chapel B",
      null,
      null,
    ];

    const merchandise = [];
    for (let i = 1; i <= 100; i++) {
      const beneficiaryName = names[Math.floor(Math.random() * names.length)];
      const initials = beneficiaryName
        .split(" ")
        .map((n) => n[0])
        .join("");
      const contractNum = 8434434 + i;
      const serviceNum = 8434434 + Math.floor(Math.random() * 50);

      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      const year = 2025;
      const hour = Math.floor(Math.random() * 12) + 1;
      const minute = Math.floor(Math.random() * 60);
      const ampm = Math.random() > 0.5 ? "AM" : "PM";

      merchandise.push({
        id: i,
        contractId: `CE${contractNum}`,
        name: merchandiseTypes[
          Math.floor(Math.random() * merchandiseTypes.length)
        ],
        beneficiary: {
          name: beneficiaryName,
          badge: badges[Math.floor(Math.random() * badges.length)],
          initials,
        },
        dateTime: `${month}/${day}/${year} ${hour}:${
          minute < 10 ? "0" : ""
        }${minute} ${ampm}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        serviceId: `FU${serviceNum}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        image: images[Math.floor(Math.random() * images.length)],
      });
    }
    return merchandise;
  })(),
};

app.get("/api/funeral", (req, res) => {
  res.json({ success: true, data: funeralData });
});

// Set/Assign Next of Kin
app.post("/api/family/next-of-kin", (req, res) => {
  const { memberId, email } = req.body;

  if (memberId) {
    // First, clear any existing next of kin
    familyMembers.forEach((m) => (m.isNextOfKin = false));

    // Find and assign the member as next of kin
    const member = familyMembers.find((m) => m.id === memberId);

    if (member) {
      member.isNextOfKin = true;
      return res.json({
        success: true,
        data: member,
        message: "Next of kin assigned successfully",
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }
  } else if (email) {
    // For now, just show that email invite will be sent (not actually implemented)
    // In a real app, this would send an email invitation
    return res.json({ success: true, message: "Invitation sent to " + email });
  }

  return res
    .status(400)
    .json({ success: false, message: "Either memberId or email is required" });
});

// Update member accesses
app.patch("/api/family/:id/accesses", (req, res) => {
  const memberId = parseInt(req.params.id);
  const { contracts } = req.body;

  // Find the member
  const member = familyMembers.find((m) => m.id === memberId);

  if (!member) {
    return res
      .status(404)
      .json({ success: false, message: "Member not found" });
  }

  // Update accesses based on contracts array
  const newAccesses = [
    ...contracts.map((contractNumber) => ({
      id: contractNumber,
      type: "viewer",
      label: `ID: ${contractNumber}`,
    })),
    { type: "viewer", label: "My Wishes" },
  ];

  member.accesses = newAccesses;

  res.json({
    success: true,
    data: member,
    message: "Accesses updated successfully",
  });
});

// Delete family member
app.delete("/api/family/:id", (req, res) => {
  const memberId = parseInt(req.params.id);

  // Find the member
  const member = familyMembers.find((m) => m.id === memberId);

  if (!member) {
    return res
      .status(404)
      .json({ success: false, message: "Member not found" });
  }

  // If it's the next of kin, just remove the flag (don't delete the member)
  if (member.isNextOfKin) {
    member.isNextOfKin = false;
    return res.json({
      success: true,
      message: "Next of kin removed successfully",
    });
  }

  // Otherwise, actually delete the member from the array
  const memberIndex = familyMembers.findIndex((m) => m.id === memberId);
  familyMembers.splice(memberIndex, 1);

  return res.json({
    success: true,
    message: "Family member deleted successfully",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
