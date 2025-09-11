import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User; // Here models a property of mongoose that stores all the models that have been registered. This line checks if the User model has already been registered; if it has, it uses the existing model instead of creating a new one. This is particularly useful in development environments where modules may be reloaded frequently, preventing errors related to model redefinition.