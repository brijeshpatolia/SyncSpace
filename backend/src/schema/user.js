import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      required: [true, 'Username is required'],
      unique: [true, 'Username already exists'],
      match: [/^[a-zA-Z0-9]+$/, 'Username is invalid']
    },
    avatar: {
      type: String
    },
    email: {
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists'],
      // eslint-disable-next-line no-useless-escape
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email is invalid']
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    }
  },
  { timestamps: true }
)

userSchema.pre('save', function (next) {
  const user = this
  user.avatar = `https://robohash.org/${user.username}`
  next()
})


const User = mongoose.model('User', userSchema)


export default User;