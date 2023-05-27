import express from 'express'
const router = express.Router()
import { labourController } from '../controllers'
import * as validation from '../validation'
import { userJWT } from '../helper/jwt'

router.use(userJWT)
router.post('/uploadDoc', labourController.uploadDoc)
router.get('/get_detail_labourDocs', labourController.get_detail_labourDocs)
router.get('/get_job_list', labourController.get_job_list)
router.put('/update_job_by_id', labourController.update_job_by_id)
router.get('/get_applied_job', labourController.get_applied_job)
// router.post('/login', validation.login, authController.login)

export const labourRouter = router;