var db = require("../models");
var passport = require("passport");

module.exports = function (app) {

  //PATIENT GET INFO
  app.get("/api/messages/:id", function (req, res) {
    if (req.isAuthenticated() && req.session.passport.user.type==="Patient") {
      var msgQuery="SELECT body,created_at,sender_id,receiver_id FROM messages WHERE (sender_id="+req.session.passport.user.uuid;
      msgQuery+=" OR receiver_id="+req.params.id+") AND (sender_id="+req.params.id+" OR receiver_id="+req.session.passport.uuid;
      msgQuery+=") ORDER BY created_at ASC";

      sequelize.query(msgQuery, { 
        type: sequelize.QueryTypes.SELECT
      }).then(function(result){
        res.send(result);
      });
    }
    else{
      res.send("Access Not Granted.");
    }
  });

  app.get("/api/records", function (req, res) {
    if(req.isAuthenticated() && req.session.passport.user.type==="Patient"){
      db.Record.findAll({
        where: {
          PatientUuid: req.session.passport.user.uuid
        }
      }).then(function (result) {
        res.send(result);
      });
    }
    else{
      res.send("Access Not Granted.");
    }
  });

  app.get("/api/appointments", function (req, res) {
    if(req.isAuthenticated() && req.session.passport.user.type==="Patient"){
      db.Appointment.findAll({
        where: {
          patient_id: req.session.passport.user.uuid
        }
      }).then(function (result) {
        res.send(result);
      });
    }
    else{
      res.send("Access Not Granted.");
    }
  });

  app.get("/api/staff",function(req,res){
    if(req.isAuthenticated()){
      db.Staff.findAll({
        attributes: ["uuid","first_name","last_name"],
        limit: 5
      }).then(function(result){
        res.send(result);
      });
    }
    else{
      res.send("Access Not Granted.");
    }
  });
  //END OF PATIENT GET INFO

  //STAFF GET INFO
  app.get("/api/staff/messages/:id", function (req, res) {
    if(req.isAuthenticated() && req.session.passport.user.type==="Staff"){
      var msgQuery="SELECT body,created_at,sender_id,receiver_id FROM messages WHERE (sender_id="+req.session.passport.user.uuid;
      msgQuery+=" OR receiver_id="+req.params.id+") AND (sender_id="+req.params.id+" OR receiver_id="+req.session.passport.uuid;
      msgQuery+=") ORDER BY created_at ASC";

      sequelize.query(msgQuery, { 
        type: sequelize.QueryTypes.SELECT
      }).then(function(result){
        res.send(result);
      });
    }
    else{
      res.send("Access Not Granted.");
    }
  });

  app.get("/api/staff/apointments", function (req, res) {
    if(req.isAuthenticated() && req.session.passport.user.type==="Staff"){
      db.Appointment.findAll({
        where: {
          staff_id: req.session.passport.user.uuid
        }
      }).then(function (result) {
        res.send(result);
      });
    }
    else{
      res.send("Access Not Granted.");
    }
  });

  app.get("/api/records/:id", function (req, res) {
    if(req.isAuthenticated() && req.session.passport.user.type==="Staff"){
      db.Record.findAll({
        where: {
          PatientUuid: req.params.id
        }
      }).then(function (result) {
        res.send(result);
      });
    }
    else{
      res.send("Access Not Granted.");
    }
  });
  //END OF STAFF GET INFO

  //PATIENT POST INFO
  app.post("/api/message/:id", function (req, res) {
    if(req.isAuthenticated() && req.session.passport.user.type==="Patient"){
      db.Message.create({
        body: req.body.body,
        sender_id: req.session.passport.user.uuid,
        sender_fName: req.session.passport.user.first_name,
        sender_lName: req.session.passport.user.last_name,
        receiver_id: req.params.id,
        receiver_fName: req.body.receiver_fName,
        receiver_lName: req.body.receiver_lName
      });

      res.status(200);
      res.send("Message Sent!");
    }
    else{
      res.send("Permission Not Given.");
    }
  });

  app.post("/api/record/:id", function (req, res) {

    if(req.isAuthenticated() && req.session.passport.user.type==="Staff"){
      db.Record.create({
        event: req.body.event,
        description: req.body.description,
        location_name: req.body.location_name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        PatientUuid: req.params.id
      });

      res.status(200);
      res.send("Record Uploaded!");
    }
    else{
      res.send("Permission Not Given.");
    }
  });

  app.post("/api/appointment/:id", function (req, res) {
    if(req.isAuthenticated() && req.session.passport.user.type==="Patient"){
      db.Appointment.create({
        date: req.body.date,
        time: req.body.time,
        appt_reason: req.body.appt_reason,
        staff_id: req.params.id,
        staff_fName: req.body.staff_fName,
        staff_lName: req.body.staff_lName,
        patient_id: req.session.passport.user.uuid,
        patient_fName: req.session.passport.user.first_name,
        patient_lName: req.session.passport.user.last_name
      });
      res.status(200);
      res.send("Appointment booked!");
    }
    else{
      res.send("Permission Not Given.")
    }
  });
  //END OF PATIENT POST INFO

  //STAFF POST INFO 
  app.post("/api/staff/message/:id", function (req, res) {
    if(req.isAuthenticated() && req.session.passport.user.type==="Staff"){
      db.Message.create({
        body: req.body.body,
        sender_id: req.session.passport.user.uuid,
        sender_fName: req.session.passport.user.first_name,
        sender_lName: req.session.passport.user.last_name,
        receiver_id: req.params.id,
        receiver_fName: req.body.receiver_fName,
        receiver_lName: req.body.receiver_lName
      });

      res.status(200);
      res.send("Message Sent!");
    }
    else{
      res.send("Permission Not Given.")
    }
  });
  //END OF STAFF POST INFO
};
