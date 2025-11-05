import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
const PORT = process.env.PORT || 3000;

// Multer configuration for file uploads (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Only accept PDF files
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/example-pdfs", express.static("pdf"));
app.use("/img", express.static("img"));

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

// Uploaded documents storage (in-memory)
let uploadedDocuments = [];
let documentIdCounter = 1;

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

    // Generate 200 unique contract IDs (150 funeral, 50 cemetery)
    const contractIds = [];

    // Add 150 funeral contracts
    for (let i = 1; i <= 150; i++) {
      contractIds.push(`FU${String(1000 + i).padStart(4, "0")}`);
    }

    // Add 50 cemetery contracts
    for (let i = 1; i <= 50; i++) {
      contractIds.push(`CE${String(2000 + i).padStart(4, "0")}`);
    }

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

    // Generate 200 unique payments (one per contract)
    for (let i = 0; i < 200; i++) {
      // Each payment gets its own unique contract ID
      const contractId = contractIds[i];

      // Select beneficiary
      const beneficiary = beneficiaries[i % beneficiaries.length];

      // Rotate through badges
      const badge = badges[i % badges.length];

      // Rotate through payment methods
      const paymentMethod = paymentMethods[i % paymentMethods.length];

      // Generate varied amounts (between $100 and $30,000)
      const baseAmounts = [
        100, 250, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500,
        5000, 6000, 7500, 10000, 12500, 15000, 20000, 25000, 30000,
      ];
      const amount = baseAmounts[i % baseAmounts.length];

      // Simple incremental balance
      const balance = amount * (i + 1);

      // Generate unique dates
      const paymentDate = new Date("2025-11-03");
      paymentDate.setDate(paymentDate.getDate() - Math.floor(i / 3));
      paymentDate.setHours(23 - (i % 24));
      paymentDate.setMinutes(i % 60);

      const month = paymentDate.getMonth() + 1;
      const day = paymentDate.getDate();
      const year = paymentDate.getFullYear();
      const hours = paymentDate.getHours() % 12 || 12;
      const minutes = paymentDate.getMinutes();
      const period = paymentDate.getHours() >= 12 ? "PM" : "AM";

      const dateTime = `${month}/${String(day).padStart(
        2,
        "0"
      )}/${year} ${hours}:${String(minutes).padStart(2, "0")} ${period}`;

      payments.push({
        id: `PAY-${String(i + 1).padStart(6, "0")}`,
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
      contractNumber: "FU8434433",
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
    {
      id: 3,
      type: "Cemetery contract",
      contractNumber: "CE8434435",
      status: "Active",
      role: "Next of Kin",
      beneficiary: { name: "Ken Parker", badge: "PN", initials: "KP" },
      sharedWith: 3,
      totalAmount: 18000.0,
      balanceDue: 5000.0,
    },
    {
      id: 4,
      type: "Funeral trust contract",
      contractNumber: "FU8434436",
      status: "Pending",
      role: "Beneficiary",
      beneficiary: { name: "Luna Miller", badge: "PN", initials: "LM" },
      sharedWith: 2,
      totalAmount: 30000.0,
      balanceDue: 20000.0,
    },
    {
      id: 5,
      type: "Cemetery contract",
      contractNumber: "CE8434437",
      status: "Fully payed",
      role: "Owner",
      beneficiary: { name: "John Smith", badge: "PN", initials: "JS" },
      sharedWith: 4,
      totalAmount: 22000.0,
      balanceDue: 0,
    },
    {
      id: 6,
      type: "Funeral insurance contract",
      contractNumber: "FU8434438",
      policyId: "INS-843435",
      insuranceCarrier: "FamilyLife Insurance",
      role: "Owner",
      beneficiary: { name: "Sarah Johnson", badge: "PN", initials: "SJ" },
      sharedWith: 6,
      totalAmount: 28000.0,
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

    const image = "/img/owned_property_picture.png";

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
    const image = "/img/my_service_cemetery_property.png";

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
        image,
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
    const image = "/img/my_service_cemetery_cem_services.png";

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
        image,
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
    const image = "/img/my_service_cemetery_cem_services_merchandise.png";

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
        image,
      });
    }
    return merchandise;
  })(),
  certificates: [
    {
      id: 1,
      name: "Certificate of Sepulcher 1",
      fileName: "my_services_cemetery_certificates_of_sepulcher_1.pdf",
      size: "301kb",
      propertyId: "8434434",
    },
    {
      id: 2,
      name: "Certificate of Sepulcher 2",
      fileName: "my_services_cemetery_certificates_of_sepulcher_2.pdf",
      size: "301kb",
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
      name: "Cemetery Document 1",
      fileName: "my_services_cemetery_doc_1.pdf",
      size: "301kb",
      propertyId: null,
    },
    {
      id: 2,
      name: "Cemetery Document 2",
      fileName: "my_services_cemetery_doc_2.pdf",
      size: "301kb",
      propertyId: "8434434",
    },
    {
      id: 3,
      name: "Cemetery Document 3",
      fileName: "my_services_cemetery_doc_3.pdf",
      size: "301kb",
      propertyId: "8434434",
    },
  ],
};

