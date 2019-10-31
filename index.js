const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'admin',
    database:'EmployeeDB',
    multipleStatements:true
}); 

mysqlConnection.connect((err)=>{
    if(!err)
    console.log('DB connection succeded.');
    else
    console.log('DB connection failed \n Error' + JSON.stringify(err,undefined, 2));
});

app.listen(3000,()=>console.log('Express Server is running at port number: 3000'));

//Get all employees on our database
app.get('/employees',(req,res)=>{
    mysqlConnection.query('SELECT * FROM Employee',(err, rows, fields)=>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    });
});

//Get an employee on our database
app.get('/employees/:id',(req,res)=>{
    mysqlConnection.query('SELECT * FROM Employee WHERE EmpID = ?',[req.params.id],(err, rows, fields)=>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    });
});

//Delete an employee on our database
app.delete('/employees/:id',(req,res)=>{
    mysqlConnection.query('DELETE Employee FROM Employee WHERE EmpID = ?',[req.params.id],(err, rows, fields)=>{
        if(!err)
        res.send('Deleted successfully.');
        else
        console.log(err);
    });
});

//Insert an employee on our database
app.post('/employees',(req,res)=>{
    let emp = req.body;
    var sql ="SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?;\
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],(err, rows, fields)=>{
        if(!err)
        res.send('Inserted successfully.');
        else
        console.log(err);
    });
});