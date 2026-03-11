import axios from "axios"
import { prisma } from "../src/lib/prisma"

async function main() {

  console.log("🌱 Fetching products from API...")

  const response = await axios.get(
    "https://dummyjson.com/products?limit=100"
  )

  const products = response.data.products

  console.log(`Fetched ${products.length} products`)

  const formattedProducts = products.map((product: any) => ({
    name: product.title,
    description: product.description,
    price: product.price,
    image: product.thumbnail,
    category: product.category,
    stock: product.stock ?? 50
  }))

  await prisma.product.createMany({
    data: formattedProducts,
    skipDuplicates: true
  })

  console.log("✅ Products inserted into database")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })