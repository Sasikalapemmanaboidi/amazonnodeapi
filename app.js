let express = require('express');
let app = express();
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const dotenv = require('dotenv');
dotenv.config()
let port = process.env.PORT || 8320;
const mongoUrl = process.env.mongoLiveUrl;
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

//get
app.get('/',(req,res)=>{
    res.send("Welcome to Amazon")
})

//categories
app.get('/category',(req,res)=>{
    db.collection('categories').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//products as per categories
app.get('/getProducts/',(req,res)=>{
    let query={};
    let catId=Number(req.query.category_id);
    if(catId){
        query={category_id:catId}
    }
    console.log(">>>catId",catId)
    db.collection('data').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//details of products and menu wrt categories
app.get('/productDetails/:id',(req,res)=>{
    let productId=Number(req.params.id);
    db.collection('data').find({_id:productId}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//menuproducts wrt categories
app.get('/menu/:id',(req,res)=>{
    let productId=Number(req.params.id);
    db.collection('menu').find({category_id:productId}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//view orders(get)
app.get('/vieworders',(req,res)=>{
    let email=req.query.email;
    let query={};
    if(email){
        query={"email":email}
    }
    db.collection('orders').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
//place order(post)
app.post('/placeorder',(req,res)=>{
    //console.log(req.body)
    db.collection('orders').insert(req.body,(err,result)=>{
        if(err) throw err;
        res.send('order Added')
    })
})
//menu on basis of user selection(id)
app.post('/menuItem',(req,res)=>{
    console.log(req.body);
    db.collection('menu').find({id:{$in:req.body}}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//delete order
app.delete('/deleteorder',(req,res)=>{
    db.collection('orders').remove({},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//update order
app.put('/updateorder/:id',(req,res) => {
    let oId = mongo.ObjectId(req.params.id);
    db.collection('orders').updateOne(
        {_id:oId},
        {$set:{
            "status":req.body.status,
            "bank_name":req.body.bank_name,
            "bank_status":req.body.bank_status
        }},(err,result)=>{
            if(err) throw err;
            res.send(`Status Updated to ${req.body.status}`)
        })
})

//connection with db
MongoClient.connect(mongoUrl, (err, client)=>{
    if(err) console.log(`Error while connecting`);
    db = client.db('amazonproject');
    app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})
})
