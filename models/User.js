const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "first name is required"],
        trim: true,
        text: true
    },
    last_name: {
        type: String,
        required: [true, "last name is required"],
        trim: true,
        text: true
    },
    userName: {
        type: String,
        required: [true, "userName is required"],
        trim: true,
        text: true
    },
    email: {
        type: String,
        required: [true, "first name is required"],
        trim: true,
        text: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    picture: {
        type: String,
        default: "https://th.bing.com/th/id/OIP.1IYR5G08MVUDJemLi54KmAHaEK?w=306&h=180&c=7&r=0&o=5&pid=1.7"
    },
    cover: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        required: [true, "gender is required"],
        trim: true
    },
    bYear: {
        type: Number,
        required: true,
        trim: true
    },
    bMonth: {
        type: Number,
        required: true,
        trim: true
    },
    bDay: {
        type: Number,
        required: true,
        trim: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    friends: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    followers: {
        type: Array,
        default: []
    },
    requests: {
        type: Array,
        default: []
    },
    search: [
        {
            user: {
                type: ObjectId,
                ref: "User"
            }
        }
    ],
    details: {
        bio: {
            type: String
        },
        otherName: {
            type: String
        },

        job: {
            type: String
        },
        workplace: {
            type: String
        },
        highSchool: {
            type: String
        },
        college: {
            type: String
        },
        currentCity: {
            type: String
        },
        homeTown: {
            type: String
        },
        relationship: {
            type: String
        },
        instagram: {
            type: String
        },
    },
    savedPosts: [
        {
            post: {
                type: ObjectId,
                ref: "Post"
            },
            savedAt: {
                type: Date,
                default: new Date(),
            }
        }
    ]
},
    {
        timestamps: true
    }
);

module.exports=mongoose.model('User',userSchema)
