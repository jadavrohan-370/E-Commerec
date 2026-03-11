const categories = [
  'Air Conditioner', 'Television', 'Refrigerator', 'Washing Machine', 'Microwave Oven', 'Laptop', 'Mobile Phone', 'Speakers', 'Smart Watch'
];

const categoryImages = {
  'Air Conditioner': [
    'https://images.unsplash.com/photo-1585338107529-13afc5f0171f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591185473233-2999b5a14643?q=80&w=800&auto=format&fit=crop'
  ],
  'Television': [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop'
  ],
  'Refrigerator': [
    'https://images.unsplash.com/photo-1571175439180-6ac6043bc281?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop'
  ],
  'Washing Machine': [
    'https://images.unsplash.com/photo-1626806819282-2c13b3ad5e81?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=800&auto=format&fit=crop'
  ],
  'Microwave Oven': [
    'https://images.unsplash.com/photo-1585659722982-7d634f37a851?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574265366533-547ca9539796?q=80&w=800&auto=format&fit=crop'
  ],
  'Laptop': [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517336713914-89b9388c0ef5?q=80&w=800&auto=format&fit=crop'
  ],
  'Mobile Phone': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=800&auto=format&fit=crop'
  ],
  'Speakers': [
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=800&auto=format&fit=crop'
  ],
  'Smart Watch': [
    'https://images.unsplash.com/photo-1544117518-30df16413a48?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508685096489-7aacd1808068?q=80&w=800&auto=format&fit=crop'
  ]
};

const brands = {
  'Air Conditioner': ['Samsung', 'LG', 'Daikin', 'Blue Star', 'Voltas'],
  'Television': ['Sony', 'Samsung', 'LG', 'TCL', 'Xiaomi'],
  'Refrigerator': ['Samsung', 'LG', 'Whirlpool', 'Haier', 'Godrej'],
  'Washing Machine': ['Samsung', 'LG', 'IFB', 'Bosch', 'Whirlpool'],
  'Microwave Oven': ['Samsung', 'LG', 'Panasonic', 'IFB', 'Morphy Richards'],
  'Laptop': ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS'],
  'Mobile Phone': ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi'],
  'Speakers': ['Bose', 'Sony', 'JBL', 'Marshall', 'Sonos'],
  'Smart Watch': ['Apple', 'Samsung', 'Garmin', 'Fossil', 'Xiaomi']
};

const subCategories = {
  'Air Conditioner': ['Split AC', 'Window AC'],
  'Television': ['LED TV', 'OLED TV', 'Smart TV'],
  'Refrigerator': ['Single Door', 'Double Door', 'Side-by-Side'],
  'Washing Machine': ['Front Load', 'Top Load'],
  'Microwave Oven': ['Solo', 'Grill', 'Convection'],
  'Laptop': ['Business', 'Gaming', 'Ultrabook'],
  'Mobile Phone': ['Flagship', 'Mid-range', 'Budget'],
  'Speakers': ['Bluetooth', 'Home Theatre', 'Portable'],
  'Smart Watch': ['Fitness', 'Luxury', 'Casual']
};

export const generateProducts = (count = 1000, adminId) => {
  const products = [];
  
  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[category][Math.floor(Math.random() * brands[category].length)];
    const subCat = subCategories[category][Math.floor(Math.random() * subCategories[category].length)];
    const price = Math.floor(Math.random() * 150000) + 5000;
    const discountPrice = Math.floor(price * 0.85); // 15% random discount

    // Select category specific images
    const images = categoryImages[category] || [
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800&auto=format&fit=crop'
    ];

    products.push({
      user: adminId,
      name: `${brand} ${subCat} ${i}`,
      brand,
      category,
      subCategory: subCat,
      price,
      discountPrice,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 to 5.0 for better feel
      numberOfReviews: Math.floor(Math.random() * 500) + 50,
      stock: Math.floor(Math.random() * 100),
      images: images,
      description: `Premium ${brand} ${category} featuring latest ${subCat} technology. Built for performance and reliability in modern electronics standards. Includes high-efficiency components and sleek design.`,
      warranty: `${Math.floor(Math.random() * 2) + 1} Year Comprehensive Warranty`,
      specifications: {
        'Energy Rating': `${Math.floor(Math.random() * 3) + 3} Star`,
        'Year of Release': '2025',
        'Model Number': `EL-${i}-${brand.substring(0,2).toUpperCase()}`,
        'Connectivity': 'Smart Wi-Fi Enabled',
        'Color': 'Premium Metallic'
      },
      salesCount: Math.floor(Math.random() * 1000),
      viewsCount: Math.floor(Math.random() * 5000),
    });
  }
  
  return products;
};
