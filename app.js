const express=require("express");
const bodyParser=require("body-parser");
const User=require("./userdatabase");
const cors=require("cors");
const app=express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res) {
    User.find({ name: { $ne: null } })
        .then((result) => {
            if (result.length === 0) {
                return res.status(404).json({ message: "No data Found" });
            } else {
                const userNames = result.map((ele) => ele.name);
                return res.status(200).json({ message: "User names", users: userNames });
            }
        })
        .catch((err) => {
            return res.status(500).json({ message: "Error fetching users", error: err });
        });
});

app.post("/create", function(req, res) {
    const { Gname, Yname, password } = req.body;
    User.findOne({ name: Gname }).then((result) => {
        if (result) {
            return res.status(400).json({ message: "Group Already Exists !!" });
        } 
        const newGroup = new User({
            name: Gname,
            password: password,
            User: [
                {
                    name: Yname
                }
            ]
        });
        newGroup.save()
            .then(() => {
                const Data=[{name:Yname}];
                return res.status(200).json({ message: "Group Created Successfully", Data});
            })
            .catch((err) => {
                return res.status(500).json({ message: "Error In Data Save !!", error: err });
            });
    }).catch((err) => {
        return res.status(500).json({ message: "Error occurred while checking group", error: err });
    });
});

app.post("/Enter", function(req, res) {
    const { Gname, Yname, password } = req.body;

    User.findOne({ name: Gname }).then((result) => {
        if (!result) {
            return res.status(400).json({ message: "Group Doesn't Exist !!" });
        }

        if (result.password !== password) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const userExists = result.User.some(user => user.name === Yname);
        if (userExists) {
            return res.status(200).json({ message: "User Verified", result });
        }

        if (result.User.length >= 2) {
            return res.status(400).json({ message: "Group is Full" });
        }
        
        result.User.push({ name: Yname });
        result.save()
            .then(() => {
                return res.status(200).json({ message: "User Added to Group Successfully", result });
            })
            .catch((err) => {
                return res.status(500).json({ message: "Error Saving Data", error: err });
            });
    }).catch((err) => {
        return res.status(500).json({ message: "Error occurred while checking group", error: err });
    });
});


app.listen(process.env.PORT, function(){
    console.log("server is running on port !!");
});