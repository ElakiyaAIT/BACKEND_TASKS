const User = require("../models/user")

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.getUsers = async (req, res) => {
  const users = await User.find()
  res.json(users)
}

exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.json(user)
}

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.json({ message: "User deleted" })
}
