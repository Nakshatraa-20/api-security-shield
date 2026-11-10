import {Router} from "express"
import {z} from "zod"
import {prisma} from "../db.js"
import {authMiddleware} from "../middleware/auth.js"

const router= Router()

const orderSchema = z.object({
    items: z.array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    ).min(1).max(20),
  });


router.post("/", authMiddleware, async (req, res) => {
  const userId = (req as any).userId;

  if (typeof userId !== "string" || !userId) {
    return res.status(401).json({ message: "Invalid user ID" });
  }

  const result = orderSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: "Invalid order details" });
  }

  const { items } = result.data;
  const productIds = items.map((item) => item.productId);

  if (new Set(productIds).size !== items.length) {
    return res.status(400).json({
      message: "Send each product once with its total quantity",
    });
  }

  const orderItems = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    orderItems.push({
      productId: product.id,
      quantity: item.quantity,
      unitPrice: product.price,
    });
  }

  const order = await prisma.order.create({
    data: {
      userId,
      items: { create: orderItems },
    },
    include: { items: true },
  });

  return res.status(201).json(order);
});

export default router;
