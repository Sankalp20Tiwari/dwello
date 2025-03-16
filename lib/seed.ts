import { ID } from "react-native-appwrite";
import { databases, config } from "./appwrite";
import {
  agentImages,
  galleryImages,
  propertiesImages,
  reviewImages,
} from "./data";

// Realistic name lists for agents, properties, and reviewers
const agentNames = [
  "John Anderson", "Sophia Williams", "Oliver Brown", "Emily Wilson", "Liam Martinez", 
  "Ava Moore", "James Taylor", "Isabella Clark", "Mason Lee", "Charlotte Davis"
];

const propertyNames = [
  "Sunset Ridge Villa", "Lakeview Mansion", "Greenwood Heights", "Seaside Retreat", 
  "Rosewood Manor", "Birchwood Apartments", "Silver Oaks Estate", "Willowbrook Residence", 
  "Pinehill Cottage", "Blue Lagoon Towers"
];

const reviewerNames = [
  "Jessica Miller", "Ethan Walker", "Sophia Martinez", "Mason Rodriguez", 
  "Charlotte Green", "Noah Hall", "Ava Young", "Benjamin Scott", "Harper King", 
  "Alexander Adams"
];

const COLLECTIONS = {
  AGENT: config.agentsCollectionId,
  REVIEWS: config.reviewsCollectionId,
  GALLERY: config.galleriesCollectionId,
  PROPERTY: config.propertiesCollectionId,
};

const propertyTypes = [
  "House",
  "Townhomes",
  "Condos",
  "Duplexes",
  "Studios",
  "Villa",
  "Apartments",
  "Others",
];

const facilities = [
  "Laundry",
  "Car Parking",
  "Sports Center",
  "Cutlery",
  "Gym",
  "Swimming pool",
  "Wifi",
  "Pet Center",
];

// Review Templates
const reviewTemplates = [
  "The property was fantastic! I enjoyed every moment, especially the modern design and spacious rooms. The location was perfect for exploring the city.",
  "Absolutely loved our stay! The house was well-maintained and the amenities were perfect for our needs. The agent was very helpful in showing us around.",
  "This property exceeded our expectations. It was clean, cozy, and had everything we needed. Highly recommend it to anyone looking for a peaceful getaway.",
  "Great property! The views were breathtaking, and the neighborhood was quiet and safe. Would definitely stay here again if we return to the area.",
  "We had an amazing experience. The property had a welcoming vibe, and the amenities were top-notch. The agent was responsive and always available to assist us.",
  "The property was beautiful and comfortable, perfect for a family vacation. We loved the large garden and pool area. The agent was friendly and made us feel at home."
];

// Property Description Templates
const propertyDescriptions = [
  "Nestled in the heart of a vibrant neighborhood, this beautiful property offers modern amenities, a spacious floor plan, and a large backyard. Perfect for families or those who love to entertain guests.",
  "A charming and cozy property located in a serene part of town. This home features a bright and airy interior, a well-maintained garden, and all the amenities you need for comfortable living.",
  "This stunning property boasts a contemporary design with high-end finishes, large windows that flood the home with natural light, and a beautiful outdoor space perfect for relaxation and entertaining.",
  "Located just minutes from the city center, this property combines the best of both worlds—urban convenience and peaceful living. With ample space, a large kitchen, and a cozy living room, it's ideal for modern living.",
  "This luxurious property is a true gem with exquisite design, high ceilings, and a spacious layout. The stunning kitchen and modern bathrooms make this the perfect place for those seeking comfort and style.",
  "A modern and stylish property that offers everything you need for a comfortable lifestyle. The spacious living areas, gourmet kitchen, and private backyard provide the perfect setting for relaxing and entertaining."
];

// Realistic pricing based on area (larger area = higher price)
const calculatePrice = (propertyType: string, area: number): number => {
  let basePrice: number;
  
  // Set base prices for different property types
  switch (propertyType) {
    case "Villa":
    case "Mansion":
      basePrice = 500000; // High-end properties like villas and mansions
      break;
    case "House":
    case "Duplexes":
    case "Apartments":
      basePrice = 200000; // Mid-range properties like houses and apartments
      break;
    case "Townhomes":
      basePrice = 150000; // Townhomes tend to be moderately priced
      break;
    case "Condos":
      basePrice = 100000; // Condos are typically less expensive
      break;
    case "Studios":
      basePrice = 80000; // Smaller properties like studios
      break;
    default:
      basePrice = 120000; // Default base price
  }

  // Apply area-based multiplier for larger areas
  let areaMultiplier = 1 + (area / 1000) * 0.1; // Increase price by 10% for each 1000 square feet
  return Math.round(basePrice * areaMultiplier);
};

