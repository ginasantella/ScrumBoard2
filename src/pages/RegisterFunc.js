import React, { Component, PropTypes } from 'react';
 
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  AlertIOS,
  NavigatorIOS,
} from 'react-native';
 
import Icon from 'react-native-vector-icons/FontAwesome';
import Container from '../components/Container';
import Button from '../components/Button';
import Label from '../components/Label';
import Home from './Home';
//import Register from './Register';
import navigator from './Navigation';
import config from '../../config';
import Login from './Login';
import firebaseApp from '../../node_modules/firebase/';
import firebase from 'firebase/app';

//const ActionButton = require('../components/ActionButton');
const StatusBar = require('../components/StatusBar');
var users;
//import * as firebaseConfig from 'firebase';
//const firebaseApp = firebase.initializeApp(firebaseConfig);
//const firebaseApp = Login.getFirebaseInstance;
 export default class RegisterFunc extends Component {
        constructor(props) {
            super(props);

            this.state = {
                firstname: "",
                lastname: "",
                username: "",
                password: "",
                conpassword: "",
                once: false,
            };
        //    this.toRegister = this.toRegister.bind(this);
        // this.toRegister = this.toRegister.bind(this);
            this.usersRef = this.getRef().child('users');
        }

        getRef() {
            return firebaseApp.database().ref();
        }

    render() {
        return (
            <ScrollView style={styles.scroll}>
                <Container>
                    <StatusBar title="Registration" />
                </Container>
                <Container>
                <Label text="First Name" />
                 <TextInput
                style={styles.textInput} 
                autoCapitalize= 'none'
                returnKeyType = "next"
                autoFocus = {true}
                onChangeText={(text) =>{
                    this.setState({firstname:text});
                }}/>
                </Container>
            <Container>
                <Label text="Last Name" />
                 <TextInput
                style={styles.textInput} 
                autoCapitalize= 'none'
                returnKeyType = "next"
                autoFocus = {true}
                onChangeText={(text) =>{
                    this.setState({lastname:text});
                }}/>
                </Container>
                <Container>
                <Label text="Username" />
                 <TextInput
                style={styles.textInput} 
                autoCapitalize= 'none'
                returnKeyType = "next"
                autoFocus = {true}
                onChangeText={(text) =>{
                    this.setState({username:text});
                }}/>
                </Container>
            <Container>
            <Label text="Password" />
                <TextInput
                    secureTextEntry={true}
                style={styles.textInput} 
                autoCapitalize= 'none'
                returnKeyType = "next"
                autoFocus = {true}
                onChangeText={(text) =>{
                    this.setState({password:text});
                }}/>
                </Container>
        <Container>
            <Label text="Confirm Password" />
                <TextInput
                    secureTextEntry={true}
                    style={styles.textInput}
                autoCapitalize= 'none'
                returnKeyType = "next"
                autoFocus = {true}
                onChangeText={(text) =>{
                    this.setState({conpassword:text});
                }}/>
                </Container>
                <View style={styles.footer}>
                    <Container>
                        <Button 
                            label="Register"
                            styles={{button: styles.primaryButton, label: styles.buttonWhiteText}} 
                            //navigator = {this.props.navigator}
                            onPress={this.toRegister.bind(this)} />
                    </Container>
                    <Container>
                        <Button 
                            label="CANCEL"
                            styles={{label: styles.buttonBlackText}} 
                            onPress={this.cancel.bind(this)} />
                    </Container>
                </View>
            </ScrollView> 
        );
    }
    cancel = () => {
          
        //execute any code here
         this.props.navigator.push({
      title: 'Login',
     component: Login
    });
}
    
 
     


    toRegister(){
        
        var firstName = this.state.firstname;
        var lastName = this.state.lastname;
        var inputUserName = this.state.username;
        var inputPassword = this.state.password;
        var confirmPassword = this.state.conpassword;
        var done=false;
        var once = this.state.once;
     
        if(once != true){

        this.usersRef.on("value", (snapshot) => {
            done = false;
            snapshot.forEach((child) => {
                console.log("****************************");
               console.log(child.val().id);
               console.log(this.state.username);
               console.log(inputUserName);
                if(child.val().id == inputUserName && once!=true){
                    done=true;
                    AlertIOS.alert(
                           'Error!',
                            'Username already exists!',
                           [
                            {text: 'Okay', onPress: () => this.props.navigator.push({
                                    title: 'Registration',
                                    component: RegisterFunc,
                                   
                   }), style: 'cancel'},
                        ]
                           );
                         //  return;
                }
                    
                       else{
                         //done=false;
                       }
                      //  this.props.navigator.push({
                       //      title: 'Home',
                       //      component: Home
                    //   });
                      //  }
                    

        });
        
         if((inputPassword != confirmPassword)&& once!=true){
                        done = true;   
                        AlertIOS.alert(
                            'Error!',
                            'The passwords entered do not match!',
                            [
                            {text: 'Okay', onPress: () => this.props.navigator.push({
                                    title: 'Registration',
                                    component: RegisterFunc,
                                   
                   }), style: 'cancel'},
                        ]
                            );    
                    }
                    else if((inputUserName==""||inputPassword==""||confirmPassword=="")&&once!=true){
                        done = true;   
                        AlertIOS.alert(
                            'Error!',
                            'All required fields must be filled!',
                            [
                            {text: 'Okay', onPress: () => this.props.navigator.push({
                                    title: 'Registration',
                                    component: RegisterFunc,
                                   
                   }), style: 'cancel'},
                        ]
                            );
                       
                     
                        }
                        
        //  if(child.val().id!=inputUserName && inputUserName != "" && inputPassword != "" && confirmPassword !="" && inputPassword==confirmPassword){
                        
           // }     
    
  //  console.log("**********************ex user"+existingUser)
         if(done == false && once!=true){
           // var correctUserName = this.state.username;
           this.state.once=true;
            once=true;
             this.usersRef.push( {first : firstName ,
                        last: lastName,
                        id: inputUserName,
                        password: inputPassword,   
            })
             AlertIOS.alert(
                        'Success!',
                        'Click Okay to log in',
                        [
                            {text: 'Okay', onPress: () => this.props.navigator.push({
                                    title: 'Login',
                                    component: Login,
                                   
                   }), style: 'cancel'},
                        ]
                        );         
            
            }

            });
        }   
    //}
    }
   
   //  console.log("*****************************");
  // for(var i=0; i<this.props.level; i++){
      //  console.log("\n*********************"+users[i]);
      //  if(users[i]!=inputUserName && inputUserName != "" && inputPassword != "" && confirmPassword !="" && inputPassword==confirmPassword){
          //this.usersRef.push( {first : firstName ,
                      //  last: lastName,
                      //  id: inputUserName,
                     //   password: inputPassword}) 
         //}         
   // }
       
//}
 //end of class
    }

    const styles = StyleSheet.create({
    scroll: {
        backgroundColor: '#E1D7D8',
        padding: 30,
        flexDirection: 'column'
    },
    label: {
        color: '#0d8898',
        fontSize: 15
    },
    alignRight: {
        alignSelf: 'flex-end'
    },
    textInput: {
        height: 40,
        fontSize: 15,
        backgroundColor: '#FFF'
    },
    buttonWhiteText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: "500",
        textAlign: 'center',
        fontFamily: "Helvetica"
    },
    buttonBlackText: {
        fontSize: 20,
        color: '#595856'
    },
    primaryButton: {
        backgroundColor: '#4169E1',
        borderColor: 'transparent',
        borderWidth: 1,
        paddingLeft: 16,
        paddingTop: 10,
        paddingBottom: 10,
    },
    footer: {
    marginTop: 40
    }

    });