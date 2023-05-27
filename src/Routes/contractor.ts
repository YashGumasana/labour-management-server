import express from 'express'
const router = express.Router()
import { contractorController, officerController } from '../controllers'
import * as validation from '../validation'
import { userJWT } from '../helper/jwt'

router.use(userJWT)
router.post('/createJob', contractorController.createJob)
router.get('/get_crated_job', contractorController.get_crated_job)
router.get('/get_labour_request_for_job', contractorController.get_labour_request_for_job)
router.get('/get_labour_docs_by_id/:id', contractorController.get_labour_docs_by_id)
router.get('/get_labour_info_by_id/:id', contractorController.get_labour_info_by_id)
router.post('/feedback_for_labour_by_contractor', contractorController.feedback_for_labour_by_contractor)
router.get('/get_feedback_detail/:id', contractorController.get_feedback_detail)


export const contractorRouter = router;