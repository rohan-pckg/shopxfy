require('dotenv').config()
const Shopify = require('shopify-api-node')
const cors = require('cors');
// const Shopify = require('shopify')
// const Shopify = require('@shopify/shopify-api').default;

const express = require('express');

const app = express();
app.use(express.json());


const allowedOrigins = [
  'https://kktest0001.myshopify.com',
  'https://www.w3schools.com',
  'https://zyvorah.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
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
        const createdProduct = await shopify.product.create(newProduct)
        console.log(`Product created: ${createdProduct.id}`)
      } catch (error) {
        console.error(`Failed to create product: ${error.message}`)
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
app.get('/create-variant', async (req, res) => {
    // const { product_id, width, height } = req.body;
    const pricePerSquareFoot = 200;
    // const newPrice = (width * height * pricePerSquareFoot).toFixed(2);

    const newPrice = (3 * 3 * pricePerSquareFoot).toFixed(2);
    const product_id = 7365444567130;

    const newVariantData = {

        option1: `${width} feet wide x ${height} feet high`,
          price: newPrice.toString(),
          fulfillment_service: 'manual',
          inventory_policy: 'continue',
          requires_shipping: true,
          taxable: true,
    };

    try {
        const newVariant = await shopify.productVariant.create(product_id, newVariantData);
        res.json({ success: true, variant: newVariant });
    } catch (error) {
        console.error('Error creating variant:', error.response ? error.response.body : error.message);
        res.json({ success: false, error: error.response ? error.response.body : error.message });
    }
});



app.post('/create-variant', async (req, res) => {
    const { product_id, width, height } = req.body;
    const pricePerSquareFoot = 200;
    // const width = 4;
    // const height = 4;
    const newPrice = (width * height * pricePerSquareFoot).toFixed(2);
    // const newPrice = (3 * 3 * pricePerSquareFoot).toFixed(2);7365438799962
    // const product_id = 7365444567130;
    // const product_id = 7365438799962;
    const variants = await shopify.productVariant.list(product_id);
     // Check if a variant with the desired options already exists
     const existingVariant = variants.find(variant => 
        variant.option1 === `${width} feet wide x ${height} feet high`
      );

    
      if(existingVariant) {
        console.log('Variant already exists:', existingVariant.id);
        res.json({ success: true, mag:"Variant already exists:", variantid: existingVariant.id });
        return existingVariant.id;
      } else {
        const newVariantData = {
            option1: `${width} feet wide x ${height} feet high`,
          price: newPrice.toString(),
          fulfillment_service: 'manual',
          inventory_policy: 'continue',
          requires_shipping: true,
          taxable: true,
        };

        // const newVariantData = {
        //   // variant: {
        //       option1: `${width} * ${height}`,
        //       price: newPrice,
        //       sku: `SKU-${width}-${height}`,
        //       inventory_quantity: 10, // Ensure inventory quantity is set
        //       inventory_policy: 'continue', // Allow selling when out of stock
        //       fulfillment_service: 'manual', // Ensure fulfillment service is set to manual
        //       requires_shipping: true, // Ensure shipping is required
        //       taxable: true // Ensure the product is taxable
        //   // }
        // };
  
    
        try {
            const newVariant = await shopify.productVariant.create(product_id, newVariantData);
            res.json({ success: true, variantid: newVariant.id, variant: newVariant });
            console.log('New variant created:', newVariant.id);
            return newVariant.id;

        } catch (error) {
            console.error('Error creating variant:', error.response ? error.response.body : error.message);
            res.json({ success: false, error: error.response ? error.response.body : error.message });
        }
      }


    
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

