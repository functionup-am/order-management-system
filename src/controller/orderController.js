const customerModel = require('../model/customerModel');
const orderModel = require('../model/orderModel')
const mongoose = require('mongoose');
const createOrder = async (req,res)=>{
    try{
        let data = req.body;
        let {customerId,product,totalprice,discount}=data
        let storingCustomerId = req.params.customerId; 
        if(!mongoose.isValidObjectId(storingCustomerId)){
            return res.status(400).send({msg:"customerId is not a valid objectId"})
        }
        data.customerId=storingCustomerId;
        let CheckingcustomerIdInDb = await customerModel.findOne({_id:storingCustomerId});
        if(!CheckingcustomerIdInDb){
            return res.status(404).send({msg:"customerId is not found in database"})
        }
        let savedData = await orderModel.create(data); 
        let totalOrderCount = CheckingcustomerIdInDb.totalorders+1;
        let updatingTotalOrderCountInCustomerModel = await customerModel.findOneAndUpdate(data,{totalorders:totalOrderCount},{new:true}); 
        
            if(totalOrderCount>=9){ 
                 console.log(`You have placed ${totalOrderCount} orders with us. Buy ${10-totalOrderCount} more stuff and you will be
                promoted to Gold customer and enjoy 10% discounts`)
            }
                 if(totalOrderCount>=10 && totalOrderCount<20){      
                        let totalOrderDiscountFor10_Order = CheckingcustomerIdInDb.totaldiscount+(totalprice*10/100);  
                        let orderDiscount = savedData._id + '-' + totalprice*10/100;
                        let updatingTotalDiscountPerOrder = await customerModel.findOneAndUpdate(data,{category:"Gold",totaldiscount:totalOrderDiscountFor10_Order,$push:{orderdiscount:orderDiscount}},{new:true});
                       console.log("You are placed 10 order so, now you have gold premium 10% discount on order ")
                     }
                     if(totalOrderCount>=20){
                        let totalOrderDiscountFor20_Order = CheckingcustomerIdInDb.totaldiscount+(totalprice*20/100);
                        let updatingTotalOrderDiscountFor20_Order = await customerModel.findOneAndUpdate(data,{category:"Platinum",totaldiscount:totalOrderDiscountFor20_Order},{new:true});
                            console.log(`You are placed 20 order so, now you have platinum premium 20% discount on order `)
                         }
        res.status(201).send({message:'Your order is successfully created', data: savedData}); 
    }   
    catch(error){
        console.log(error)
        res.status(500).send({msg:"sorry for inconvenience", Error: error})
    }
}

module.exports= {createOrder}