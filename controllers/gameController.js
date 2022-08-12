const firebase = require('../db');
const Login = require('../models/login');
const Questions = require ('../models/questions');
const Answers = require ('../models/answers');
const firestore = firebase.firestore();
const express = express.Router();
const bodyParser = require ('body-parser');
const { response } = require('express');

router.use(bodyParser.urlencoded({ extended: false}));
router.use(bodyParser.json());

//Mostrar página de inicio
const login = async(req, res) => {
    res.render("login")
}

//Mostrar página de error
const notFound = async (req, res) => {
    res.render("notFound", {mensaje: 'Ocurrió algo inesperado'})
}

//Mostrar página principal
const main = async (req, res) => {
    res.render("notFound", {mensaje: ' '}) 
}

//Mostrar página agregar pregunta
const addquestion = async (req, res) => {

}

//Mostrar página de registro
const register = async (req, res) => {
    console.log('Registro')
    res.render('registro')
}

//Mostrar trivia
const trivias = async(req,res) => {
res.render('trivia')
}

//Logueo de usuario
const loggedIn = async (req, res) => {
    console.log('logueo ok');
    const logged = await firestore.collection("userLogin");
    const data = await logged.get(); {
        if(data.empty){
            res.render('notFound', { message: 'No encontrado'})
        } else {
            await data.forEach((item) => {
                new Login(
                    item.data().user,
                    item.data().password,
                    item.data().es_admin
                );
             let enterName = req.body.enterName;
             let enterPassword = req.body.enterPassword;
             try{
                if(item.data().user == enterName && item.data().password == enterPassword && item.data().es_admin == '0'){
                    res.render('main', {mensaje: 'User: ' + item.data().user})
                }
                if((enterName == '') || (enterPassword == '')){
                    res.render('notFound', {mensaje: 'Incorrect user or password'})
                } 

             }
             catch (error){
                res.status(404).json({ mensaje: error.message})
             }
            })
        };
    }
}
        //User register app.post('/register',
        const registered = async (req, res) => {
            console.log('Enter into register');
            const datos = req.body;
            try {
               await firestore.collection("userLogin").doc().set(datos);
               res.render("exito", { mensaje: "User has been registered"})
            } catch (error) {
                res.render()
            }
        }

        const sendQuestions = async (req, res) => {
            try{
                const datos = req.body;
                   await firestore.collection("questions").doc().set(datos);
                   res.render("succes",{ mensaje: "the question has been registered successfully" })
            
        }catch(error){
            res.render("notFound", {mensaje: "question not entered"})
        }
    }
const questions = async (req, res) => {
    const correctAnswer = req.body.correctAnswer;
    const logueo = await firestore.collection("questions");
    const data = await logueo.get();
    const arrayQuestions = [];

    if(data.empty){
        res.render("notFound", {mensaje: 'Question no entered. Try again'})
    } else {
         await data.forEach((item) => {
            const result1 = new Questions(
                item.data().addquestion,
                item.data().correctAnswer,
                item.data().incorrectAnswer1,
                item.data().incorrectAnswer2,
                
            );
            arrayQuestions.push(result1);

         });
    };

   arrayQuestions.sort(() => Math.random() -0.5)
   const result2 = await arrayQuestions[Math.floor(Math.random() * arrayQuestions.length)]
   const object = {
    question: result2.addquestion,
    question2: result2.correctAnswer,
    question3: result2.incorrectAnswer1,
    question4: result2.incorrectAnswer2
   }
   res.render('main', {
    question: result2.addquestion,
    question2: result2.correctAnswer,
    question3: result2.incorrectAnswer1,
    question4: result2.incorrectAnswer2
   })
   console.log('firebase' + result2.correctAnswer + 'user' + correctAnswer)

}

//Mostrar puntajes
const score = (req, res) => {
    const correctAnswer = req.body.correctAnswer;
    res.render("Socore")
}

const trivia = async(res, res) => {
    const goodAnswer = req.body;
    const badAnswer1 = req.body.incorrectAnswer1;
    const badAnswer2 = req.body.incorrectAnswer2
    var logueo = await firestore.collection("questions");
    var data = await logueo.get();
    const arrayQuestions = [];

    if(data.empty) {
        res.render('NotFound', { mesagge: "Not found"})
    } else {
        await data.forEach(() => {
             const result1 = Questions(
                item.data().addquestion,
                item.data().correctAnswer,
                item.data().incorrectAnswer1,
                item.data().incorrectAnswer2
             );

             arrayQuestions.push(result1);
        });
    };

    arrayQuestions.sort(() => Math.random() - 0.5)

    const result2 = await arrayQuestions[Math.floor(Math.random() * arrayQuestions.length)]
    const result3 = await arrayQuestions[Math.floor(Math.random() * arrayQuestions.length)]
    const result4 = await arrayQuestions[Math.floor(Math.random() * arrayQuestions.length)]
    const result5 = await arrayQuestions[Math.floor(Math.random() * arrayQuestions.length)]

    res.render('trivia', {
        question: result2.addquestion,
        correctAnswer: result2.correctAnswer,
        incorrectAnswer1: result2.incorrectAnswer1,
        incorrectAnswer2: result2.incorrectAnswer2,
        question2: result3.addquestion,
        correctAnswer2: result3.correctAnswer,
        incorrectAnswer22: result3.incorrectAnswer1,
        incorrectAnswer22: result3.incorrectAnswer2,
        question3: result4.addquestion,
        correctAnswer3: result4.correctAnswer,
        incorrectAnswer33: result3.incorrectAnswer1,
        incorrectAnswer33: result3.incorrectAnswer2,
        question4: result5.addquestion,
        correctAnswer4: result5.correctAnswer,
        incorrectAnswer44: result5.incorrectAnswer1,
        incorrectAnswer44: result5.incorrectAnswer2,
    })
}

//Accion validar trivia
const validate = async (req, res) => {
    const goodAnswer = req.body;
try{
    await firestore.collection("correctAnswers").doc().set(goodAnswer);
    const logueo = await firestore.collection("correctAnswers");
    const data = await logueo.get();
    const arrayQuestions2 = [];
    if(data.empty){
        response.status(200).json({ message: "Not found"})
    } else {
        let total = 0;
        data.forEach((item) => {
            const login = new Answers(
                item.id,
                item.data().rp1,
                item.data().rp2,
                item.data().rp3
            );
            arrayQuestions2.push(login)
        });
    }
    console.log('....');
    res.render("finalTest", {answer1: goodAnswer.rp1, answer2:goodAnswer.rp2, answer3: goodAnswer.rp3})
}catch (error) {
    console.log(error) 
}
    if(data.empty){
        res.status(200).json({ mesagge: 'Not found'})
    } else {

    }
}
module.exports = {
    login,
    notFound,
    main,
    addquestion,
    register,
    trivias,
    loggedIn,
     registered,
    sendQuestions,
    questions,
    score,
    trivia

}