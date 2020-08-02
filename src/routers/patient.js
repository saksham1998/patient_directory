// Load Libraries
const express = require("express");
const Patient = require("../../db/models/Patient");
const router = express.Router();
const auth = require('../middlewares/auth');


// Register Patient
// url : localhost:3000/users/register
// @params : name(required),phone_no(required),password(required),mail(optional)

router.post("/register", async (req, res) => {
  try {
	const user = await Patient.create(req.body,{ fields: ['name','password','age','gender','mail','walletAmount'] });
	const token = await user.generateToken()
    res.status(201).send({  message: "Patient Created Successfully",user,token });
  } catch (e) {
	  res.status(404).send({message:e.errors[0].message,user:null})
  }
});

// Login Patient
// url : localhost:3000/users/signin
// @params : phone_no(required),password(required)

router.post("/signin", async (req, res) => {
  try {
	const user = await Patient.checkCredentials(req.body.mail,req.body.password);
	const token = await user.generateToken()
	// console.log(token)
	res.status(201).send({ message: "Patient LoggedIn Successfully",user:user, token });
  } catch (e) {
	res.status(404).send({message:e.message,user:null})
  }
});

// Read Profile
// url : localhost:3000/users/me
// @params : auth_token(required)

router.get("/me",auth, async (req, res) => {
  try {
	  const user = req.user;
	  const token = req.token
	  res.status(200).send({message:'Profile',user,token})
  } catch (e) {
	  res.status(400).send({message:e.message,user:null})
  }
});

// Update Patient
// url : localhost:3000/users/me/update
// @params : auth_token(required),field to update (name,mail,password,contact_list)

router.patch("/me/update", auth,async (req, res) => {
  try {
	const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'mail', 'password', 'gender','age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        throw new Error('Invalid update categories')
	}
	updates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()
    res.status(201).send({message:'Patient Updated Successfully',user:req.user})
  } catch (e) {
	res.status(404).send({message:e.message,user:null})
  }
});


// Logout Patient
// url : localhost:3000/users/logout
// @params : auth_token(required)

router.delete("/logout", auth,async (req, res) => {
  try {
	req.user.token = null
	req.user.save()
	res.status(200).send({message:'Logged Out Successfully',user:null})
  } catch (e) {
	res.status(404).send({message:e.message,user:null})
  }
});

// Delete Patient
// url : localhost:3000/users/delete
// @params : auth_token(required)

router.delete('/delete',auth,async (req,res)=>{
	try{
		await Patient.destroy({where: {mail:req.user.mail}});
		res.status(200).send({message:'Patient Deleted Successfully',user:null})
	}catch(e){
		res.status(404).send({message:e.message,user:null})
	}
})

// Find patients with given walletAmounts
// url : localhost:3000/patients/patientswithAmount/:amount
// @params : amount(required),auth_token(required)

router.get('/patientsWithAmount/:amount',async (req,res)=>{
    try{
        const patientList = await Patient.findAll({attributes:['name','age','gender','mail'],where:{walletAmount:req.params.amount}})
		res.status(200).send({message:'Patient List with ',user:patientList})
    }catch(e){
		res.status(404).send({message:e.message,user:null})
    }
})

module.exports = router;
