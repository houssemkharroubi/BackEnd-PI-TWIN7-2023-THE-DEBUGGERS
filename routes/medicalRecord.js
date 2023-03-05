const express=require('express'); 
const router=express.Router(); 
const medicalRecordControlleur =require('../controllers/medicalRecordController'); 
router.post("/add",medicalRecordControlleur.upload,medicalRecordControlleur.addMedicalRecord);
router.put("/update/:medicalRecordId",medicalRecordControlleur.upload,medicalRecordControlleur.updateMedicalRecord); 
router.delete("/delete/:medicalRecordId",medicalRecordControlleur.deleteMedicalRecord); 
router.delete("/deleteMedicalDocument/:medicalRecordId/:fileName",medicalRecordControlleur.deleteFileOfMedicalRecord);
module.exports = router;