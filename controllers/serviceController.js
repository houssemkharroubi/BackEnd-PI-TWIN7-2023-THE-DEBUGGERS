const HospitalServiceModel = require("../models/HospitalService");
const Hospital = require("../models/Hospital");
// Add a new service
const addService = async (req, res, next) => {
  try {
    const { ServiceName, Description, EmailService } = req.body;
    const hospitalId = req.params.hospitalId;
   
   // Find the hospital by ID to check if it exists

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

     // check if service name or email already exists
     const existingService = await HospitalServiceModel.findOne({
      $or: [{ ServiceName }, { EmailService }],
      Hospital: hospitalId,
    });
    if (existingService) {
      return res
        .status(400)
        .json({ message: "Service name or email already exists" });
    }

    // Create a new service object and save it to the database

    const newService =  new HospitalServiceModel({
      ServiceName,
      Description,
      EmailService,
      Hospital: hospitalId,
    });
    const validationError = newService.validateSync();
    if (validationError) {
      throw new Error(validationError.message);
    }
      await newService.save();
    
      // Return a success message if the service was added successfully
    res.status(201).json("service added successfully");
  } 
  catch (err) {
   // Return an error message if there was a server error
 res.status(500).json({message: "Server error"});
  }
};

// Update an existing service
const updateService = async (req, res, next) => {
    try {
      const { ServiceName, Description, EmailService } = req.body;
      const { serviceId } = req.params;
  
      // Remove any whitespace characters from the serviceId parameter value
      const trimmedServiceId = serviceId.trim();

      const service = await HospitalServiceModel.findById(trimmedServiceId);
      if (!service) {
        throw new Error(`Service with ID ${trimmedServiceId} not found`);
      }
  
      // check if service name or email already exists, excluding the current service being updated
      const existingService = await HospitalServiceModel.findOne({
        $or: [{ ServiceName }, { EmailService }],
        Hospital: service.Hospital,
        _id: { $ne: service._id },
      });
      if (existingService) {
        return res
          .status(400)
          .json({ message: "Service name or email already exists" });
      }

   // Find the service by ID and update its properties
      const updatedService = await HospitalServiceModel.findByIdAndUpdate(
        trimmedServiceId,
        {
          $set: { ServiceName, Description, EmailService},
        },
        { new: true }
      );
      // Throw an error if the service couldn't be updated

      if (!updatedService) {
        throw new Error(`Could not update service with ID ${trimmedServiceId}`);
      }
      // Return the updated service object if the update was successful

      res.json(updatedService);
    } catch (error) {
          // Return an error message if there was a server error

      res.status(500).json(error.message);
    }
  };
  // Delete an existing service
  const deleteService = async (req, res, next) => {
    try {
        const { serviceId } = req.params;
            
        // Find the service by ID to check if it exists

        const checkIfServiceExist = await HospitalServiceModel.findById(serviceId);
        if (!checkIfServiceExist) {
          throw new Error("service not found");
        }
        // Delete the service from the database
        await HospitalServiceModel.findByIdAndDelete(serviceId);

            // Return a success message if the service was deleted successfully

        res.json("service deleted!");
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
  };
  
  // Get all services

  const getallServices = async (req, res, next) => {
    try {
       // Find all services in the database
      const servs  = await HospitalServiceModel.find({ });
      res.status(200).json(servs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  // Count the number of services in a hospital
const countServicesInHospital = async (req, res, next) => {
  try {
    // get the hospitalId from the params
    const hospitalId = req.params.hospitalId; 

    // count the number of documents in the collection that match the given hospitalId
    const count = await HospitalServiceModel.countDocuments({ Hospital: hospitalId }); 

    // return the count as a response
    res.status(200).json({ count }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getHospitalServices = async (req, res, next) => {
  try {
    // Get the hospitalId from the params
    const hospitalId = req.params.hospitalId;

    // Find all services in the HospitalServiceModel collection that match the given hospitalId
    const services = await HospitalServiceModel.find({ Hospital: hospitalId });

    // If no services are found, return a 404 error
    if (services.length === 0) {
      return res.status(404).json({ message: "No services found for this hospital" });
    }

    // Return the services as a response
    res.status(200).json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
    addService,
    updateService,
    deleteService,
    getallServices,
    countServicesInHospital ,
    getHospitalServices
  };
