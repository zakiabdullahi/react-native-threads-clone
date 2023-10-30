const dotenv = require("dotenv");

dotenv.config()

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const APP_PASS = process.env.APP_PASS
// console.log("APP_PASS", APP_PASS);
// console.log("APP_PASS", process.env.PORT);

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");

mongoose
    .connect("mongodb+srv://zaki:zaki1234@cluster0.cc45epc.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error Connecting to MongoDB");
    });


const User = require("./models/user");
const Post = require("./models/post");

app.get('/', (req, res) => {

    res.send('Hello World!')
})

app.post('/register', async (req, res) => {


    try {
        const { name, email, password } = req.body

        // check if user allready exists

        const existingUser = await User.findOne({ email: email })

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const newUser = new User({ name, email, password })

        newUser.verificationToken = crypto.randomBytes(20).toString('hex')


        await newUser.save();


        sendEmailVerification(newUser.email, newUser.verificationToken)

        res.status(200).json({ message: "Registration successful" })

    } catch (error) {
        console.log("Error registering user", error);
    }
})


const sendEmailVerification = async (email, verificationToken) => {



    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "qable2121@gmail.com",
            pass: APP_PASS

        }



    })

    const mailOptions = {
        from: "qable2121@gmail.com",
        to: email,
        subject: "Email Verification",

        text: `please click the following link to verify your email http://localhost:3000/verify/${verificationToken}`,
    }

    try {
        await transporter.sendMail(mailOptions)

    } catch (error) {

        console.log("error sending mail: ", error)

    }

}

app.get('/verify/:token', async (req, res) => {

    try {

        const token = req.params.token
        console.log("token", token)

        const user = await User.findOne({ verificationToken: token })

        if (!user) {
            return res.status(404).json({ message: "Invalid token" });
        }

        user.verified = true;
        user.verificationToken = undefined;
        await user.save();


        res.status(200).json({ message: "Email verified successfully" });

    } catch (error) {

        console.log("error getting token", error);
        res.status(500).json({ message: "Email verification failed" });
    }


})

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex");
    return secretKey;
};

const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid email" });
        }

        if (user.password !== password) {
            return res.status(404).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id }, secretKey);

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
});

app.get('/user/:userId', (req, res) => {

    try {
        const loggedUserId = req.params.userId

        User.find({ _id: { $ne: loggedUserId } })
            .then((users) => {
                res.status(200).json(users)
            }).catch((error) => {
                console.log("Error: ", error);
                res.status(500).json("errror")
            })


    } catch (error) {

        res.status(500).json({ message: "error getting the users" });

    }

})
app.get('/user/get-user/:userId', (req, res) => {

    try {
        const loggedUserId = req.params.userId

        User.findOne({ _id: loggedUserId })
            .then((users) => {
                res.status(200).json(users)
            }).catch((error) => {
                console.log("Error: ", error);
                res.status(500).json("errror")
            })


    } catch (error) {

        res.status(500).json({ message: "error getting the users" });

    }

})
// endpoint to follow a par
app.post('/follow', async (req, res) => {
    console.log("Started ................")

    const { currentUserId, selectedUserId } = req.body
    // console.log("currentUserId", currentUserId)
    // console.log("selectedUserId", selectedUserId)

    try {
        await User.findByIdAndUpdate(selectedUserId, {
            $push: { followers: currentUserId },
        });

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error in following a user" });
    }

})

// endpoint to unfollow a user
app.post("/users/unfollow", async (req, res) => {
    const { loggedInUserId, targetUserId } = req.body;

    // console.log("loggedInUserId", loggedInUserId)
    // console.log("targetUserId", targetUserId)

    try {
        await User.findByIdAndUpdate(targetUserId, {
            $pull: { followers: loggedInUserId },
        });

        res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error unfollowing user" });
    }
});


//endpoint to create a new post in the backend
app.post("/create-post", async (req, res) => {
    try {
        const { content, userId } = req.body;

        const newPostData = {
            user: userId,
        };

        if (content) {
            newPostData.content = content;
        }

        const newPost = new Post(newPostData);

        await newPost.save();

        res.status(200).json({ message: "Post saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "post creation failed" });
    }
});

//endpoint for liking a particular post
app.put("/posts/:postId/:userId/like", async (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId; // Assuming you have a way to get the logged-in user's ID

    try {
        const post = await Post.findById(postId).populate("user", "name");

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { likes: userId } }, // Add user's ID to the likes array
            { new: true } // To return the updated post
        );

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        updatedPost.user = post.user;
        // console.log("UpdatePost", updatedPost);

        res.json(updatedPost);
    } catch (error) {
        console.error("Error liking post:", error);
        res
            .status(500)
            .json({ message: "An error occurred while liking the post" });
    }
});


//endpoint to unlike a post
app.put("/posts/:postId/:userId/unlike", async (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId;

    try {
        const post = await Post.findById(postId).populate("user", "name");

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $pull: { likes: userId } },
            { new: true }
        );

        updatedPost.user = post.user;

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json(updatedPost);
    } catch (error) {
        console.error("Error unliking post:", error);
        res
            .status(500)
            .json({ message: "An error occurred while unliking the post" });
    }
});

//endpoint to get all the posts
app.get("/get-posts", async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while getting the posts" });
    }
});

app.get("/profile/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });



    } catch (error) {

        res.status(500).json({ message: "Error while getting the profile" });
    }
});

app.listen(port, () => {

    console.log("server is running on port 3000");


});



