const express = require('express');
const router = express.Router();
const Person = require('./../models/Person');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

// POST route to add a person
router.post("/signup", async (req, res) => {
  try {
    const data = req.body; // Assuming the request body contains the person data due to bodyParser

    // Create a new Person document using the mongoose model
    const newPerson = new Person(data);

    // Save the newPerson in database
    const response = await newPerson.save();
    console.log('data saved');

    const payload = {
      id: response.id,
      username: response.username
    }

    const token = generateToken(payload);
    console.log('Token is:', token);
    res.status(200).json({response: response, token: token});
  } catch (err) {
    console.log(err);
    res.status(500).json({error: 'Internal server error'});
  }
});

// Login route
router.post('/login', async (req, res) => {
  try{
    // Extract username and password from request body
    const {username, password} = req.body;

    // Find the user by username
    const user = await Person.findOne({username: username});

    // If user does not exist or password does not match, return error
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error: 'Invalid username or password'});
    }

    // generate token 
    const payload = {
      id: user.id,
      username: user.username
    }

    const token = generateToken(payload);

    // return token as response
    res.status(200).json({token: token});
  }catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
  }
})

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try{
    const userData = req.user;
    console.log("User Data: ", userData);

    const userId = userData.id;
    const user = await Person.findById(userId);

    res.status(200).json(user);
  }catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
  }
})

// GET method to get the person
router.get('/',jwtAuthMiddleware, async (req, res) => {
    try{
        const data = await Person.find();
        console.log('data fetched');
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
});

// GET route to get workType of a person
router.get('/:workType', async (req, res)=>{
  try{
    const workType = req.params.workType; // Extract the work type from the URL or can say that read the value from the URL if url is like /person/chef then workType == 'chef'
    if(workType == 'chef' || workType == 'manager' || workType == 'waiter'){

      const response = await Person.find({work: workType});
      console.log('response fetched');
      res.status(200).json(response);
    }else{
      res.status(404).json({error: 'Invalid work type'});
    }
  }catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal server error'});
  }
});

router.put('/:id', async (req, res) => {
  try{
    const personId = req.params.id; // Extract the id from the URL parameter
    const updatedPersonData = req.body; // updated data for the person

    const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
      new: true, // Return the updated document
      runValidators: true, // Run Mongoose validation
    })

    if(!response){
      return res.status(404).json({error: 'Person not found'});
    }

    console.log('data updated');
    res.status(200).json(response);
  }catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

router.delete('/:id', async (req, res) => {
  try{
    const personId = req.params.id; // Extract the person's id from the URL parameter

    // Assuming you have a person model
    const response = await Person.findByIdAndDelete(personId);
    if(!response){
      res.status(404).json({error: 'Person not found'});
    }

    console.log('data deleted');
    res.status(200).json(response);
  }catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

module.exports = router;