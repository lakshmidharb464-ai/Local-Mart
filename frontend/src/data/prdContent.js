export const PRD_DATA = {
  title: "Green Basket / Local Farm PRD Specifications",
  version: "1.0",
  projectType: "Full Stack Farm-to-Customer Marketplace",
  problemStatement: {
    farmers: [
      "Dependence on middlemen selling at low prices",
      "Receiving less than 30% of end consumer dollar",
      "No direct market access to urban buyers",
      "Food waste due to unsold perishable crops"
    ],
    customers: [
      "Inflated prices caused by multiple middleman markups",
      "Lack of freshness (produce stored for days/weeks)",
      "No transparency on origin farmer or chemical usage",
      "Disorganized local farm delivery"
    ]
  },
  proposedSolution: "Farmer → Green Basket / Local Farm Platform → Customer (Eliminates unnecessary middlemen so farmers earn 80% and customers save 20%).",
  roles: [
    {
      role: "Customer",
      key: "Customer",
      description: "Discovers fresh farm produce, places orders directly with farmers, tracks live delivery, leaves reviews.",
      features: ["Product Search & Filter", "Cart & Direct Checkout", "Order Tracking", "Farmer Profiles"]
    },
    {
      role: "Farmer",
      key: "Farmer",
      description: "Lists crops/produce, updates real-time stock & harvest dates, accepts orders, monitors earnings dashboard.",
      features: ["Add/Edit Product Listings", "Stock Management", "Order Fulfillment Status", "Earnings & Payout Analytics"]
    },
    {
      role: "Delivery Partner",
      key: "Delivery",
      description: "Accepts nearby farm delivery tasks, updates shipment milestones, navigates to customer locations.",
      features: ["Available Pickup Tasks", "Route Navigation", "Delivery Status Update", "Delivery Earnings Tracker"]
    },
    {
      role: "Admin",
      key: "Admin",
      description: "Platform controller verifying farmers, auditing products, managing platform fees, viewing ecosystem reports.",
      features: ["Farmer KYC Verification", "Global User & Product Audit", "Delivery Monitoring", "System Financial Reports"]
    }
  ],
  techStack: {
    frontend: ["React (JSX)", "Tailwind CSS", "Vite", "Context API"],
    backend: ["Node.js", "Express.js", "MySQL Database", "JWT Authentication"],
    architecture: "Modular RESTful micro-service layers with role-based routing"
  }
};