function getRandomSubset<T>(array: T[], minItems: number, maxItems: number): T[] {
  if (minItems > maxItems) {
    throw new Error("minItems cannot be greater than maxItems");
  }
  if (minItems < 0 || maxItems > array.length) {
    throw new Error(
      "minItems or maxItems are out of valid range for the array"
    );
  }

  // Generate a random size for the subset within the range [minItems, maxItems]
  const subsetSize =
    Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

  // Create a copy of the array to avoid modifying the original
  const arrayCopy = [...array];

  // Shuffle the array copy using Fisher-Yates algorithm
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[randomIndex]] = [
      arrayCopy[randomIndex],
      arrayCopy[i],
    ];
  }

  // Return the first `subsetSize` elements of the shuffled array
  return arrayCopy.slice(0, subsetSize);
}

async function seed() {
  try {
    // Clear existing data from all collections
    for (const key in COLLECTIONS) {
      const collectionId = COLLECTIONS[key as keyof typeof COLLECTIONS];
      const documents = await databases.listDocuments(
        config.databaseId!,
        collectionId!
      );
      for (const doc of documents.documents) {
        await databases.deleteDocument(
          config.databaseId!,
          collectionId!,
          doc.$id
        );
      }
    }

    console.log("Cleared all existing data.");

    // Seed Agents with more realistic names
    const agents = [];
    for (let i = 0; i < 5; i++) {
      const agentName = agentNames[Math.floor(Math.random() * agentNames.length)];
      const agentEmail = `${agentName.replace(" ", "").toLowerCase()}@realty.com`;
      const agent = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.AGENT!,
        ID.unique(),
        {
          name: agentName,
          email: agentEmail,
          avatar: agentImages[Math.floor(Math.random() * agentImages.length)],
        }
      );
      agents.push(agent);
    }
    console.log(`Seeded ${agents.length} agents.`);

    // Seed Reviews with realistic and varied content
    const reviews = [];
    for (let i = 0; i < 20; i++) {
      const reviewerName = reviewerNames[Math.floor(Math.random() * reviewerNames.length)];
      const reviewText = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
      const review = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.REVIEWS!,
        ID.unique(),
        {
          name: reviewerName,
          avatar: reviewImages[Math.floor(Math.random() * reviewImages.length)],
          review: reviewText,
          rating: Math.floor(Math.random() * 5) + 1, // Rating between 1 and 5
        }
      );
      reviews.push(review);
    }
    console.log(`Seeded ${reviews.length} reviews.`);

    // Seed Galleries
    const galleries = [];
    for (const image of galleryImages) {
      const gallery = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.GALLERY!,
        ID.unique(),
        { image }
      );
      galleries.push(gallery);
    }

    console.log(`Seeded ${galleries.length} galleries.`);

    // Seed Properties with more realistic names, addresses, and pricing
    for (let i = 1; i <= 20; i++) {
      const assignedAgent = agents[Math.floor(Math.random() * agents.length)];
      const assignedReviews = getRandomSubset(reviews, 5, 7); // 5 to 7 reviews
      const assignedGalleries = getRandomSubset(galleries, 3, 8); // 3 to 8 galleries

      const selectedFacilities = facilities
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * facilities.length) + 1);

      const image =
        propertiesImages.length - 1 >= i
          ? propertiesImages[i]
          : propertiesImages[
              Math.floor(Math.random() * propertiesImages.length)
            ];

      const propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
      const address = `123 ${propertyName.split(" ")[0]} Street, ${propertyName.split(" ")[1]} City`;

      // Random property description
      const description = propertyDescriptions[Math.floor(Math.random() * propertyDescriptions.length)];

      const area = Math.floor(Math.random() * 2500) + 500; // Random area between 500 and 3000 sq ft
      const price = calculatePrice(propertyTypes[Math.floor(Math.random() * propertyTypes.length)], area);

      const property = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.PROPERTY!,
        ID.unique(),
        {
          name: propertyName,
          type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
          description: description,
          address: address,
          geolocation: `192.168.1.${i}, 192.168.1.${i}`,
          price: price, // Realistic price
          area: area,
          bedrooms: Math.floor(Math.random() * 5) + 1,
          bathrooms: Math.floor(Math.random() * 5) + 1,
          rating: Math.floor(Math.random() * 5) + 1,
          facilities: selectedFacilities,
          image: image,
          agent: assignedAgent.$id,
          reviews: assignedReviews.map((review) => review.$id),
          gallery: assignedGalleries.map((gallery) => gallery.$id),
        }
      );

      console.log(`Seeded property: ${property.name}`);
    }

    console.log("Data seeding completed.");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

export default seed;

