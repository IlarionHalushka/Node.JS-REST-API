import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      index: {
        required: true,
      },
    },
    picture: {
      type: String,
    },
    password: {
      type: String,
      index: {
        required: true,
      },
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER',
    },
    banned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  },
);

UserSchema.pre('save', async function userPreSave(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

UserSchema.methods.isAdmin = function isAdmin() {
  return this.role === 'ADMIN';
};

export const publicFields = [
  'firstname',
  'lastname',
  'email',
  'role',
  'picture',
  'createdAt',
  'updatedAt',
];

export const User = mongoose.model('User', UserSchema);
