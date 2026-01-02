import express from "express"
// import { getData } from "../controller/control";
import{
    getData,
    getDatabyId,
    createData,
    getParams,
    updateParams,
    getMonitoring
} from "../controller/controller.js"

const router = express.Router();

router.get('/DataKontrols', getData)
router.get('/DataKontrols/:id', getDatabyId)
router.post('/DataKontrols', createData)

router.get('/parameters/:id', getParams)
router.patch('/parameters/:id', updateParams)

router.get('/DataMonitoring', getMonitoring)

export default router