// Wallet page mocked data
const walletData = {
  contractPaymentMethods: [
    {
      contractId: "CE8434434",
      paymentMethodId: null, // No payment method assigned
      nextPaymentDue: "Sep 23, 2025",
    },
    {
      contractId: "FU8434434",
      paymentMethodId: 2, // References payment method with id: 2 from allMethods
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
      lastDigits: "4242",
      expiryDate: "08/2027",
      icon: "card",
    },
    {
      id: 2,
      type: "Bank account",
      holderName: "Scott Milli Miller",
      lastDigits: "789",
      icon: "bank",
    },
    {
      id: 3,
      type: "Credit card",
      holderName: "Marie S. Miller",
      lastDigits: "5758",
      expiryDate: "12/2026",
      icon: "card",
    },
  ],
  legalDocuments: [
    {
      id: 1,
      name: "Wallet Legal Document 1",
      fileName: "my_services_wallet_legal_document_1.pdf",
      size: "301kb",
      uploadDate: "2025-11-04",
    },
    {
      id: 2,
      name: "Wallet Legal Document 2",
      fileName: "my_services_wallet_legal_document_2.pdf",
      size: "301kb",
      uploadDate: "2025-11-04",
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

// Add payment method
app.post("/api/wallet/payment-method", (req, res) => {
  const { type, formData } = req.body;

  let newMethod;

  if (type === "card") {
    // Generate last 4 digits from card number
    const lastDigits = formData.cardNumber.slice(-4);

    newMethod = {
      id: walletData.allMethods.length + 1,
      type: "Credit card",
      holderName: formData.cardholderName,
      lastDigits: lastDigits,
      expiryDate: formData.endDate,
      icon: "card",
    };
  } else if (type === "bank") {
    // Get last 3 digits (mock)
    const lastDigits = "012";

    newMethod = {
      id: walletData.allMethods.length + 1,
      type: "Bank account",
      holderName: formData.fullLegalName,
      lastDigits: lastDigits,
      icon: "bank",
    };
  }

  walletData.allMethods.push(newMethod);

  res.json({
    success: true,
    data: newMethod,
    message: "Payment method added successfully",
  });
});

// Update payment method
app.put("/api/wallet/payment-method/:id", (req, res) => {
  const methodId = parseInt(req.params.id);
  const { type, formData } = req.body;

  const index = walletData.allMethods.findIndex(method => method.id === methodId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Payment method not found",
    });
  }

  const existingMethod = walletData.allMethods[index];
  let updatedMethod;

  if (type === "card") {
    // If card number is masked (contains *), keep existing lastDigits
    const isMasked = formData.cardNumber.includes('*');
    const lastDigits = isMasked ? existingMethod.lastDigits : formData.cardNumber.slice(-4);

    updatedMethod = {
      id: methodId,
      type: "Credit card",
      holderName: formData.cardholderName,
      lastDigits: lastDigits,
      expiryDate: formData.endDate,
      icon: "card",
    };
  } else if (type === "bank") {
    const lastDigits = existingMethod.lastDigits || "012";

    updatedMethod = {
      id: methodId,
      type: "Bank account",
      holderName: formData.fullLegalName,
      lastDigits: lastDigits,
      icon: "bank",
    };
  }

  walletData.allMethods[index] = updatedMethod;

  res.json({
    success: true,
    data: updatedMethod,
    message: "Payment method updated successfully",
  });
});

// Assign payment method to contract
app.post("/api/wallet/contract/:contractId/assign-payment", (req, res) => {
  const contractId = req.params.contractId;
  const { methodId } = req.body;

  // Find the contract
  const contract = walletData.contractPaymentMethods.find(c => c.contractId === contractId);

  if (!contract) {
    return res.status(404).json({
      success: false,
      message: "Contract not found",
    });
  }

  // Find the payment method
  const method = walletData.allMethods.find(m => m.id === methodId);

  if (!method) {
    return res.status(404).json({
      success: false,
      message: "Payment method not found",
    });
  }

  // Assign the payment method ID to the contract
  contract.paymentMethodId = methodId;

  // Add nextPayment object if it doesn't exist
  if (!contract.nextPayment) {
    contract.nextPayment = {
      date: contract.nextPaymentDue || "December 13, 2025",
      amount: 2384.0,
    };
  }

  res.json({
    success: true,
    message: "Payment method assigned to contract successfully",
    data: contract,
  });
});

// Remove payment method from contract
app.delete("/api/wallet/contract/:contractId/payment", (req, res) => {
  const contractId = req.params.contractId;

  // Find the contract
  const contract = walletData.contractPaymentMethods.find(c => c.contractId === contractId);

  if (!contract) {
    return res.status(404).json({
      success: false,
      message: "Contract not found",
    });
  }

  // Remove the payment method from the contract
  contract.paymentMethodId = null;
  delete contract.nextPayment;

  res.json({
    success: true,
    message: "Payment method removed from contract successfully",
    data: contract,
  });
});

// Delete payment method
app.delete("/api/wallet/payment-method/:id", (req, res) => {
  const methodId = parseInt(req.params.id);

  const index = walletData.allMethods.findIndex(method => method.id === methodId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Payment method not found",
    });
  }

  // Remove this payment method from any contracts using it
  walletData.contractPaymentMethods.forEach(contract => {
    if (contract.paymentMethodId === methodId) {
      contract.paymentMethodId = null;
      delete contract.nextPayment;
    }
  });

  walletData.allMethods.splice(index, 1);

  res.json({
    success: true,
    message: "Payment method deleted successfully",
  });
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
    const image = "/img/my_services_funeral_fun_service.png";
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
        image,
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
    const image = "/img/my_services_funeral_fun_merchandise.png";
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
        image,
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

// Upload document
app.post("/api/documents/upload", (req, res) => {
  upload.single("document")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File size too large. Maximum size is 10MB",
          });
        }
      }
      return res.status(400).json({
        success: false,
        message: err.message || "Failed to upload document",
      });
    }

    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const document = {
        id: documentIdCounter++,
        name: req.file.originalname,
        size: `${(req.file.size / (1024 * 1024)).toFixed(1)}mb`,
        mimeType: req.file.mimetype,
        buffer: req.file.buffer,
        uploadedAt: new Date().toISOString(),
        status: "Pending",
      };

      uploadedDocuments.push(document);

      res.json({
        success: true,
        message: "Document uploaded successfully",
        data: {
          id: document.id,
          name: document.name,
          size: document.size,
          uploadedAt: document.uploadedAt,
          status: document.status,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to upload document" });
    }
  });
});

// Get all uploaded documents
app.get("/api/documents", (req, res) => {
  const documents = uploadedDocuments.map((doc) => ({
    id: doc.id,
    name: doc.name,
    size: doc.size,
    uploadedAt: doc.uploadedAt,
    status: doc.status,
  }));

  res.json({ success: true, data: documents });
});

// Download/view document
app.get("/api/documents/:id", (req, res) => {
  const documentId = parseInt(req.params.id);
  const document = uploadedDocuments.find((doc) => doc.id === documentId);

  if (!document) {
    return res
      .status(404)
      .json({ success: false, message: "Document not found" });
  }

  res.setHeader("Content-Type", document.mimeType);
  res.setHeader("Content-Disposition", `inline; filename="${document.name}"`);
  res.send(document.buffer);
});

// Download document (force download)
app.get("/api/documents/:id/download", (req, res) => {
  const documentId = parseInt(req.params.id);
  const document = uploadedDocuments.find((doc) => doc.id === documentId);

  if (!document) {
    return res
      .status(404)
      .json({ success: false, message: "Document not found" });
  }

  res.setHeader("Content-Type", document.mimeType);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${document.name}"`
  );
  res.send(document.buffer);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
