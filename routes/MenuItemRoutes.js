const express = require("express");
const router = express.Router();
const MenuItem = require("./../models/MenuItem");

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newMenuItem = new MenuItem(data);
    const response = await newMenuItem.save();
    console.log("Data Saved");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await MenuItem.find();
    console.log("data fetched");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:tasteType", async (req, res) => {
  try {
    const tasteType = req.params.tasteType;
    if (tasteType == "sweet" || tasteType == "sour" || tasteType == "spicy") {
      const response = await MenuItem.find({ taste: tasteType });
      console.log("data fectched");
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: "Invalid tasteType" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const menuItemId = req.params.id; // Extract the id from the URL parameter
    const updatedData = req.body; // it will give the updated data
    const response = await MenuItem.findByIdAndUpdate(menuItemId, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Run mongoose validation
    });

    if (!response) {
      return res.status(404).json({ error: "Item not found" });
    }

    console.log("data updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete('/:id', async (req, res) => {
    try{
        const menuItemId = req.params.id; // Extract the id from the URL parameter
        const response = await MenuItem.findByIdAndDelete(menuItemId);
        if(!response){
            return res.status(404).json({error: 'Item not found'});
        }

        console.log('data deleted');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

module.exports = router;
