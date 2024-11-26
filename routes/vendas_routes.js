import express from "express"

import { getVendas, createVenda} from "../controller/vendas_controller.js"

const router = express.Router()

router.get('/vendas', getVendas)
router.post('/vendas', createVenda)

export default router