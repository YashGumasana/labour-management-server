import express from 'express'
const router = express.Router()
import { officerController } from '../controllers'
import * as validation from '../validation'
import { userJWT } from '../helper/jwt'

router.use(userJWT)
router.get('/labourList', officerController.labourList)
router.post('/get_labour_list_by_search', officerController.get_labour_list_by_search)
router.get('/get_labour_docs_by_id/:id', officerController.get_labour_docs_by_id)
router.get('/get_labour_info_by_id/:id', officerController.get_labour_info_by_id)
router.put('/update_labour_doc_status', validation.update_labour_doc_status, officerController.update_labour_doc_status)
router.post('/get_approved_labour_list', officerController.get_approved_labour_list)
router.post('/get_rejected_labour_list', officerController.get_rejected_labour_list)
// router.post('/login', validation.login, authController.login)

export const officerRouter = router;