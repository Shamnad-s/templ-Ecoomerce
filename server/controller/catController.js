const { NetworkContext } = require('twilio/lib/rest/supersim/v1/network');
var categoryDb = require('../model/categoryModel');
const productDb = require('../model/productModel');

exports.create =async (req,res,done)=>{
    try{
        if (!req.body.name){
            res.redirect('/admin/CategoryErr')
        }
        else{
            const category = new categoryDb({
                name:req.body.name
            })  
            await category.save(function(err, data) {
                if (err) return console.error(err);
                done(null, data)
              })
            res.redirect('/admin/category')
        }
        }catch (error) {
            res.status(400).send(error)
    }
}

exports.updatepage =async (req,res)=>{
    console.log(req.query.id);
    const cate = await categoryDb.findOne({_id:req.query.id})
    res.render('admin/category_update',{error:"",cate})
}

exports.update = async (req,res)=>{
    const id = req.params.id;
    if(!req.body.name){
        req.session.categoryId = id;
        res.redirect('/admin/editCateErr')
    }else{
    const cat = await categoryDb.findOne({_id:id})
    await categoryDb.findByIdAndUpdate(id,req.body,{useFindAndModify:false})
    await productDb.updateMany({"Category":cat.name},{$set : {"Category":req.body.name}})
        res.redirect('/admin/category')
    }
}

exports.delete = async (req,res)=>{
    const id = req.params.id;
    const cat = await categoryDb.findOne({_id:id}) 
    await categoryDb.findByIdAndDelete(id)
    const products = await productDb.find({"Category":cat.name})
    await productDb.deleteMany({"Category":cat.name})
    res.redirect('/admin/category')
}