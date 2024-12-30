require('dotenv').config()
const Shopify = require('shopify-api-node')
const cors = require('cors');
// const Shopify = require('shopify')
// const Shopify = require('@shopify/shopify-api').default;

const express = require('express');

const app = express();
app.use(express.json());



// List of allowed origins
const allowedOrigins = [
  'https://kktest0001.myshopify.com',
  'https://www.w3schools.com'
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_SHOP_NAME,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_PASSWORD
})

app.get('/', async (req, res) => {
  res.json({ success: true, message:"working" });
  console.log({ success: true, message:"working" })
});

app.get('/create-product', async (req, res) => {
    const newProduct = {
        title: 'New Product2',
        body_html: '<strong>Good product 2</strong>',
        vendor: 'Your Vendor Name',
        product_type: 'Your Product Type',
        tags: ['tag1', 'tag2'],
        variants: [
          {
            option1: 'Default Title',
            price: '200',
            sku: '323',
            inventory_quantity: 100
          }
        ],
        images: [
          {
            src: 'https://example.com/path/to/image.jpg'
          }
        ]
      }
          try {
        const createdProduct = await shopify.product.create(newProduct);
        res.status(200).json({ success: true, product: createdProduct });
    } catch (error) {
        console.error('Error creating product:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// app.get('/create-variant', async (req, res) => {
//     // const { product_id, width, height } = req.body;
//     const pricePerSquareFoot = 200;
//     // const newPrice = width * height * pricePerSquareFoot;
//     const newPrice = 5 * 5 * pricePerSquareFoot;
//     const product_id = 7365439619162;
   
//     // const session = await Shopify.Utils.loadOfflineSession(process.env.SHOPIFY_STORE_URL);

//     const newVariantData = {
//         variant: {
          
//             option: 'Custom Option',
//             price: newPrice.toString(),
//             sku: 'custom-sku',
//             inventory_quantity: 10,
//         }
//     };

//     // try {
//     //     const client = new Shopify.clients.Rest({session});
//     //     const response = await client.Rest(session.shop).post({
//     //         path: `products/${product_id}/variants`,
//     //         data: newVariantData,
//     //         type: 'application/json',
//     //     });
//     //     res.json({ success: true, variant: response.body.variant });
//     // } catch (error) {
//     //     res.json({ success: false, error: error.message });
//     // }

//     try {
//         const newVariant = await shopify.productVariant.create(product_id, newVariantData);
//         res.json({ success: true, variant: newVariant });
//     } catch (error) {
//         res.json({ success: false, error: error.message });
//     }

// });

// working
// app.get('/create-variant', async (req, res) => {
//     // const { product_id, width, height } = req.body;
//     const pricePerSquareFoot = 200;
//     // const newPrice = (width * height * pricePerSquareFoot).toFixed(2);

//     const newPrice = (3 * 3 * pricePerSquareFoot).toFixed(2);
//     const product_id = 7365444567130;

//     const newVariantData = {
//         option1: "3 * 3",
//         price: newPrice,
//         sku: 'custom-sku',
//         inventory_quantity: 10,
//     };

//     try {
//         const newVariant = await shopify.productVariant.create(product_id, newVariantData);
//         res.json({ success: true, variant: newVariant });
//     } catch (error) {
//         console.error('Error creating variant:', error.response ? error.response.body : error.message);
//         res.json({ success: false, error: error.response ? error.response.body : error.message });
//     }
// });


app.post('/create-variant', async (req, res) => {
  const { product_id, width, height } = req.body;
  if (!product_id || !width || !height) {
    return res.status(400).json({ success: false, error: 'Missing product_id, width, or height' });
  }

  const pricePerSquareFoot = 200;
  const newPrice = (width * height * pricePerSquareFoot).toFixed(2);
  
  try {
    // Fetch existing variants for the product to check if a variant already exists
    const variants = await shopify.productVariant.list(product_id);

    // Check if a variant with the desired options already exists
    const existingVariant = variants.find(variant =>
      variant.option1 === `${width} * ${height}`
    );

    if (existingVariant) {
      console.log('Variant already exists:', existingVariant.id);
      return res.json({
        success: true,
        message: "Variant already exists",
        variantId: existingVariant.id
      });
    } else {
      const newVariantData = {
        option1: `${width} * ${height}`,
        price: newPrice,
        sku: `SKU-${width}-${height}`,
        inventory_quantity: 10, // Set inventory quantity
        inventory_policy: 'continue', // Allow selling when out of stock
        fulfillment_service: 'manual', // Ensure fulfillment service is manual
        requires_shipping: true, // Ensure shipping is required
        taxable: true // Ensure the product is taxable
      };

      // Create the new variant
      const newVariant = await shopify.productVariant.create(product_id, newVariantData);
      console.log('New variant created:', newVariant.id);

      return res.json({
        success: true,
        message: 'New variant created',
        variantId: newVariant.id,
        variant: newVariant
      });
    }
  } catch (error) {
    console.error('Error creating variant:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});
    
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

