import Drink from "../models/drinks.js"; // ✅ make sure your model filename is drink.js, not drinks.js

// ✅ Get all drinks (public)
export const getAllDrinks = async (req, res) => {
  try {
    const drinks = await Drink.findAll();
    res.status(200).json(drinks);
  } catch (err) {
    console.error("❌ Error fetching drinks:", err);
    res.status(500).json({ message: "Server error while fetching drinks" });
  }
};

// ✅ Get one drink (public)
export const getDrinkById = async (req, res) => {
  try {
    const { id } = req.params;
    const drink = await Drink.findByPk(id);

    if (!drink) {
      return res.status(404).json({ message: "Drink not found" });
    }

    res.status(200).json(drink);
  } catch (err) {
    console.error("❌ Error fetching drink:", err);
    res.status(500).json({ message: "Server error while fetching drink" });
  }
};

// ✅ Add a new drink (will be admin-only later)
export const addDrink = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, available } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const newDrink = await Drink.create({
      name,
      description,
      price,
      imageUrl,
      category,
      available: available ?? true, // default true if not provided
    });

    res.status(201).json({
      message: "Drink added successfully",
      drink: newDrink,
    });
  } catch (err) {
    console.error("❌ Error adding drink:", err);
    res.status(500).json({ message: "Server error while adding drink" });
  }
};

// ✅ Update a drink (admin only later)
export const updateDrink = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, category, available } = req.body;

    const drink = await Drink.findByPk(id);
    if (!drink) {
      return res.status(404).json({ message: "Drink not found" });
    }

    await drink.update({ name, description, price, imageUrl, category, available });

    res.status(200).json({
      message: "Drink updated successfully",
      drink,
    });
  } catch (err) {
    console.error("❌ Error updating drink:", err);
    res.status(500).json({ message: "Server error while updating drink" });
  }
};

// ✅ Delete a drink (admin only later)
export const deleteDrink = async (req, res) => {
  try {
    const { id } = req.params;

    const drink = await Drink.findByPk(id);
    if (!drink) {
      return res.status(404).json({ message: "Drink not found" });
    }

    await drink.destroy();

    res.status(200).json({ message: "Drink deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting drink:", err);
    res.status(500).json({ message: "Server error while deleting drink" });
  }
};
