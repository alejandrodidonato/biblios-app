// api/crear-preferencia.js
import mercadopago from 'mercadopago'

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { cantidad, precio } = req.body

  try {
    const preference = {
      items: [
        {
          title: `${cantidad} Libris`,
          unit_price: precio,
          quantity: 1,
        },
      ],
      back_urls: {
        success: `${process.env.FRONTEND_URL}/success`,
        failure: `${process.env.FRONTEND_URL}/failure`,
        pending: `${process.env.FRONTEND_URL}/pending`,
      },
      auto_return: 'approved',
    }

    const result = await mercadopago.preferences.create(preference)

    return res.status(200).json({ init_point: result.body.init_point })
  } catch (error) {
    console.error('❌ Error al crear preferencia:', error.message)
    return res.status(500).json({ error: 'Error al crear preferencia' })
  }
}
